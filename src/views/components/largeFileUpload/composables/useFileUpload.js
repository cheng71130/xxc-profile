import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { UPLOAD_CONFIG, UPLOAD_STATUS } from '../utils/constants.js'
import { getOptimalChunkSize } from '../utils/fileUtils.js'
import uploadApi from '../utils/uploadApi.js'
import { useFileHash } from './useFileHash.js'
import { useUploadProgress } from './useUploadProgress.js'
import { useUploadPersistence } from './useUploadPersistence.js'
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

	// 使用持久化管理
	const {
		saveUploadState,
		getUploadState,
		removeUploadState,
		cleanExpiredUploads,
		showRestoreDialog,
		setupBeforeUnload
	} = useUploadPersistence()

	// 页面离开前保存状态的清理函数
	let cleanupBeforeUnload = null

	// 获取当前上传状态（用于持久化）
	const getCurrentUploadState = () => {
		if (!currentFile.value || uploadStatus.value === UPLOAD_STATUS.IDLE) {
			return null
		}

		return {
			fileHash: uploadController.fileHash,
			fileName: uploadController.fileName,
			fileSize: currentFile.value.size,
			chunkCount: uploadController.chunkCount,
			chunkSize: uploadController.chunkSize,
			uploadedChunks: uploadController.chunks.filter((chunk) => chunk.uploaded).map((chunk) => chunk.index),
			status: uploadStatus.value,
			progress: uploadProgress.value
		}
	}

	// 从持久化状态恢复上传
	const restoreFromPersistentState = async (persistentState, file) => {
		try {
			console.log('恢复上传状态:', persistentState.fileName)

			// 重置状态
			resetProgress()
			resetHash()

			// 恢复文件信息
			currentFile.value = file
			uploadStatus.value = UPLOAD_STATUS.UPLOADING

			// 重新计算文件哈希（确保文件一致性）
			console.log('重新验证文件哈希...')
			const optimalChunkSize = getOptimalChunkSize(file.size)
			const fileHash = await calculateFileHash(file, optimalChunkSize)

			// 验证文件哈希是否一致
			if (fileHash !== persistentState.fileHash) {
				ElMessage.warning('文件已被修改，无法恢复上传')
				removeUploadState(persistentState.fileHash)
				uploadStatus.value = UPLOAD_STATUS.IDLE
				return false
			}

			// 恢复上传控制器状态
			Object.assign(uploadController, {
				fileHash: fileHash,
				fileName: file.name,
				chunkSize: optimalChunkSize,
				chunkCount: persistentState.chunkCount,
				uploadedChunks: persistentState.uploadedChunks.length,
				isPaused: false,
				uploadingChunks: new Set(),
				retryingChunks: new Map()
			})

			// 重新创建分片
			createChunks(file, optimalChunkSize, fileHash)

			// 标记已上传的分片
			persistentState.uploadedChunks.forEach((chunkIndex) => {
				if (uploadController.chunks[chunkIndex]) {
					uploadController.chunks[chunkIndex].uploaded = true
				}
			})

			// 更新进度显示
			const uploadedBytes = uploadController.chunks.filter((c) => c.uploaded).reduce((total, c) => total + c.size, 0)

			updateUploadedBytes(uploadedBytes, uploadController.chunkCount, uploadController.uploadedChunks)

			ElMessage.success(
				`恢复上传: ${persistentState.fileName} (${Math.floor(
					(persistentState.uploadedChunks.length / persistentState.chunkCount) * 100
				)}%)`
			)

			// 开始上传
			startUpload()

			return true
		} catch (error) {
			console.error('恢复上传状态失败:', error)
			ElMessage.error('恢复上传失败: ' + error.message)
			removeUploadState(persistentState.fileHash)
			uploadStatus.value = UPLOAD_STATUS.IDLE
			return false
		}
	}

	// 修改 prepareUpload 方法，加入持久化检查
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

			// 检查是否有这个文件的持久化状态
			const persistentState = getUploadState(fileHash)

			if (persistentState) {
				console.log('发现持久化状态，询问是否恢复...')

				// 询问是否恢复这个特定文件
				const shouldRestore = await showRestoreDialog(persistentState)

				if (shouldRestore) {
					const restored = await restoreFromPersistentState(persistentState, file)
					if (restored) {
						return // 恢复成功，直接返回
					}
				} else {
					// 用户选择不恢复，清除该状态
					removeUploadState(fileHash)
				}
			}

			// 初始化控制器
			Object.assign(uploadController, {
				chunks: [],
				chunkCount: Math.ceil(file.size / optimalChunkSize),
				uploadedChunks: 0,
				fileHash: fileHash,
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

	// 修改 startUpload 方法，加入持久化监听
	const startUpload = () => {
		uploadController.isPaused = false
		uploadStatus.value = UPLOAD_STATUS.UPLOADING
		startProgressTracking(currentFile.value.size)

		// 设置页面离开监听
		cleanupBeforeUnload = setupBeforeUnload(getCurrentUploadState)

		processNextChunks()
	}

	const processNextChunks = () => {
		if (uploadController.isPaused) return

		// 筛选待上传分片
		const pendingChunks = uploadController.chunks.filter(
			(chunk) => !chunk.uploaded && !uploadController.uploadingChunks.has(chunk.index)
		)

		// 计算可用槽位
		const availableSlots = UPLOAD_CONFIG.MAX_CONCURRENT_UPLOADS - uploadController.uploadingChunks.size

		// 填充上传队列
		for (let i = 0; i < Math.min(availableSlots, pendingChunks.length); i++) {
			uploadChunk(pendingChunks[i])
		}

		// 检查是否完成
		if (uploadController.uploadedChunks === uploadController.chunkCount && !uploadController.isPaused) {
			mergeChunks()
		}
	}

	// 修改 uploadChunk 方法，加入持久化保存
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

			// 定期保存状态（每上传5个分片保存一次，避免频繁写入）
			if (uploadController.uploadedChunks % 5 === 0) {
				saveUploadState(getCurrentUploadState())
			}

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
				// 保存当前状态以便恢复
				saveUploadState(getCurrentUploadState())
				ElMessage.error(`分片 ${chunk.index} 上传失败：${error.message}`)
			}
		}
	}

	// 修改 mergeChunks 方法，完成后清除持久化状态
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

			// 上传完成，清除持久化状态
			removeUploadState(uploadController.fileHash)

			// 清理页面离开监听
			if (cleanupBeforeUnload) {
				cleanupBeforeUnload()
				cleanupBeforeUnload = null
			}

			ElMessage.success('文件上传成功')
		} catch (error) {
			uploadStatus.value = UPLOAD_STATUS.ERROR
			// 保存当前状态以便恢复
			saveUploadState(getCurrentUploadState())
			ElMessage.error('合并文件失败：' + error.message)
		}
	}

	// 修改 pauseUpload 方法，暂停时保存状态
	const pauseUpload = () => {
		uploadController.isPaused = true
		uploadStatus.value = UPLOAD_STATUS.PAUSED
		stopProgressTracking()

		// 保存当前状态
		saveUploadState(getCurrentUploadState())

		// 保持页面离开监听（因为暂停状态下离开页面也要提示）
		if (!cleanupBeforeUnload) {
			cleanupBeforeUnload = setupBeforeUnload(getCurrentUploadState)
		}
	}

	// 修改 resumeUpload 方法
	const resumeUpload = () => {
		uploadController.isPaused = false
		uploadStatus.value = UPLOAD_STATUS.UPLOADING
		startProgressTracking(currentFile.value.size)

		// 重新设置页面离开监听
		cleanupBeforeUnload = setupBeforeUnload(getCurrentUploadState)

		processNextChunks()
	}

	// 修改 cancelUpload 方法，取消时清除持久化状态
	const cancelUpload = () => {
		uploadController.isPaused = true

		// 清除持久化状态
		if (uploadController.fileHash) {
			removeUploadState(uploadController.fileHash)
		}

		// 清理页面离开监听（取消时不需要监听）
		if (cleanupBeforeUnload) {
			cleanupBeforeUnload()
			cleanupBeforeUnload = null
		}

		resetUploader()
	}

	const resetUploader = () => {
		currentFile.value = null
		uploadStatus.value = UPLOAD_STATUS.IDLE
		resetProgress()
		resetHash()

		// 清理页面离开监听
		if (cleanupBeforeUnload) {
			cleanupBeforeUnload()
			cleanupBeforeUnload = null
		}

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

	// 组件挂载时清理过期记录
	onMounted(() => {
		cleanExpiredUploads()
	})

	// 组件卸载时清理
	onUnmounted(() => {
		if (cleanupBeforeUnload) {
			cleanupBeforeUnload()
		}
	})

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
