export const UPLOAD_CONFIG = {
	// API配置
	API_BASE_URL: 'http://localhost:3000',

	// 分片配置
	BASE_CHUNK_SIZE: 2 * 1024 * 1024, // 2MB 基础分片大小
	MAX_CHUNK_SIZE: 10 * 1024 * 1024, // 10MB 最大分片大小
	MIN_CHUNK_SIZE: 1024 * 1024, // 1MB 最小分片大小

	// 并发配置
	MAX_CONCURRENT_UPLOADS: 3, // 最大并发上传数
	MAX_RETRY_COUNT: 3, // 最大重试次数
	RETRY_DELAY: 1000, // 重试延迟(ms)

	// 超时配置
	CHUNK_TIMEOUT: 60000, // 分片上传超时(ms)

	// 进度更新
	UPDATE_INTERVAL: 500, // 进度更新间隔(ms)

	// 哈希计算配置
	HASH_SAMPLE_SIZE: 6 * 1024 * 1024, // 总采样大小约6MB
	HASH_WORKER_TIMEOUT: 30000 // Worker超时时间
}

export const CHUNK_SIZE_STRATEGY = {
	SMALL: { maxSize: 100 * 1024 * 1024, chunkSize: 1 * 1024 * 1024 },
	MEDIUM: { maxSize: 1024 * 1024 * 1024, chunkSize: 2 * 1024 * 1024 },
	LARGE: { maxSize: 5 * 1024 * 1024 * 1024, chunkSize: 4 * 1024 * 1024 },
	XLARGE: { chunkSize: 8 * 1024 * 1024 }
}

export const FILE_TYPES = {
	VIDEO: /\.(mp4|avi|mov|mkv|wmv)$/i,
	IMAGE: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
	PDF: /\.pdf$/i,
	ARCHIVE: /\.(zip|rar|tar|gz|7z)$/i
}

export const UPLOAD_STATUS = {
	IDLE: 'idle',
	UPLOADING: 'uploading',
	PAUSED: 'paused',
	SUCCESS: 'success',
	ERROR: 'error'
}

export const FILE_TYPE_ICONS = {
	video: 'VideoCamera',
	image: 'Picture',
	pdf: 'Document',
	archive: 'Folder',
	file: 'Files'
}
