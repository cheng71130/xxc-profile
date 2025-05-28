<template>
	<div class="file-uploader-container">
		<UploadArea
			:has-file="!!currentFile"
			:file="currentFile"
			:status="uploadStatus"
			:progress="uploadProgress"
			:speed="uploadSpeed"
			:remaining-time="remainingTime"
			:preparing-progress="preparingProgress"
			:hash-complete="hashCalculationComplete"
			:uploaded-bytes="progressStats?.uploadedBytes || 0"
			@upload="handleUpload"
			@pause="pauseUpload"
			@resume="resumeUpload"
			@cancel="handleCancel"
		/>

		<FileList v-if="fileList.length > 0" :files="fileList" @download="handleDownload" />

		<div v-if="uploadStatus === 'success'" class="upload-complete">
			<el-button type="primary" @click="resetUploader">继续上传</el-button>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, watch } from 'vue'
	import { ElMessageBox } from 'element-plus'
	import UploadArea from './components/UploadArea.vue'
	import FileList from './components/FileList.vue'
	import { useFileUpload } from './composables/useFileUpload.js'
	import { useFileList } from './composables/useFileList.js'
	import uploadApi from './utils/uploadApi.js'

	// 解构时确保所有必要的属性都被导出
	const {
		currentFile,
		uploadStatus,
		uploadProgress,
		uploadSpeed,
		remainingTime,
		preparingProgress,
		hashCalculationComplete,
		progressStats, // 确保 progressStats 被正确导出
		prepareUpload,
		pauseUpload,
		resumeUpload,
		cancelUpload,
		resetUploader
	} = useFileUpload()

	const { fileList, fetchFileList } = useFileList()

	const handleUpload = (file) => {
		prepareUpload(file)
	}

	const handleCancel = async () => {
		try {
			await ElMessageBox.confirm('确定要取消上传吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
			cancelUpload()
		} catch {
			// 用户取消了操作
		}
	}

	const handleDownload = (file) => {
		const url = uploadApi.getDownloadUrl(file.name)
		window.open(url, '_blank')
	}

	// 监听上传成功，刷新文件列表
	watch(uploadStatus, (newStatus) => {
		if (newStatus === 'success') {
			fetchFileList()
		}
	})

	onMounted(() => {
		fetchFileList()
	})
</script>

<style lang="scss">
	@use './styles/upload.scss';
</style>
