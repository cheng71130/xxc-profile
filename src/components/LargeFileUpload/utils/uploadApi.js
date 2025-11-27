import { UPLOAD_CONFIG } from './constants.js'

class UploadAPI {
	constructor(baseURL = UPLOAD_CONFIG.API_BASE_URL) {
		this.baseURL = baseURL
	}

	async checkFileExists(fileHash, fileName, fileSize) {
		try {
			const response = await fetch(`${this.baseURL}/check-file`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fileHash,
					fileName,
					size: fileSize
				})
			})

			return await response.json()
		} catch (error) {
			console.error('检查文件是否存在失败:', error)
			return { code: -1, exists: false }
		}
	}

	async uploadChunk(chunk, hash, fileHash, filename) {
		const formData = new FormData()
		formData.append('chunk', chunk)
		formData.append('hash', hash)
		formData.append('fileHash', fileHash)
		formData.append('filename', filename)

		const response = await fetch(`${this.baseURL}/upload`, {
			method: 'POST',
			body: formData,
			signal: AbortSignal.timeout(UPLOAD_CONFIG.CHUNK_TIMEOUT)
		})

		return await response.json()
	}

	async mergeChunks(fileHash, fileName, size) {
		const response = await fetch(`${this.baseURL}/merge`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				fileHash,
				fileName,
				size
			})
		})

		return await response.json()
	}

	async verifyFile(fileHash, fileName) {
		try {
			const response = await fetch(`${this.baseURL}/verify`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fileHash, fileName })
			})
			return await response.json()
		} catch (error) {
			console.error('文件完整性校验失败:', error)
			return { code: -1, verified: false }
		}
	}

	async getFileList() {
		try {
			const response = await fetch(`${this.baseURL}/files`)
			const result = await response.json()
			return result
		} catch (error) {
			console.error('获取文件列表失败:', error)
			return { code: -1, data: [] }
		}
	}

	getDownloadUrl(fileName) {
		return `${this.baseURL}/uploads/${fileName}`
	}
}

// 导出单例实例
export default new UploadAPI()
