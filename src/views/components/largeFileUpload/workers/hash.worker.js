import SparkMD5 from 'spark-md5'

// 接收主线程消息
self.onmessage = function (e) {
    const { file, chunkSize } = e.data

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
            // 完成计算，返回哈希值
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

    // 开始处理第一个分片
    loadNext()
}
