<template>
	<div class="file-uploader-container">
		<!-- 上传区域 -->
		<div
			class="upload-area"
			:class="{ 'is-dragover': isDragover }"
			@dragenter.prevent="isDragover = true"
			@dragover.prevent="isDragover = true"
			@dragleave.prevent="isDragover = false"
			@drop.prevent="handleDrop"
		>
			<div v-if="!currentFile" class="upload-placeholder">
				<el-icon class="upload-icon"><Upload /></el-icon>
				<div class="upload-text">
					<span class="upload-button" @click="triggerFileInput">点击上传</span>或将文件拖到此处
				</div>
				<div class="upload-tip">支持任意类型文件，单个文件大小不超过10GB</div>
				<input ref="fileInput" type="file" class="hidden-input" @change="handleFileChange" />
			</div>

			<div v-else class="upload-progress">
				<div class="file-info">
					<div class="file-name-wrapper">
						<el-icon class="file-icon" v-if="isVideo(currentFile.name)"><VideoCamera /></el-icon>
						<el-icon class="file-icon" v-else-if="isImage(currentFile.name)"><Picture /></el-icon>
						<el-icon class="file-icon" v-else-if="isPdf(currentFile.name)"><Document /></el-icon>
						<el-icon class="file-icon" v-else-if="isArchive(currentFile.name)"><Folder /></el-icon>
						<el-icon class="file-icon" v-else><Files /></el-icon>
						<div class="file-name">{{ currentFile.name }}</div>
					</div>
					<div class="file-size">{{ formatSize(currentFile.size) }}</div>
				</div>

				<div class="upload-stats">
					<div class="progress-wrapper">
						<div class="progress-bar">
							<div
								class="progress-inner"
								:class="{
									success: uploadStatus === 'success',
									error: uploadStatus === 'error',
									paused: uploadStatus === 'paused'
								}"
								:style="{ width: `${uploadProgress}%` }"
							></div>
						</div>
						<div class="progress-text">{{ uploadProgress }}%</div>
					</div>

					<div class="upload-info-row">
						<!-- 左侧：状态信息区域 -->
						<div class="upload-status-info">
							<!-- 上传中状态 -->
							<template v-if="uploadStatus === 'uploading'">
								<span class="upload-bytes">
									<el-icon class="mr8"><Upload /></el-icon>
									已上传：{{ formatSize(uploadController.uploadedBytes) }}/{{ formatSize(currentFile.size) }}
								</span>
								<span v-if="uploadSpeed" class="upload-speed"> 当前速度：{{ uploadSpeed }} </span>
								<span v-if="remainingTime" class="upload-time"> 剩余时间：{{ remainingTime }} </span>
								<span v-if="!hashCalculationComplete" class="hash-calculating">
									(特征码计算中: {{ preparingProgress }}%)
								</span>
							</template>

							<!-- 上传完成状态 -->
							<template v-else-if="uploadStatus === 'success'">
								<span class="success-message">
									<el-icon><CircleCheckFilled /></el-icon> 上传成功
								</span>
							</template>

							<!-- 上传错误状态 -->
							<template v-else-if="uploadStatus === 'error'">
								<span class="error-message">
									<el-icon><CircleCloseFilled /></el-icon> 上传失败
								</span>
							</template>

							<!-- 已暂停状态 -->
							<template v-else-if="uploadStatus === 'paused'">
								<span class="paused-message">
									<el-icon><VideoPause /></el-icon> 已暂停
								</span>
							</template>
						</div>

						<!-- 右侧：操作按钮区域 -->
						<!-- 上传中状态按钮 -->
						<div v-if="uploadStatus === 'uploading'" class="action-buttons-group">
							<button class="action-button icon-button pause-button" title="暂停" @click="pauseUpload">
								<el-icon><VideoPause /></el-icon>
							</button>
							<button class="action-button icon-button cancel-button" title="取消" @click="cancelUpload">
								<el-icon><CircleClose /></el-icon>
							</button>
						</div>

						<!-- 暂停状态按钮 -->
						<div v-else-if="uploadStatus === 'paused'" class="action-buttons-group">
							<button class="action-button icon-button resume-button" title="继续" @click="resumeUpload">
								<el-icon><VideoPlay /></el-icon>
							</button>
							<button class="action-button icon-button cancel-button" title="取消" @click="cancelUpload">
								<el-icon><CircleClose /></el-icon>
							</button>
						</div>

						<!-- 错误状态按钮 -->
						<div v-else-if="uploadStatus === 'error'" class="action-buttons-group">
							<button class="action-button icon-button cancel-button" title="取消" @click="cancelUpload">
								<el-icon><CircleClose /></el-icon>
							</button>
						</div>

						<!-- 成功状态按钮 -->
						<!-- <div v-else-if="uploadStatus === 'success'" class="action-buttons-group">
							<el-button type="primary" round size="small" @click="resetUploader">完成</el-button>
						</div> -->
					</div>
				</div>
			</div>
		</div>

		<!-- 文件列表 -->
		<div class="file-list-container" v-if="fileList.length > 0">
			<h3 class="file-list-title">已上传文件</h3>

			<div class="file-cards">
				<div v-for="file in fileList" :key="file.name" class="file-card">
					<div class="file-card-icon">
						<el-icon v-if="isVideo(file.name)"><VideoCamera /></el-icon>
						<el-icon v-else-if="isImage(file.name)"><Picture /></el-icon>
						<el-icon v-else-if="isPdf(file.name)"><Document /></el-icon>
						<el-icon v-else-if="isArchive(file.name)"><Folder /></el-icon>
						<el-icon v-else><Files /></el-icon>
					</div>

					<div class="file-card-content">
						<div class="file-card-name" :title="file.name">{{ file.name }}</div>
						<div class="file-card-info">
							<span class="file-card-size">{{ formatSize(file.size) }}</span>
							<span class="file-card-date">{{ formatDate(file.createTime) }}</span>
						</div>
					</div>

					<div class="file-card-actions">
						<button class="card-button download-button" @click="downloadFile(file)" title="下载">
							<el-icon><Download /></el-icon>
						</button>
					</div>
				</div>
			</div>
		</div>

		<div v-if="uploadStatus === 'success'" style="margin-top: 50px; text-align: center">
			<el-button type="primary" @click="resetUploader">继续上传</el-button>
		</div>
	</div>
