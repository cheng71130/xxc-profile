import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const STORAGE_PREFIX = 'file_upload_'
const STORAGE_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7天过期

export function useUploadPersistence() {
	// 保存上传状态到本地存储
	const saveUploadState = (uploadState) => {
		try {
			const persistData = {
				...uploadState,
				timestamp: Date.now(),
				expiry: Date.now() + STORAGE_EXPIRY
			}

			const key = STORAGE_PREFIX + uploadState.fileHash
			localStorage.setItem(key, JSON.stringify(persistData))

			console.log('上传状态已保存:', uploadState.fileName)
		} catch (error) {
			console.error('保存上传状态失败:', error)
		}
	}

	// 获取指定文件的上传状态
	const getUploadState = (fileHash) => {
		try {
			const key = STORAGE_PREFIX + fileHash
			const data = localStorage.getItem(key)

			if (!data) return null

			const persistData = JSON.parse(data)

			// 检查是否过期
			if (Date.now() > persistData.expiry) {
				removeUploadState(fileHash)
				return null
			}

			return persistData
		} catch (error) {
			console.error('获取上传状态失败:', error)
			return null
		}
	}

	// 删除上传状态
	const removeUploadState = (fileHash) => {
		try {
			const key = STORAGE_PREFIX + fileHash
			localStorage.removeItem(key)
			console.log('已清除上传状态:', fileHash)
		} catch (error) {
			console.error('删除上传状态失败:', error)
		}
	}

	// 清理过期的上传状态
	const cleanExpiredUploads = () => {
		try {
			const keysToRemove = []
			const now = Date.now()

			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i)

				if (key && key.startsWith(STORAGE_PREFIX)) {
					const data = localStorage.getItem(key)
					if (data) {
						const persistData = JSON.parse(data)
						if (now > persistData.expiry) {
							keysToRemove.push(key)
						}
					}
				}
			}

			keysToRemove.forEach((key) => localStorage.removeItem(key))

			if (keysToRemove.length > 0) {
				console.log('清理了', keysToRemove.length, '个过期的上传状态')
			}
		} catch (error) {
			console.error('清理过期上传失败:', error)
		}
	}

	// 显示恢复上传的对话框
	const showRestoreDialog = async (uploadState) => {
		if (!uploadState) return false

		try {
			const progress = Math.floor((uploadState.uploadedChunks.length / uploadState.chunkCount) * 100)
			const timeAgo = formatTimeAgo(uploadState.timestamp)

			await ElMessageBox.confirm(
				`<div>
                    <p>发现未完成的上传：</p>
                    <p style="margin: 4px 0 10px; font-weight: bold;color:var(--el-color-primary)">${uploadState.fileName} (${progress}%) - ${timeAgo}</p>
                    <p>是否继续上传？</p>
                 </div>`,
				'提示',
				{
					dangerouslyUseHTMLString: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}
			)

			console.log('用户选择继续上传')
			return true
		} catch (action) {
			console.log('用户选择重新上传')
			return false
		}
	}

	// 格式化时间差
	const formatTimeAgo = (timestamp) => {
		const diff = Date.now() - timestamp
		const minutes = Math.floor(diff / (1000 * 60))
		const hours = Math.floor(diff / (1000 * 60 * 60))
		const days = Math.floor(diff / (1000 * 60 * 60 * 24))

		if (days > 0) return `${days}天前`
		if (hours > 0) return `${hours}小时前`
		if (minutes > 0) return `${minutes}分钟前`
		return '刚刚'
	}

	// 修复：页面离开前保存状态
	const setupBeforeUnload = (getCurrentUploadState) => {
		const beforeUnloadHandler = (e) => {
			const currentState = getCurrentUploadState()

			// 修复：不仅仅是 uploading 状态，paused 状态也要提示
			if (currentState && (currentState.status === 'uploading' || currentState.status === 'paused')) {
				saveUploadState(currentState)

				// 根据状态显示不同的提示
				let message = ''
				if (currentState.status === 'uploading') {
					message = '文件正在上传中，离开页面将暂停上传。下次访问时可以继续上传。'
				} else if (currentState.status === 'paused') {
					message = '文件上传已暂停，离开页面后下次访问时可以继续上传。'
				}

				e.preventDefault()
				e.returnValue = message
				return e.returnValue
			}
		}

		window.addEventListener('beforeunload', beforeUnloadHandler)

		// 返回清理函数
		return () => {
			window.removeEventListener('beforeunload', beforeUnloadHandler)
		}
	}

	return {
		saveUploadState,
		getUploadState,
		removeUploadState,
		cleanExpiredUploads,
		showRestoreDialog,
		setupBeforeUnload
	}
}
