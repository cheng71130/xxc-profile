<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script setup lang="ts">
    onMounted(() => {
        setTimeout(() => {
            const loading = document.getElementById('loading-screen');
            if (loading) {
                loading.remove();
            }
        }, 300);
    });
</script>
<style scoped lang="scss"></style>