</template>

<script setup>
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { ref, reactive, onMounted } from 'vue'
	import HashWorker from './hash.worker.js?worker'

	// 配置
	const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB分片大小
	const MAX_CONCURRENT_UPLOADS = 3 // 最大并发上传数
	const API_BASE_URL = 'http://localhost:3000' // API基础URL

	// 引用和状态
	const fileInput = ref(null)
	const isDragover = ref(false)
	const currentFile = ref(null)
	const fileList = ref([])
	const uploadProgress = ref(0)
	const uploadSpeed = ref('')
	const remainingTime = ref('')
	const uploadStatus = ref('') // 'uploading', 'paused', 'error', 'success'
	const preparingProgress = ref(0) // 计算文件hash时的进度
	const hashCalculationComplete = ref(false) // 哈希计算是否完成的标记

	// 上传控制状态
	const uploadController = reactive({
		chunks: [],
		chunkCount: 0,
		uploadedChunks: 0,
		fileHash: '',
		fileName: '',
		chunkSize: CHUNK_SIZE,
		isPaused: false,
		uploadingChunks: new Set(),
		startTime: 0,
		uploadedBytes: 0,
		previousUploadedBytes: 0,
		lastUpdateTime: 0
	})

	// 文件类型判断
	const isVideo = (filename) => {
		return /\.(mp4|avi|mov|mkv|wmv)$/i.test(filename)
	}

	const isImage = (filename) => {
		return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename)
	}

	const isPdf = (filename) => {
		return /\.pdf$/i.test(filename)
	}

	const isArchive = (filename) => {
		return /\.(zip|rar|tar|gz|7z)$/i.test(filename)
	}

	// 格式化文件大小
	const formatSize = (bytes) => {
		if (bytes === 0) return '0 B'
		const k = 1024
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
	}

	// 格式化日期
	const formatDate = (dateStr) => {
		const date = new Date(dateStr)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')

		return `${year}-${month}-${day} ${hours}:${minutes}`
	}

	// 触发文件选择
	const triggerFileInput = () => {
		if (fileInput.value) {
			fileInput.value.click()
		}
	}

	// 处理文件选择
	const handleFileChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			prepareUpload(file)
		}
	}

	// 处理拖放
	const handleDrop = (e) => {
		isDragover.value = false
		const file = e.dataTransfer.files[0]
		if (file) {
			prepareUpload(file)
		}
	}

	// 使用Web Worker计算文件哈希
	const calculateFileHash = (file) => {
		return new Promise((resolve, reject) => {
			// 检查浏览器是否支持Web Worker
			if (typeof Worker === 'undefined') {
				return reject(new Error('您的浏览器不支持Web Worker，请更换浏览器后重试'))
			}

			// 创建Web Worker
			const worker = new HashWorker()

			worker.onmessage = (e) => {
				const data = e.data

				if (data.type === 'progress') {
					// 更新哈希计算进度
					preparingProgress.value = data.percentage
				} else if (data.type === 'complete') {
					// 哈希计算完成
					hashCalculationComplete.value = true
					resolve(data.hash)
					worker.terminate() // 终止worker
				} else if (data.type === 'error') {
					reject(new Error(data.message))
					worker.terminate()
				}
			}

			worker.onerror = (err) => {
				reject(new Error('Worker错误: ' + err.message))
				worker.terminate()
			}

			// 发送文件和配置给Worker
			worker.postMessage({
				file: file,
				chunkSize: CHUNK_SIZE
			})
		})
	}

	// 准备上传
	const prepareUpload = async (file) => {
		currentFile.value = file
		uploadStatus.value = 'uploading' // 直接进入上传状态
		uploadProgress.value = 0
		preparingProgress.value = 0
		hashCalculationComplete.value = false

		try {
			// 生成临时ID (用于立即开始上传)
			const tempId = `temp-${Date.now()}-${file.name}`

			// 初始化上传控制器，使用临时ID
			Object.assign(uploadController, {
				chunks: [],
				chunkCount: Math.ceil(file.size / CHUNK_SIZE),
				uploadedChunks: 0,
				fileHash: tempId, // 临时使用时间戳ID
				fileName: file.name,
				isPaused: false,
				uploadingChunks: new Set(),
				startTime: Date.now(),
				uploadedBytes: 0,
				previousUploadedBytes: 0,
				lastUpdateTime: Date.now()
			})

			// 创建分片
			for (let i = 0; i < uploadController.chunkCount; i++) {
				const start = i * CHUNK_SIZE
				const end = Math.min(file.size, start + CHUNK_SIZE)
				const chunk = file.slice(start, end)

				uploadController.chunks.push({
					index: i,
					hash: `${i}-${tempId}`, // 使用临时ID
					chunk,
					size: chunk.size,
					uploaded: false,
					progress: 0
				})
			}

			// 启动哈希计算，但不等待它完成
			calculateFileHash(file)
				.then((fileHash) => {
					// 哈希计算完成后更新
					console.log('文件哈希计算完成:', fileHash)
					uploadController.fileHash = fileHash

					// 更新所有分片的hash (对于尚未上传的分片)
					uploadController.chunks.forEach((chunk) => {
						if (!chunk.uploaded) {
							chunk.hash = `${chunk.index}-${fileHash}`
						}
					})
				})
				.catch((error) => {
					console.error('哈希计算失败:', error)
					// 哈希计算失败不影响上传过程，继续使用临时ID
				})

			// 立即开始上传
			startUpload()
		} catch (error) {
			ElMessage.error('准备上传失败：' + error.message)
			uploadStatus.value = 'error'
		}
	}

	// 开始上传
	const startUpload = () => {
		uploadController.isPaused = false
		uploadController.startTime = Date.now()
		uploadController.lastUpdateTime = Date.now()
		uploadStatus.value = 'uploading'

		// 初始阶段显示"计算中..."
		uploadSpeed.value = '计算中...'
		remainingTime.value = '计算中...'

		// 上传尚未上传的分片
		processNextChunks()

		// 快速更新 - 300ms后进行第一次计算
		setTimeout(() => {
			if (uploadController.uploadedBytes > 0) {
				const timePassed = (Date.now() - uploadController.startTime) / 1000
				if (timePassed > 0) {
					const initialSpeed = uploadController.uploadedBytes / timePassed
					uploadSpeed.value = formatSize(initialSpeed) + '/s'

					const remainingBytes = currentFile.value.size - uploadController.uploadedBytes
					const secondsRemaining = Math.ceil(remainingBytes / initialSpeed)

					if (secondsRemaining < 60) {
						remainingTime.value = `${secondsRemaining}秒`
					} else if (secondsRemaining < 3600) {
						remainingTime.value = `${Math.floor(secondsRemaining / 60)}分${secondsRemaining % 60}秒`
					} else {
						remainingTime.value = `${Math.floor(secondsRemaining / 3600)}时${Math.floor(
							(secondsRemaining % 3600) / 60
						)}分`
					}
				}
			}
		}, 300)

		// 定时更新上传速度和剩余时间
		const updateIntervalId = setInterval(() => {
			if (uploadController.isPaused) return

			const now = Date.now()
			const timeElapsed = (now - uploadController.lastUpdateTime) / 1000

			if (timeElapsed > 0) {
				const bytesUploaded = uploadController.uploadedBytes - uploadController.previousUploadedBytes
				const bytesPerSecond = bytesUploaded / timeElapsed

				if (bytesPerSecond > 0) {
					uploadSpeed.value = formatSize(bytesPerSecond) + '/s'

					// 计算剩余时间
					const remainingBytes = currentFile.value.size - uploadController.uploadedBytes
					const secondsRemaining = Math.ceil(remainingBytes / bytesPerSecond)

					if (secondsRemaining < 60) {
						remainingTime.value = `${secondsRemaining}秒`
					} else if (secondsRemaining < 3600) {
						remainingTime.value = `${Math.floor(secondsRemaining / 60)}分${secondsRemaining % 60}秒`
					} else {
						remainingTime.value = `${Math.floor(secondsRemaining / 3600)}时${Math.floor(
							(secondsRemaining % 3600) / 60
						)}分`
					}
				}

				uploadController.previousUploadedBytes = uploadController.uploadedBytes
				uploadController.lastUpdateTime = now
			}

			// 所有分片上传完成后清除定时器
			if (uploadController.uploadedChunks === uploadController.chunkCount) {
				clearInterval(updateIntervalId)
			}
		}, 1000)
	}

	// 处理下一批分片
	const processNextChunks = () => {
		if (uploadController.isPaused) return

		const pendingChunks = uploadController.chunks.filter(
			(chunk) => !chunk.uploaded && !uploadController.uploadingChunks.has(chunk.index)
		)

		const availableSlots = MAX_CONCURRENT_UPLOADS - uploadController.uploadingChunks.size

		for (let i = 0; i < Math.min(availableSlots, pendingChunks.length); i++) {
			const chunk = pendingChunks[i]
			uploadChunk(chunk)
		}

		// 如果所有分片已上传，则合并文件
		if (uploadController.uploadedChunks === uploadController.chunkCount && !uploadController.isPaused) {
			mergeChunks()
		}
	}

	// 上传单个分片
	const uploadChunk = async (chunk) => {
		if (uploadController.isPaused) return

		uploadController.uploadingChunks.add(chunk.index)

		try {
			const formData = new FormData()
			formData.append('chunk', chunk.chunk)
			formData.append('hash', chunk.hash)
			formData.append('fileHash', uploadController.fileHash)
			formData.append('filename', uploadController.fileName)

			const response = await fetch(`${API_BASE_URL}/upload`, {
				method: 'POST',
				body: formData
			})

			const result = await response.json()

			if (result.code !== 0) {
				throw new Error(result.message || '上传分片失败')
			}

			// 更新状态
			chunk.uploaded = true
			uploadController.uploadedChunks++
			uploadController.uploadedBytes += chunk.size

			// 更新总进度
			uploadProgress.value = Math.floor((uploadController.uploadedChunks / uploadController.chunkCount) * 100)

			// 继续处理下一批分片
			uploadController.uploadingChunks.delete(chunk.index)
			processNextChunks()
		} catch (error) {
			console.error('上传分片失败:', error)
			uploadController.uploadingChunks.delete(chunk.index)

			if (!uploadController.isPaused) {
				// 如果上传失败且不是暂停状态，设置为错误状态
				uploadStatus.value = 'error'
				ElMessage.error('分片上传失败：' + error.message)
			}
		}
	}

	// 合并分片
	const mergeChunks = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/merge`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					fileHash: uploadController.fileHash,
					fileName: uploadController.fileName,
					size: currentFile.value.size
				})
			})

			const result = await response.json()

			if (result.code !== 0) {
				throw new Error(result.message || '合并文件失败')
			}

			uploadStatus.value = 'success'
			ElMessage.success('文件上传成功')

			// 刷新文件列表
			fetchFileList()
		} catch (error) {
			uploadStatus.value = 'error'
			ElMessage.error('合并文件失败：' + error.message)
		}
	}

	// 暂停上传
	const pauseUpload = () => {
		uploadController.isPaused = true
		uploadStatus.value = 'paused'
	}

	// 恢复上传
	const resumeUpload = () => {
		uploadController.isPaused = false
		uploadStatus.value = 'uploading'
		processNextChunks()
	}

	// 取消上传
	const cancelUpload = async () => {
		try {
			await ElMessageBox.confirm('确定要取消上传吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})

			uploadController.isPaused = true
			resetUploader()
		} catch {
			// 用户取消了操作
		}
	}

	// 重置上传器
	const resetUploader = () => {
		// 安全地重置文件输入框
		if (fileInput.value) {
			const newFileInput = document.createElement('input')
			newFileInput.type = 'file'
			newFileInput.className = 'hidden-input'
			newFileInput.addEventListener('change', handleFileChange)

			// 替换旧的文件输入框
			if (fileInput.value.parentNode) {
				fileInput.value.parentNode.replaceChild(newFileInput, fileInput.value)
			}
			fileInput.value = newFileInput
		}

		currentFile.value = null
		uploadProgress.value = 0
		uploadSpeed.value = ''
		remainingTime.value = ''
		uploadStatus.value = ''
		preparingProgress.value = 0
		hashCalculationComplete.value = false

		Object.assign(uploadController, {
			chunks: [],
			chunkCount: 0,
			uploadedChunks: 0,
			fileHash: '',
			fileName: '',
			isPaused: false,
			uploadingChunks: new Set(),
			startTime: 0,
			uploadedBytes: 0,
			previousUploadedBytes: 0,
			lastUpdateTime: 0
		})
	}

	// 获取文件列表
	const fetchFileList = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/files`)
			const result = await response.json()

			if (result.code === 0) {
				fileList.value = result.data
			} else {
				ElMessage.warning('获取文件列表失败')
			}
		} catch (error) {
			console.error('获取文件列表失败:', error)
		}
	}

	// 下载文件
	const downloadFile = (file) => {
		const url = `${API_BASE_URL}/uploads/${file.name}`
		window.open(url, '_blank')
	}

	// 组件挂载时获取文件列表
	onMounted(() => {
		fetchFileList()
	})
