<template>
  <div class="status-display">
    <!-- 上传中状态 -->
    <template v-if="status === 'uploading'">
      <span class="upload-bytes">
        <el-icon class="mr-2"><Upload /></el-icon>
        已上传：{{ formatSize(uploadedBytes) }}/{{ formatSize(totalBytes) }}
      </span>
      <span v-if="speed" class="upload-speed">当前速度：{{ speed }}</span>
      <span v-if="remainingTime" class="upload-time">剩余时间：{{ remainingTime }}</span>
      <span v-if="!hashComplete" class="hash-calculating">
        (特征码计算中: {{ preparingProgress }}%)
      </span>
    </template>

    <!-- 上传完成状态 -->
    <template v-else-if="status === 'success'">
      <span class="success-message">
        <el-icon><CircleCheckFilled /></el-icon> 上传成功
      </span>
    </template>

    <!-- 上传错误状态 -->
    <template v-else-if="status === 'error'">
      <span class="error-message">
        <el-icon><CircleCloseFilled /></el-icon> 上传失败
      </span>
    </template>

    <!-- 已暂停状态 -->
    <template v-else-if="status === 'paused'">
      <span class="paused-message">
        <el-icon><VideoPause /></el-icon> 已暂停
      </span>
    </template>
  </div>
</template>

<script setup>
import { 
  Upload, CircleCheckFilled, CircleCloseFilled, VideoPause 
} from '@element-plus/icons-vue'
import { formatSize } from '../utils/fileUtils.js'

defineProps({
  status: { type: String, required: true },
  speed: { type: String, default: '' },
  remainingTime: { type: String, default: '' },
  uploadedBytes: { type: Number, default: 0 },  // 添加默认值
  totalBytes: { type: Number, required: true },
  preparingProgress: { type: Number, default: 0 },
  hashComplete: { type: Boolean, default: false }
})
</script>