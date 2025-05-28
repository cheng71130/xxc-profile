import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import uploadApi from '../utils/uploadApi.js'

export function useFileList() {
	const fileList = ref([])
	const loading = ref(false)

	const fetchFileList = async () => {
		loading.value = true
		try {
			const result = await uploadApi.getFileList()

			if (result.code === 0) {
				fileList.value = result.data || [] // 确保有默认值
			} else {
				ElMessage.warning('获取文件列表失败')
				fileList.value = []
			}
		} catch (error) {
			console.error('获取文件列表失败:', error)
			ElMessage.error('获取文件列表失败')
			fileList.value = []
		} finally {
			loading.value = false
		}
	}

	const addFile = (file) => {
		if (file) {
			fileList.value.unshift(file)
		}
	}

	const removeFile = (fileName) => {
		const index = fileList.value.findIndex((file) => file.name === fileName)
		if (index > -1) {
			fileList.value.splice(index, 1)
		}
	}

	return {
		fileList,
		loading,
		fetchFileList,
		addFile,
		removeFile
	}
}
