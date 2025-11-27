import { ref } from 'vue'
import HashWorker from '../workers/hash.worker.js?worker'

export function useFileHash() {
	const preparingProgress = ref(0)
	const hashCalculationComplete = ref(false)

	const calculateFileHash = (file, chunkSize) => {
		return new Promise((resolve, reject) => {
			if (typeof Worker === 'undefined') {
				return reject(new Error('您的浏览器不支持Web Worker，请更换浏览器后重试'))
			}

			const worker = new HashWorker()

			worker.onmessage = (e) => {
				const data = e.data

				switch (data.type) {
					case 'progress':
						preparingProgress.value = data.percentage
						break
					case 'complete':
						hashCalculationComplete.value = true
						resolve(data.hash)
						worker.terminate()
						break
					case 'error':
						reject(new Error(data.message))
						worker.terminate()
						break
				}
			}

			worker.onerror = (err) => {
				reject(new Error('Worker错误: ' + err.message))
				worker.terminate()
			}

			worker.postMessage({ file, chunkSize })
		})
	}

	const resetHash = () => {
		preparingProgress.value = 0
		hashCalculationComplete.value = false
	}

	return {
		preparingProgress,
		hashCalculationComplete,
		calculateFileHash,
		resetHash
	}
}
