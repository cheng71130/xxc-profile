export const UPLOAD_CONFIG = {
  BASE_CHUNK_SIZE: 1 * 1024 * 1024, // 1MB
  MAX_CONCURRENT_UPLOADS: 3,
  MAX_RETRY: 3,
  API_BASE_URL: 'http://localhost:3000',
  UPDATE_INTERVAL: 1000,
  CHUNK_TIMEOUT: 30000 // 30秒
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