</script>

<style scoped lang="scss">
	.file-uploader-container {
		width: 100%;
		max-width: 900px;
		padding-top: 100px;
		margin: 0 auto;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;

		.upload-area {
			border: 2px dashed #e0e0e0;
			border-radius: 12px;
			padding: 30px;
			margin-bottom: 30px;
			transition: all 0.3s;
			background-color: #f9f9f9;
			box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
			min-height: 290px;

			&.is-dragover {
				border-color: var(--el-color-primary);
				background-color: rgba(64, 158, 255, 0.05);
				box-shadow: 0 2px 16px rgba(64, 158, 255, 0.15);
			}

			.upload-placeholder {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				min-height: 220px;

				.upload-icon {
					font-size: 60px;
					color: var(--el-color-primary);
					margin-bottom: 20px;
					opacity: 0.8;
				}

				.upload-text {
					font-size: 18px;
					color: #606266;
					margin-bottom: 16px;

					.upload-button {
						color: var(--el-color-primary);
						font-weight: 600;
						cursor: pointer;
						padding: 2px 6px;
						border-radius: 4px;
						margin: 0 4px;
						transition: all 0.2s;

						&:hover {
							background-color: var(--el-color-primary-light-9);
						}
					}
				}

				.upload-tip {
					font-size: 14px;
					color: #909399;
				}

				.hidden-input {
					display: none;
				}
			}

			.upload-progress {
				padding: 10px 0;

				.file-info {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 16px;
					background-color: white;
					padding: 16px;
					border-radius: 10px;
					box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

					.file-name-wrapper {
						display: flex;
						align-items: center;
						max-width: 80%;

						.file-icon {
							font-size: 24px;
							margin-right: 12px;
							color: var(--el-color-primary);
						}

						.file-name {
							font-weight: 500;
							word-break: break-all;
							font-size: 16px;
							color: #303133;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}

					.file-size {
						color: #909399;
						font-size: 14px;
					}
				}

				.upload-stats {
					display: flex;
					flex-direction: column;
					gap: 12px;
					margin: 16px 0;
					color: #606266;
					font-size: 14px;
					background-color: white;
					padding: 25px 16px;
					border-radius: 8px;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

					.progress-wrapper {
						display: flex;
						align-items: center;

						.progress-bar {
							flex: 1;
							height: 10px;
							background-color: #ebeef5;
							border-radius: 100px;
							overflow: hidden;
							margin-right: 12px;

							.progress-inner {
								height: 100%;
								background: linear-gradient(90deg, var(--el-color-primary), #52b7ff);
								border-radius: 100px;
								transition: width 0.3s ease;

								&.success {
									background: linear-gradient(90deg, #67c23a, #85ce61);
								}

								&.error {
									background: linear-gradient(90deg, #f56c6c, #f78989);
								}

								&.paused {
									background: linear-gradient(90deg, #e6a23c, #f3b760);
								}
							}
						}

						.progress-text {
							font-size: 14px;
							font-weight: 600;
							color: #606266;
							min-width: 45px;
							text-align: right;
						}
					}

					.upload-info-row {
						display: flex;
						justify-content: space-between;
						align-items: center;
						gap: 12px;
						min-height: 28px;
					}

					.upload-status-info {
						display: flex;
						flex-wrap: wrap;
						align-items: center;
						gap: 12px;

						.hash-calculating {
							font-size: 12px;
							color: #909399;
							background-color: #f4f4f5;
							padding: 2px 6px;
							border-radius: 4px;
						}
					}

					.success-message,
					.error-message,
					.paused-message {
						display: flex;
						align-items: center;
						font-weight: 500;
						padding: 4px 10px;
						border-radius: 8px;

						.el-icon {
							margin-right: 8px;
						}
					}

					.success-message {
						background-color: #f0f9eb;
						color: #67c23a;
					}

					.error-message {
						background-color: #fef0f0;
						color: #f56c6c;
					}

					.paused-message {
						background-color: #fdf6ec;
						color: #e6a23c;
					}

					.upload-bytes,
					.upload-speed,
					.upload-time {
						display: flex;
						align-items: center;
						font-weight: 500;
					}

					.upload-bytes {
						color: var(--el-color-primary);
					}

					.action-buttons-group {
						display: flex;
						gap: 12px;
					}

					.action-button {
						border: none;
						border-radius: 8px;
						font-size: 14px;
						font-weight: 500;
						cursor: pointer;
						transition: all 0.2s;

						&.icon-button {
							width: 20px;
							height: 20px;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

							.el-icon {
								font-size: 20px;
							}
						}

						&.pause-button {
							background-color: #ecf5ff;
							color: var(--el-color-primary);

							&:hover {
								background-color: #d9ecff;
								transform: translateY(-2px);
							}
						}

						&.resume-button {
							background-color: #ecf5ff;
							color: var(--el-color-primary);

							&:hover {
								background-color: #d9ecff;
								transform: translateY(-2px);
							}
						}

						&.cancel-button {
							background-color: #fef0f0;
							color: #f56c6c;

							&:hover {
								background-color: #fde2e2;
								transform: translateY(-2px);
							}
						}
					}
				}
			}
		}

		.file-list-container {
			background-color: white;
			border-radius: 12px;
			padding: 24px;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

			.file-list-title {
				margin-top: 0;
				margin-bottom: 20px;
				color: #303133;
				font-size: 18px;
				font-weight: 600;
				position: relative;
				padding-left: 16px;

				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 4px;
					height: 16px;
					background-color: var(--el-color-primary);
					border-radius: 2px;
				}
			}

			.file-cards {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
				gap: 16px;

				.file-card {
					background-color: #f9f9f9;
					border-radius: 10px;
					padding: 16px;
					display: flex;
					flex-direction: column;
					position: relative;
					transition: all 0.2s;
					border: 1px solid #eee;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

					&:hover {
						transform: translateY(-2px);
						box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

						.file-card-actions {
							opacity: 1;
						}
					}

					.file-card-icon {
						display: flex;
						justify-content: center;
						margin-bottom: 12px;

						.el-icon {
							font-size: 40px;
							color: var(--el-color-primary);
						}
					}

					.file-card-content {
						flex: 1;

						.file-card-name {
							font-weight: 500;
							font-size: 15px;
							color: #303133;
							margin-bottom: 8px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.file-card-info {
							display: flex;
							flex-direction: column;
							gap: 10px;
							font-size: 13px;
							color: #909399;

							.file-card-size {
								background-color: var(--el-color-primary-light-9);
								padding: 2px 8px;
								border-radius: 4px;
								display: inline-block;
								width: fit-content;
								color: var(--el-color-primary);
							}
						}
					}

					.file-card-actions {
						position: absolute;
						top: 12px;
						right: 12px;
						opacity: 0;
						transition: opacity 0.2s;

						.card-button {
							background-color: white;
							border: none;
							width: 32px;
							height: 32px;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							cursor: pointer;
							color: var(--el-color-primary);
							box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
							transition: all 0.2s;

							&:hover {
								background-color: var(--el-color-primary);
								color: white;
								transform: scale(1.05);
							}
						}
					}
				}
			}
		}
	}
</style>
