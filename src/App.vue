<template>
	<nav v-if="showNav">
		<router-link to="/visualizationScreen">数字可视化大屏</router-link> |
		<router-link to="/map-cn">中国地图</router-link> | <router-link to="/flowDemo">LogicFlow</router-link> |
	</nav>
	<router-view></router-view>
</template>
<script setup lang="ts">
	const route = useRoute()
	const showNav = computed(() => {
		// 仅在根路径显示导航栏
		return route.path === '/'
	})
</script>
<style scoped lang="scss"></style>
