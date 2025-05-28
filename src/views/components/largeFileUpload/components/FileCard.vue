<template>
	<div class="file-card">
		<div class="file-card-icon">
			<el-icon>
				<component :is="fileIcon" />
			</el-icon>
		</div>

		<div class="file-card-content">
			<div class="file-card-name" :title="file.name">{{ file.name }}</div>
			<div class="file-card-info">
				<span class="file-card-size">{{ formatSize(file.size || 0) }}</span>
				<span class="file-card-date" v-if="file.createTime">{{ formatDate(file.createTime) }}</span>
			</div>
		</div>

		<div class="file-card-actions">
			<button class="card-button download-button" @click="$emit('download')" title="下载">
				<el-icon><Download /></el-icon>
			</button>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue'
	import { VideoCamera, Picture, Document, Folder, Files, Download } from '@element-plus/icons-vue'
	import { formatSize, formatDate, getFileType } from '../utils/fileUtils.js'

	const props = defineProps({
		file: { type: Object, required: true }
	})

	defineEmits(['download', 'delete'])

	const fileIcon = computed(() => {
		const fileType = getFileType(props.file.name || '')
		const iconMap = {
			video: VideoCamera,
			image: Picture,
			pdf: Document,
			archive: Folder,
			file: Files
		}
		return iconMap[fileType] || Files
	})
</script>
