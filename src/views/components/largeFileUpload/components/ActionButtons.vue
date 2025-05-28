<template>
	<div class="action-buttons" v-if="showButtons">
		<!-- 上传中状态按钮 -->
		<template v-if="status === 'uploading'">
			<button class="action-button icon-button pause-button" title="暂停" @click="$emit('pause')">
				<el-icon><VideoPause /></el-icon>
			</button>
			<button class="action-button icon-button cancel-button" title="取消" @click="$emit('cancel')">
				<el-icon><CircleClose /></el-icon>
			</button>
		</template>

		<!-- 暂停状态按钮 -->
		<template v-else-if="status === 'paused'">
			<button class="action-button icon-button resume-button" title="继续" @click="$emit('resume')">
				<el-icon><VideoPlay /></el-icon>
			</button>
			<button class="action-button icon-button cancel-button" title="取消" @click="$emit('cancel')">
				<el-icon><CircleClose /></el-icon>
			</button>
		</template>

		<!-- 错误状态按钮 -->
		<template v-else-if="status === 'error'">
			<button class="action-button icon-button cancel-button" title="取消" @click="$emit('cancel')">
				<el-icon><CircleClose /></el-icon>
			</button>
		</template>
	</div>
</template>

<script setup>
	import { computed } from 'vue'
	import { VideoPause, CircleClose, VideoPlay } from '@element-plus/icons-vue'

	const props = defineProps({
		status: { type: String, required: true }
	})

	defineEmits(['pause', 'resume', 'cancel'])

	const showButtons = computed(() => {
		return ['uploading', 'paused', 'error'].includes(props.status)
	})
</script>
