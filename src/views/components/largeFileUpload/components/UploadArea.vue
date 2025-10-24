<template>
	<div
		class="upload-area"
		:class="{ 'is-dragOver': isDragover }"
		@dragenter.prevent="handleDragEnter"
		@dragover.prevent="handleDragOver"
		@dragleave.prevent="handleDragLeave"
		@drop.prevent="handleDrop"
	>
		<!-- 文件选择区域 -->
		<div v-if="!hasFile" class="upload-placeholder">
			<el-icon class="upload-icon"><Upload /></el-icon>
			<div class="upload-text">
				<span class="upload-button" @click="triggerFileInput">点击上传</span>或将文件拖到此处
			</div>
			<div class="upload-tip">支持任意类型文件，单个文件大小不超过10GB</div>
			<input ref="fileInput" type="file" class="hidden-input" @change="handleFileChange" />
		</div>

		<!-- 文件进度区域 -->
		<FileProgress
			v-else
			:file="file"
			:status="status"
			:progress="progress"
			:speed="speed"
			:remaining-time="remainingTime"
			:preparing-progress="preparingProgress"
			:hash-complete="hashComplete"
			:uploaded-bytes="uploadedBytes"
			@pause="$emit('pause')"
			@resume="$emit('resume')"
			@cancel="$emit('cancel')"
		/>
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import { Upload } from '@element-plus/icons-vue'
	import FileProgress from './FileProgress.vue'

	const props = defineProps({
		hasFile: Boolean,
		file: Object,
		status: String,
		progress: { type: Number, default: 0 },
		speed: { type: String, default: '' },
		remainingTime: { type: String, default: '' },
		preparingProgress: { type: Number, default: 0 },
		hashComplete: { type: Boolean, default: false },
		uploadedBytes: { type: Number, default: 0 } // 添加这个prop
	})

	const emit = defineEmits(['upload', 'pause', 'resume', 'cancel'])

	const isDragover = ref(false)
	const fileInput = ref(null)

	const triggerFileInput = () => {
		fileInput.value?.click()
	}

	const handleFileChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			emit('upload', file)
			// 重置input值，允许重复选择同一文件
			e.target.value = ''
		}
	}

	const handleDragEnter = (e) => {
		e.dataTransfer.dropEffect = 'copy'
		isDragover.value = true
	}

	const handleDragOver = (e) => {
		e.dataTransfer.dropEffect = 'copy'
	}

	const handleDragLeave = (e) => {
		// 只有当离开整个拖拽区域时才设置为false
		if (!e.currentTarget.contains(e.relatedTarget)) {
			isDragover.value = false
		}
	}

	const handleDrop = (e) => {
		isDragover.value = false
		const files = e.dataTransfer.files
		if (files.length > 0) {
			emit('upload', files[0])
		}
	}
</script>
