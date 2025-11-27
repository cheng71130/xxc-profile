<template>
	<div class="upload-progress">
		<div class="file-info">
			<div class="file-name-wrapper">
				<el-icon class="file-icon">
					<component :is="fileIcon" />
				</el-icon>
				<div class="file-name" :title="file.name">{{ file.name }}</div>
			</div>
			<div class="file-size">{{ formatSize(file.size) }}</div>
		</div>

		<div class="upload-stats">
			<div class="progress-wrapper">
				<div class="progress-bar">
					<div class="progress-inner" :class="progressClass" :style="{ width: `${progress}%` }"></div>
				</div>
				<div class="progress-text">{{ progress }}%</div>
			</div>

			<div class="upload-info-row">
				<div class="upload-status-info">
					<StatusDisplay
						:status="status"
						:speed="speed"
						:remaining-time="remainingTime"
						:uploaded-bytes="uploadedBytes || 0"
						:total-bytes="file.size"
						:preparing-progress="preparingProgress"
						:hash-complete="hashComplete"
					/>
				</div>

				<div class="action-buttons-group">
					<ActionButtons :status="status" @pause="$emit('pause')" @resume="$emit('resume')" @cancel="$emit('cancel')" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue'
	import { VideoCamera, Picture, Document, Folder, Files } from '@element-plus/icons-vue'
	import { formatSize, getFileType } from '../utils/fileUtils.js'
	import { UPLOAD_STATUS } from '../utils/constants.js'
	import StatusDisplay from './StatusDisplay.vue'
	import ActionButtons from './ActionButtons.vue'

	const props = defineProps({
		file: { type: Object, required: true },
		status: { type: String, required: true },
		progress: { type: Number, default: 0 },
		speed: { type: String, default: '' },
		remainingTime: { type: String, default: '' },
		uploadedBytes: { type: Number, default: 0 }, // 添加默认值
		preparingProgress: { type: Number, default: 0 },
		hashComplete: { type: Boolean, default: false }
	})

	defineEmits(['pause', 'resume', 'cancel'])

	const fileIcon = computed(() => {
		const fileType = getFileType(props.file.name)
		const iconMap = {
			video: VideoCamera,
			image: Picture,
			pdf: Document,
			archive: Folder,
			file: Files
		}
		return iconMap[fileType] || Files
	})

	const progressClass = computed(() => ({
		uploading: props.status === UPLOAD_STATUS.UPLOADING,
		success: props.status === UPLOAD_STATUS.SUCCESS,
		error: props.status === UPLOAD_STATUS.ERROR,
		paused: props.status === UPLOAD_STATUS.PAUSED
	}))
</script>
