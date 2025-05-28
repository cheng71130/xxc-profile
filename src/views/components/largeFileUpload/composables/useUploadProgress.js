import { ref, reactive } from 'vue'
import { formatSize, formatTime } from '../utils/fileUtils.js'
import { UPLOAD_CONFIG } from '../utils/constants.js'

export function useUploadProgress() {
	const uploadProgress = ref(0)
	const uploadSpeed = ref('')
	const remainingTime = ref('')

	// 确保 progressStats 有正确的初始值
	const progressStats = reactive({
		startTime: 0,
		uploadedBytes: 0, // 确保有初始值
		previousUploadedBytes: 0,
		lastUpdateTime: 0
	})

	let updateIntervalId = null

	const startProgressTracking = (totalSize) => {
		const now = Date.now()
		progressStats.startTime = now
		progressStats.lastUpdateTime = now
		progressStats.uploadedBytes = 0
		progressStats.previousUploadedBytes = 0

		uploadSpeed.value = '计算中...'
		remainingTime.value = '计算中...'

		// 快速初始更新
		setTimeout(() => {
			if (progressStats.uploadedBytes > 0) {
				updateProgressDisplay(totalSize)
			}
		}, 300)

		// 定时更新
		updateIntervalId = setInterval(() => {
			updateProgressDisplay(totalSize)
		}, UPLOAD_CONFIG.UPDATE_INTERVAL)
	}

	const updateProgressDisplay = (totalSize) => {
		const now = Date.now()
		const timeElapsed = (now - progressStats.lastUpdateTime) / 1000

		if (timeElapsed > 0) {
			const bytesUploaded = progressStats.uploadedBytes - progressStats.previousUploadedBytes
			const bytesPerSecond = bytesUploaded / timeElapsed

			if (bytesPerSecond > 0) {
				uploadSpeed.value = formatSize(bytesPerSecond) + '/s'

				const remainingBytes = totalSize - progressStats.uploadedBytes
				const secondsRemaining = Math.ceil(remainingBytes / bytesPerSecond)
				remainingTime.value = formatTime(secondsRemaining)
			}

			progressStats.previousUploadedBytes = progressStats.uploadedBytes
			progressStats.lastUpdateTime = now
		}
	}

	const updateUploadedBytes = (bytes, totalChunks, uploadedChunks) => {
		progressStats.uploadedBytes = bytes
		uploadProgress.value = Math.floor((uploadedChunks / totalChunks) * 100)
	}

	const stopProgressTracking = () => {
		if (updateIntervalId) {
			clearInterval(updateIntervalId)
			updateIntervalId = null
		}
	}

	const resetProgress = () => {
		uploadProgress.value = 0
		uploadSpeed.value = '计算中...'
		remainingTime.value = '计算中...'
		stopProgressTracking()

		Object.assign(progressStats, {
			startTime: 0,
			uploadedBytes: 0,
			previousUploadedBytes: 0,
			lastUpdateTime: 0
		})
	}

	return {
		uploadProgress,
		uploadSpeed,
		remainingTime,
		progressStats,
		startProgressTracking,
		updateUploadedBytes,
		stopProgressTracking,
		resetProgress
	}
}
