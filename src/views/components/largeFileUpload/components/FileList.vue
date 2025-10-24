<template>
    <div class="file-list-container">
        <h3 class="file-list-title">已上传文件</h3>

        <div v-if="files.length > 0">
            <div class="file-cards">
                <FileCard
                    v-for="file in files"
                    :key="file.name || file.id"
                    :file="file"
                    @download="$emit('download', file)"
                    @delete="$emit('delete', file)"
                />
            </div>
        </div>
        <el-empty v-else description=" "/>
    </div>
</template>

<script setup>
    import FileCard from './FileCard.vue';

    defineProps({
        files: { type: Array, default: () => [] },
    });

    defineEmits(['download', 'delete']);
</script>
