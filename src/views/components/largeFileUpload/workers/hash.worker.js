import SparkMD5 from 'spark-md5'

// 采样配置
const SAMPLE_CONFIG = {
	// 小文件直接全量计算
	SMALL_FILE_THRESHOLD: 10 * 1024 * 1024, // 10MB

	// 采样策略
	HEAD_SIZE: 2 * 1024 * 1024, // 文件头部 2MB
	TAIL_SIZE: 2 * 1024 * 1024, // 文件尾部 2MB
	MIDDLE_SAMPLES: 3, // 中间采样点数量
	MIDDLE_SAMPLE_SIZE: 1024 * 1024 // 每个中间采样点 1MB
}

self.onmessage = function (e) {
	const { file, chunkSize } = e.data

	try {
		if (file.size <= SAMPLE_CONFIG.SMALL_FILE_THRESHOLD) {
			// 小文件：全量计算哈希
			calculateFullHash(file, chunkSize)
		} else {
			// 大文件：采样计算哈希
			calculateSampleHash(file)
		}
	} catch (error) {
		self.postMessage({
			type: 'error',
			message: error.message
		})
	}
}

/**
 * 全量哈希计算（用于小文件）
 */
function calculateFullHash(file, chunkSize) {
	const chunks = Math.ceil(file.size / chunkSize)
	let currentChunk = 0
	const spark = new SparkMD5.ArrayBuffer()
	const fileReader = new FileReader()

	fileReader.onload = function (e) {
		spark.append(e.target.result)
		currentChunk++

		// 报告进度
		self.postMessage({
			type: 'progress',
			percentage: Math.floor((currentChunk / chunks) * 100)
		})

		if (currentChunk < chunks) {
			loadNext()
		} else {
			self.postMessage({
				type: 'complete',
				hash: spark.end()
			})
		}
	}

	fileReader.onerror = function () {
		self.postMessage({
			type: 'error',
			message: '文件读取失败'
		})
	}

	function loadNext() {
		const start = currentChunk * chunkSize
		const end = Math.min(file.size, start + chunkSize)
		const chunk = file.slice(start, end)
		fileReader.readAsArrayBuffer(chunk)
	}

	loadNext()
}

/**
 * 采样哈希计算（用于大文件）
 * 采样策略：文件头部 + 文件尾部 + 中间均匀采样点
 */
function calculateSampleHash(file) {
	const spark = new SparkMD5.ArrayBuffer()
	const samplePoints = calculateSamplePoints(file.size)
	let currentSample = 0
	const fileReader = new FileReader()

	fileReader.onload = function (e) {
		spark.append(e.target.result)
		currentSample++

		// 报告进度
		const progress = Math.floor((currentSample / samplePoints.length) * 100)
		self.postMessage({
			type: 'progress',
			percentage: progress
		})

		if (currentSample < samplePoints.length) {
			loadNextSample()
		} else {
			// 采样完成，生成最终哈希
			// 包含文件基本信息以增强唯一性
			const fileInfo = `${file.name}-${file.size}-${file.lastModified || Date.now()}`
			const combinedData = spark.end() + fileInfo

			// 对组合数据再次哈希
			const finalHash = SparkMD5.hash(combinedData)

			self.postMessage({
				type: 'complete',
				hash: finalHash
			})
		}
	}

	fileReader.onerror = function () {
		self.postMessage({
			type: 'error',
			message: '文件读取失败'
		})
	}

	function loadNextSample() {
		const sample = samplePoints[currentSample]
		const chunk = file.slice(sample.start, sample.end)
		fileReader.readAsArrayBuffer(chunk)
	}

	// 开始第一个采样
	loadNextSample()
}

/**
 * 计算采样点
 * @param {number} fileSize - 文件大小
 * @returns {Array} 采样点数组
 */
function calculateSamplePoints(fileSize) {
	const points = []

	// 1. 文件头部采样
	points.push({
		start: 0,
		end: Math.min(SAMPLE_CONFIG.HEAD_SIZE, fileSize),
		description: '文件头部'
	})

	// 2. 文件尾部采样
	if (fileSize > SAMPLE_CONFIG.HEAD_SIZE + SAMPLE_CONFIG.TAIL_SIZE) {
		points.push({
			start: fileSize - SAMPLE_CONFIG.TAIL_SIZE,
			end: fileSize,
			description: '文件尾部'
		})
	}

	// 3. 中间采样点
	const middleStart = SAMPLE_CONFIG.HEAD_SIZE
	const middleEnd = fileSize - SAMPLE_CONFIG.TAIL_SIZE
	const middleSize = middleEnd - middleStart

	if (middleSize > SAMPLE_CONFIG.MIDDLE_SAMPLE_SIZE * SAMPLE_CONFIG.MIDDLE_SAMPLES) {
		for (let i = 0; i < SAMPLE_CONFIG.MIDDLE_SAMPLES; i++) {
			const ratio = (i + 1) / (SAMPLE_CONFIG.MIDDLE_SAMPLES + 1)
			const sampleStart = middleStart + Math.floor(middleSize * ratio)
			const sampleEnd = Math.min(sampleStart + SAMPLE_CONFIG.MIDDLE_SAMPLE_SIZE, middleEnd)

			points.push({
				start: sampleStart,
				end: sampleEnd,
				description: `中间采样点${i + 1}`
			})
		}
	}

	// 去重和排序
	return points
		.filter((point, index, array) => {
			// 避免重叠的采样区间
			return !array
				.slice(0, index)
				.some(
					(prev) =>
						(point.start >= prev.start && point.start < prev.end) || (point.end > prev.start && point.end <= prev.end)
				)
		})
		.sort((a, b) => a.start - b.start)
}
