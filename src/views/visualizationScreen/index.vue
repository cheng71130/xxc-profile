<template>
	<div class="bg">
		<div v-if="loading" id="box">
			<div id="l1">L</div>
			<div id="l2">O</div>
			<div id="l3">A</div>
			<div id="l4">D</div>
			<div id="l5">I</div>
			<div id="l6">N</div>
			<div id="l7">G</div>
			<div>.</div>
			<div>.</div>
			<div>.</div>
		</div>
		<div v-else id="bigScreen">
			<header>
				<span class="title">无损检测数字化平台</span>
				<RealTimeClock />
			</header>
			<main>
				<div class="main-left">
					<div class="main-leftTop">
						<div class="subTitle">历史项目</div>
						<div class="chartDom" style="padding: 20px 0; position: relative">
							<RotationTable />
						</div>
					</div>
					<div class="main-leftBottom">
						<div class="subTitle">核电厂管理</div>
						<div class="chartDom">
							<Chart3 />
						</div>
					</div>
				</div>
				<div class="main-middle">
					<div class="middleLeft"></div>
					<div class="mapContainer">
						<div class="statisticalContainer">
							<div class="statistical-item"></div>
							<div class="statistical-item"></div>
							<div class="statistical-item"></div>
							<div class="statistical-item"></div>
						</div>
						<ChinaMap />
					</div>
					<div class="middleRight"></div>
				</div>
				<div class="main-right">
					<div class="main-rightChild">
						<div class="subTitle">资质证书</div>
						<div class="chartDom">
							<ChartRadar />
							<!-- <ChartNightingale /> -->
							<!-- <ChartPie /> -->
						</div>
					</div>
					<div class="main-rightChild">
						<div class="subTitle">仪器工具</div>
						<div class="chartDom">
							<ChartTusk />
						</div>
					</div>
					<div class="main-rightChild">
						<div class="subTitle">项目人员</div>
						<div class="chartDom">
							<!-- <Chart2 /> -->
							<ChartLine />
							<!-- <ChartBubble /> -->
						</div>
					</div>
				</div>
			</main>
		</div>
	</div>
</template>
<script setup>
	import autofit from 'autofit.js'
	import RealTimeClock from './common/realTimeClock.vue'
	import ChinaMap from './charts/chinaMap.vue'
	import ChartRadar from './charts/chartRadar.vue'
	import ChartNightingale from './charts/chartNightingale.vue'
	import ChartBubble from './charts/chartBubble.vue'
	import ChartPie from './charts/chartPie.vue'
	import Chart2 from './charts/chart2.vue'
	import Chart3 from './charts/chart3.vue'
	import ChartTusk from './charts/chartTusk.vue'
	import ChartLine from './charts/chartLine.vue'
	import RotationTable from './charts/rotationTable.vue'

	const loading = ref(true)

	onMounted(() => {
		autofit.init(
			{
				dw: 3840,
				dh: 1920,
				el: 'body',
				resize: true
			},
			false
		)

		setTimeout(() => {
			loading.value = false
		}, 1000)
	})

	onBeforeUnmount(() => {
		autofit.off()
	})
</script>

<style scoped lang="less">
	.bg {
		width: 100%;
		height: 100%;
		// background-image: url('@/assets/screen/bg.png');
		// background-size: cover;
		// background-position: center center;
		background-color: #141b29;
	}
	#bigScreen {
		background-image: url('@/assets/screen/bg.png');
		background-size: cover;
		background-position: center center;
		width: 3840px;
		height: 1920px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 0 20px;
		header {
			// background-image: url('@/assets/images/screen/title.png');
			// background-size: contain;
			// background-position: center center;
			// background-repeat: no-repeat;
			height: 154px;
			display: flex;
			justify-content: center;
			position: relative;
			.title {
				font-size: 60px;
				font-weight: bold;
				color: #ffffff;
				transform: skewX(-15deg);
				text-shadow: 0 0 5px rgba(0, 255, 255, 0.3), 4px 4px 0px rgba(255, 255, 255, 0.4);
				letter-spacing: 15px;
				background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%);
				background-clip: text;
				position: absolute;
				top: 30px;
			}
		}
		main {
			flex: 1;
			display: flex;
			gap: 10px;
			.main-left {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: 40px;
				padding-bottom: 120px;
				.main-leftTop {
					flex: 1.5;
				}
				.main-leftBottom {
					flex: 1;
				}
			}
			.main-middle {
				flex: 2.5;
				display: flex;
				.middleLeft {
					flex: 1;
					background-image: url('@/assets/screen/middleLeft.png');
					background-size: cover;
					background-position: center center;
				}
				.mapContainer {
					flex: 8;
					position: relative;
					.statisticalContainer {
						position: absolute;
						top: 20px;
						height: 400px;
						width: 100%;
						display: flex;
						.statistical-item {
							flex: 1;
							background-image: url('@/assets/screen/base.png');
							background-size: cover;
							background-position: center center;
							background-repeat: no-repeat;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
						}
					}
				}
				.middleRight {
					flex: 1;
					background-image: url('@/assets/screen/middleRight.png');
					background-size: cover;
					background-position: center center;
				}
			}
			.main-right {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: 40px;
				padding-bottom: 120px;
				.main-rightChild {
					flex: 1;
				}
			}
			.subTitle {
				height: 64px;
				// display: flex;
				// align-items: center;
				padding-top: 10px;
				padding-left: 30px;
				margin-bottom: 15px;
				background-image: url('@/assets/screen/subTitle.png');
				background-size: cover;
				background-position: center center;
				font-size: 28px;
				font-weight: bold;
				color: #fff;
				letter-spacing: 5px;
				font-style: italic;
			}
			.chartDom {
				height: calc(100% - 80px);
				background: url('@/assets/screen/borderLine.png') top center/100% 3px no-repeat,
					url('@/assets/screen/borderLine.png') bottom center/100% 3px no-repeat,
					linear-gradient(to bottom, #152338 0%, transparent 35%, transparent 65%, #152338 100%);
			}
		}
	}
</style>

<style scoped>
	#box div {
		display: inline-block;
		margin: 5px;
		font-size: 60px;
		color: #fff;
		animation: 2s obrot linear infinite;
	}

	#box {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	@keyframes obrot {
		0% {
			transform: rotateX(0);
		}
		12.5% {
			transform: rotateX(90deg);
		}
		25% {
			transform: rotateX(180deg);
		}
		37.5% {
			transform: rotateX(270deg);
		}
		50% {
			transform: rotateX(360deg);
		}
		100% {
			transform: rotateX(360deg);
		}
	}

	#box div:nth-child(1) {
		animation-delay: 0s;
	}
	#box div:nth-child(2) {
		animation-delay: 0.1s;
	}
	#box div:nth-child(3) {
		animation-delay: 0.2s;
	}
	#box div:nth-child(4) {
		animation-delay: 0.3s;
	}
	#box div:nth-child(5) {
		animation-delay: 0.4s;
	}
	#box div:nth-child(6) {
		animation-delay: 0.5s;
	}
	#box div:nth-child(7) {
		animation-delay: 0.6s;
	}
	#box div:nth-child(8) {
		animation: none;
	}
	#box div:nth-child(9) {
		animation: none;
	}
	#box div:nth-child(10) {
		animation: none;
	}
</style>
