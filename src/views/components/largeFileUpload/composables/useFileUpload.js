import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { UPLOAD_CONFIG, UPLOAD_STATUS } from '../utils/constants.js'
import { getOptimalChunkSize } from '../utils/fileUtils.js'
import uploadApi from '../utils/uploadApi.js'
import { useFileHash } from './useFileHash.js'
import { useUploadProgress } from './useUploadProgress.js'
import { formatSize, formatTime } from '../utils/fileUtils.js'

export function useFileUpload() {
	const currentFile = ref(null)
	const uploadStatus = ref(UPLOAD_STATUS.IDLE)

	const uploadController = reactive({
		chunks: [],
		chunkCount: 0,
		uploadedChunks: 0,
		fileHash: '',
		fileName: '',
		chunkSize: UPLOAD_CONFIG.BASE_CHUNK_SIZE,
		isPaused: false,
		uploadingChunks: new Set(),
		retryingChunks: new Map()
	})

	const { preparingProgress, hashCalculationComplete, calculateFileHash, resetHash } = useFileHash()

	const {
		uploadProgress,
		uploadSpeed,
		remainingTime,
		progressStats,
		startProgressTracking,
		updateUploadedBytes,
		stopProgressTracking,
		resetProgress
	} = useUploadProgress()

	const prepareUpload = async (file) => {
		currentFile.value = file
		uploadStatus.value = UPLOAD_STATUS.UPLOADING
		resetProgress()
		resetHash()

		try {
			const optimalChunkSize = getOptimalChunkSize(file.size)

			// 同步等待哈希计算完成
			const fileHash = await calculateFileHash(file, optimalChunkSize)

			// 检查秒传
			const checkResult = await uploadApi.checkFileExists(fileHash, file.name, file.size)
			if (checkResult.code === 0 && checkResult.exists) {
				uploadStatus.value = UPLOAD_STATUS.SUCCESS
				uploadProgress.value = 100
				stopProgressTracking()
				ElMessage.success('文件已存在，秒传成功！')
				return
			}

			// 初始化控制器
			Object.assign(uploadController, {
				chunks: [],
				chunkCount: Math.ceil(file.size / optimalChunkSize),
				uploadedChunks: 0,
				fileHash: fileHash, // 直接使用计算出的哈希
				fileName: file.name,
				chunkSize: optimalChunkSize,
				isPaused: false,
				uploadingChunks: new Set(),
				retryingChunks: new Map()
			})

			// 创建分片
			createChunks(file, optimalChunkSize, fileHash)

			// 开始上传
			startUpload()
		} catch (error) {
			ElMessage.error('准备上传失败：' + error.message)
			uploadStatus.value = UPLOAD_STATUS.ERROR
		}
	}

	const createChunks = (file, chunkSize, tempId) => {
		for (let i = 0; i < uploadController.chunkCount; i++) {
			const start = i * chunkSize
			const end = Math.min(file.size, start + chunkSize)
			const chunk = file.slice(start, end)

			uploadController.chunks.push({
				index: i,
				hash: `${i}-${tempId}`,
				chunk,
				size: chunk.size,
				uploaded: false
			})
		}
	}

	const updateChunksHash = (fileHash) => {
		uploadController.chunks.forEach((chunk) => {
			if (!chunk.uploaded) {
				chunk.hash = `${chunk.index}-${fileHash}`
			}
		})
	}

	const startUpload = () => {
		uploadController.isPaused = false
		uploadStatus.value = UPLOAD_STATUS.UPLOADING
		startProgressTracking(currentFile.value.size)
		processNextChunks()
	}

	const processNextChunks = () => {
		if (uploadController.isPaused) return

		const pendingChunks = uploadController.chunks.filter(
			(chunk) => !chunk.uploaded && !uploadController.uploadingChunks.has(chunk.index)
		)

		const availableSlots = UPLOAD_CONFIG.MAX_CONCURRENT_UPLOADS - uploadController.uploadingChunks.size

		for (let i = 0; i < Math.min(availableSlots, pendingChunks.length); i++) {
			uploadChunk(pendingChunks[i])
		}

		// 检查是否完成
		if (uploadController.uploadedChunks === uploadController.chunkCount && !uploadController.isPaused) {
			mergeChunks()
		}
	}

	const uploadChunk = async (chunk, retryCount = 0) => {
		if (uploadController.isPaused) return

		uploadController.uploadingChunks.add(chunk.index)

		try {
			const result = await uploadApi.uploadChunk(
				chunk.chunk,
				chunk.hash,
				uploadController.fileHash,
				uploadController.fileName
			)

			if (result.code !== 0) {
				throw new Error(result.message || '上传分片失败')
			}

			// 成功处理
			uploadController.retryingChunks.delete(chunk.index)
			chunk.uploaded = true
			uploadController.uploadedChunks++

			updateUploadedBytes(
				progressStats.uploadedBytes + chunk.size,
				uploadController.chunkCount,
				uploadController.uploadedChunks
			)

			uploadController.uploadingChunks.delete(chunk.index)
			processNextChunks()
		} catch (error) {
			uploadController.uploadingChunks.delete(chunk.index)

			// 重试机制
			if (retryCount < UPLOAD_CONFIG.MAX_RETRY && !uploadController.isPaused) {
				uploadController.retryingChunks.set(chunk.index, retryCount + 1)
				console.log(`分片 ${chunk.index} 第 ${retryCount + 1} 次重试`)

				const delay = Math.pow(2, retryCount) * 1000
				await new Promise((resolve) => setTimeout(resolve, delay))

				return uploadChunk(chunk, retryCount + 1)
			}

			// 重试失败
			uploadController.retryingChunks.delete(chunk.index)
			console.error(`分片 ${chunk.index} 重试失败:`, error)

			if (!uploadController.isPaused) {
				uploadStatus.value = UPLOAD_STATUS.ERROR
				ElMessage.error(`分片 ${chunk.index} 上传失败：${error.message}`)
			}
		}
	}

	const mergeChunks = async () => {
		try {
			const result = await uploadApi.mergeChunks(
				uploadController.fileHash,
				uploadController.fileName,
				currentFile.value.size
			)

			if (result.code !== 0) {
				throw new Error(result.message || '合并文件失败')
			}

			uploadStatus.value = UPLOAD_STATUS.SUCCESS
			stopProgressTracking()
			ElMessage.success('文件上传成功')

			// 后台静默校验
			// uploadApi.verifyFile(uploadController.fileHash, uploadController.fileName)
			//   .then(result => {
			//     if (result.code === 0 && result.verified) {
			//       console.log('文件完整性校验通过')
			//     } else {
			//       ElMessage.warning('文件可能存在异常，建议重新上传')
			//     }
			//   })
		} catch (error) {
			uploadStatus.value = UPLOAD_STATUS.ERROR
			ElMessage.error('合并文件失败：' + error.message)
		}
	}

	const pauseUpload = () => {
		uploadController.isPaused = true
		uploadStatus.value = UPLOAD_STATUS.PAUSED
		stopProgressTracking()
	}

	const resumeUpload = () => {
		uploadController.isPaused = false
		uploadStatus.value = UPLOAD_STATUS.UPLOADING
		startProgressTracking(currentFile.value.size)
		processNextChunks()
	}

	const cancelUpload = () => {
		uploadController.isPaused = true
		resetUploader()
	}

	const resetUploader = () => {
		currentFile.value = null
		uploadStatus.value = UPLOAD_STATUS.IDLE
		resetProgress()
		resetHash()

		Object.assign(uploadController, {
			chunks: [],
			chunkCount: 0,
			uploadedChunks: 0,
			fileHash: '',
			fileName: '',
			chunkSize: UPLOAD_CONFIG.BASE_CHUNK_SIZE,
			isPaused: false,
			uploadingChunks: new Set(),
			retryingChunks: new Map()
		})
	}

	return {
		// 状态
		currentFile,
		uploadStatus,
		uploadProgress,
		uploadSpeed,
		remainingTime,
		preparingProgress,
		hashCalculationComplete,
		uploadController,
		progressStats,

		// 方法
		prepareUpload,
		pauseUpload,
		resumeUpload,
		cancelUpload,
		resetUploader
	}
}
