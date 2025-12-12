<template>
	<dv-scroll-board :config="config" class="h-full w-full" />
	<div class="highlight"></div>
</template>
<script setup>
	const config = reactive({
		header: ['业主', '机组', '项目', '等级'],
		data: [
			['xx核电站', '六号机组', '红沿河602', 'A'],
			['xx核电站', '六号机组', '红沿河602', 'A'],
			['xx核电站', '六号机组', '红沿河602', 'A'],
			['xx核电站', '六号机组', '红沿河602', 'A'],
			['xx核电站', '六号机组', '红沿河602', 'A'],
			['xx核电站', '六号机组', '红沿河602', 'A'],
			['xx核电站', '六号机组', '红沿河602', 'A'],
			['xx核电站', '六号机组', '红沿河602', 'A'],
			['xx核电站', '六号机组', '红沿河602', 'A'],
			['xx核电站', '六号机组', '红沿河602', 'B'],
			['xx核电站', '六号机组', '红沿河602', 'C'],
			['xx核电站', '六号机组', '红沿河602', 'C'],
			['xx核电站', '六号机组', '红沿河602', 'C'],
			['xx核电站', '六号机组', '红沿河602', 'C'],
			['xx核电站', '六号机组', '红沿河602', 'C'],
			['xx核电站', '六号机组', '红沿河602', 'C']
		],
		rowNum: 8,
		index: false,
		headerBGC: 'transparent',
		// oddRowBGC: '#172450',
		oddRowBGC: 'transparent',
		evenRowBGC: 'transparent',
		align: ['center', 'center', 'center', 'center'],
		headerHeight: 85,
		waitTime: 3000
		// columnWidth: [50],
	})
</script>
<style lang="scss">
	.dv-scroll-board .header {
		font-size: 27px !important;
		position: relative;
	}
	.dv-scroll-board .header::after {
		content: '';
		position: absolute;
		left: 30px;
		right: 30px;
		top: 10px;
		bottom: 10px;
		box-shadow: 0 1px 0 rgba(64, 169, 255, 0.1) inset, 1px 0 0 rgba(64, 169, 255, 0.15) inset,
			-1px 0 0 rgba(64, 169, 255, 0.15) inset, 0 -1px 0 rgba(64, 169, 255, 0.3) inset, 0 0 5px rgba(64, 169, 255, 0.3);
	}

	.dv-scroll-board .rows .row-item {
		color: #fff;
		font-size: 27px !important;
		position: relative;
	}

	.dv-scroll-board .rows .row-item::after {
		content: '';
		position: absolute;
		left: 30px;
		right: 30px;
		top: 10px;
		bottom: 10px;
		box-shadow:
        /* 上边缘发光 - 最弱 */ 0 0px 0px rgba(64, 169, 255, 0.1) inset,
			/* 左边缘发光 - 较弱 */ 1px 0 2px rgba(64, 169, 255, 0.15) inset,
			/* 右边缘发光 - 较弱 */ -1px 0 2px rgba(64, 169, 255, 0.15) inset,
			/* 下边缘发光 - 最强 */ 0 -1px 2px rgba(64, 169, 255, 0.3) inset,
			/* 整体外发光 */ 0 0 15px rgba(64, 169, 255, 0.3);
	}
</style>

<style lang="scss" scoped>
	.highlight {
		position: absolute;
		top: 305px;
		left: 30px;
		right: 30px;
		height: 75px;
		width: auto;
		border-bottom: 2px solid #0ee9ea;
		background: linear-gradient(
			180deg,
			rgba(46, 51, 83, 0.1) 0%,
			rgba(36, 179, 231, 0.3) 70%,
			rgba(36, 179, 231, 0.6) 100%
		);
		box-shadow: 0 10px 20px rgba(14, 233, 234, 0.4), -5px 0 5px rgba(14, 233, 234, 0.2),
			5px 0 5px rgba(14, 233, 234, 0.2);
	}
</style>
