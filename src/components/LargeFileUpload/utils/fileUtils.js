import { FILE_TYPES, CHUNK_SIZE_STRATEGY } from './constants.js'

export const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export const getFileType = (filename) => {
  if (FILE_TYPES.VIDEO.test(filename)) return 'video'
  if (FILE_TYPES.IMAGE.test(filename)) return 'image'
  if (FILE_TYPES.PDF.test(filename)) return 'pdf'
  if (FILE_TYPES.ARCHIVE.test(filename)) return 'archive'
  return 'file'
}

export const getOptimalChunkSize = (fileSize) => {
  const strategies = Object.values(CHUNK_SIZE_STRATEGY)
  
  for (const strategy of strategies) {
    if (!strategy.maxSize || fileSize < strategy.maxSize) {
      return strategy.chunkSize
    }
  }
  return CHUNK_SIZE_STRATEGY.XLARGE.chunkSize
}

export const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds}秒`
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}分${seconds % 60}秒`
  } else {
    return `${Math.floor(seconds / 3600)}时${Math.floor((seconds % 3600) / 60)}分`
  }
}

export const createFileInput = (onChange) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.className = 'hidden-input'
  input.style.display = 'none'
  input.addEventListener('change', onChange)
  return input
}