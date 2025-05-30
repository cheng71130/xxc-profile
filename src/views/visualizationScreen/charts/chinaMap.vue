<template>
	<div ref="chart" class="h-full w-full"></div>
</template>
<script setup>
	import * as echarts from 'echarts'
	import { chinaMap } from '../common/chinaMap.js'
	import { chinaMapNoSouthIsland } from '../common/chinaMapNoSouthIsland.js'

	const chart = ref(null)
	const chartDom = ref(null)
	const option = ref({})
	const scatters = ref([])
	const allLineData = ref()
	const timer = ref()

	onMounted(async () => {
		await getScatters()
		drawMap()
	})

	const getScatters = async () => {
		scatters.value = [
			{
				name: 'HY101',
				value: ['118.173506', '36.688316', '海阳市', '暂无', 'A', 463830391451717]
			},
			{
				name: 'HY102',
				value: ['94.928293', '36.407272', '格尔木市', '暂无', 'A', 477855267524677]
			},
			{
				name: 'PN203-KH',
				value: ['100.549961', '25.483727', '祥云县', '暂无', 'B', 636289526722629]
			}
		]

		allLineData.value = scatters.value.map((point) => {
			const pointCoord = [point.value[0], point.value[1]]
			// const tooltipPixel = [650, 520]
			// const tooltipCoord = chartDom.value.convertFromPixel('geo', tooltipPixel)
			const tooltipCoord = [91.98, 41.88]
			return {
				coords: [pointCoord, tooltipCoord]
			}
		})
	}

	const drawMap = () => {
		chartDom.value = echarts.init(chart.value)
		echarts.registerMap('china', chinaMap)
		echarts.registerMap('chinaNoSouthIsland', chinaMapNoSouthIsland)
		option.value = {
			backgroundColor: 'transparent',
			tooltip: {
				trigger: 'item',
				triggerOn: 'none',
				className: 'echarts-custom-tooltip',
				position: [180, 450],
				formatter: function (params) {
					if (params.seriesIndex === 0) {
						// waterChart.setOption({
						// 	series: [
						// 		{
						// 			type: 'liquidFill',
						// 			data: [params.value[7], params.value[7] - 0.1, params.value[7] - 0.2], // 多层波浪
						// 			radius: '80%',
						// 			amplitude: 8,
						// 			phase: 'auto',
						// 			period: 'auto',
						// 			direction: 'right',
						// 			shape: 'circle',
						// 			waveAnimation: true,
						// 			animationDuration: 2000,
						// 			animationDurationUpdate: 1000,
						// 			color: ['#FFC300'],
						// 			backgroundStyle: {
						// 				color: 'rgba(255, 255, 255, 0.1)'
						// 			},
						// 			outline: {
						// 				show: true,
						// 				borderDistance: 0,
						// 				itemStyle: {
						// 					borderColor: '#FFC300',
						// 					borderWidth: 3,
						// 					shadowBlur: 20,
						// 					shadowColor: 'rgba(0, 0, 0, 0.25)'
						// 				}
						// 			},
						// 			label: {
						// 				show: true,
						// 				color: '#fff',
						// 				insideColor: '#fff',
						// 				fontSize: 32,
						// 				align: 'center',
						// 				baseline: 'middle'
						// 			}
						// 		}
						// 	]
						// })
						return `
									<div class="tooltip-wrapper">
			           				  <div class="tooltip-title">
			  							<div class="tooltip-title-left">海阳核电厂</div>
			  							<div class="tooltip-title-right">HYP2045104</div>
									  </div>
									  <div class="tooltip-info">
									 	<div class="tooltip-info-left">
									 		<div class="tooltip-item">
			           				 		  <span class="tooltip-key">地址：</span>
			           				 		  <span class="tooltip-value">四川省德阳市</span>
			           				 		</div>
									 		<div class="tooltip-item">
			           				 		  <span class="tooltip-key">开始日期：</span>
			           				 		  <span class="tooltip-value">2025-03-17</span>
			           				 		</div>
									 		<div class="tooltip-item">
			           				 		  <span class="tooltip-key">项目负责人：</span>
			           				 		  <span class="tooltip-value">肖学成</span>
			           				 		</div>
									 	</div>
										<div class="tooltip-info-right">
											<span class="tooltip-key">当前进程：</span>
										</div>
									  </div>
			           				</div>
								`
					}
				}
			},
			geo: [
				{
					layoutCenter: ['50%', '54%'], //位置
					layoutSize: '145%', //大小
					show: true,
					map: 'china',
					zoom: 0.65,
					aspectScale: 0.88,
					itemStyle: {
						normal: {
							areaColor: {
								type: 'linear',
								x: 1200,
								y: 0,
								x2: 0,
								y2: 0,
								colorStops: [
									{
										offset: 0,
										color: 'rgba(3,27,78,0.8)' // 0% 处的颜色
									},
									{
										offset: 1,
										color: 'rgba(58,149,250,0.8)' // 50% 处的颜色
									}
								],
								global: true // 缺省为 false
							},
							borderColor: '#c0f3fb',
							borderWidth: 3
						}
					},
					silent: true
				},
				{
					type: 'map',
					map: 'chinaNoSouthIsland',
					zlevel: -1,
					aspectScale: 0.88,
					zoom: 0.65,
					layoutCenter: ['50%', '54.8%'],
					layoutSize: '145%',
					silent: true,
					itemStyle: {
						normal: {
							borderWidth: 1,
							borderColor: 'rgba(58,149,253,0.8)',
							areaColor: 'rgba(5,21,35,0.8)'
						}
					}
				},
				{
					type: 'map',
					map: 'chinaNoSouthIsland',
					zlevel: -2,
					aspectScale: 0.88,
					zoom: 0.65,
					layoutCenter: ['50%', '55.8%'],
					layoutSize: '145%',
					silent: true,
					itemStyle: {
						normal: {
							borderWidth: 1,
							borderColor: 'rgba(58,149,253,0.6)',
							shadowColor: 'rgba(58,149,253,1)',
							shadowOffsetY: 15,
							shadowBlur: 10,
							areaColor: ''
						}
					}
				}
			],
			series: [
				{
					type: 'effectScatter',
					coordinateSystem: 'geo',
					data: scatters.value,
					showEffectOn: 'render',
					rippleEffect: {
						scale: 3,
						brushType: 'fill'
					},
					label: {
						normal: {
							formatter: '{b}',
							position: 'bottom',
							show: false,
							color: '#fff',
							distance: 10
						}
					},
					symbol: 'circle',
					symbolSize: [25, 15],
					itemStyle: {
						normal: {
							color: '#4BFFFC'
						},
						opacity: 0.5
					},
					zlevel: 4
				},
				// {
				// 	type: 'scatter',
				// 	coordinateSystem: 'geo',
				// 	data: scatters.value,
				// 	label: {
				// 		normal: {
				// 			formatter: '{b}',
				// 			position: 'bottom',
				// 			show: false,
				// 			color: '#fff',
				// 			distance: 10
				// 		}
				// 	},
				// 	symbol: 'circle',
				// 	symbolSize: [30, 20],
				// 	itemStyle: {
				// 		normal: {
				// 			color: '#16ffff',
				// 			shadowBlur: 30,
				// 			shadowColor: '#00fefe'
				// 		},
				// 		opacity: 1
				// 	},
				// 	zlevel: 4
				// },
				// {
				// 	type: 'lines',
				// 	zlevel: 5,
				// 	effect: {
				// 		show: false
				// 	},
				// 	lineStyle: {
				// 		color: '#16ffff',
				// 		width: 2,
				// 		opacity: 0.8,
				// 		curveness: 0.2,
				// 		cap: 'round',
				// 		shadowBlur: 1,
				// 		shadowColor: '#16ffff'
				// 	},
				// 	data: []
				// },
				{
					type: 'lines',
					zlevel: 6,
					effect: {
						show: true,
						constantSpeed: 120,
						color: '#16ffff',
						trailLength: 0.8,
						symbolSize: 14,
						symbol: 'circle'
					},
					lineStyle: {
						color: '#16ffff',
						width: 2,
						opacity: 0.8,
						curveness: 0.2,
						cap: 'round',
						shadowBlur: 1,
						shadowColor: '#16ffff'
					},
					data: [],
					animation: false
				}
			]
		}
		chartDom.value.setOption(option.value)

		// 轮播
		if (scatters.value) {
			let active = 0

			const showTipFun = () => {
				requestAnimationFrame(() => {
					allLineData.value.forEach((item) => {
						item.needEffect = false
					})
					allLineData.value[active].needEffect = true
					chartDom.value.setOption(
						{
							series: [
								{},
								// {
								// 	data: allLineData.value.filter((item) => !item.needEffect)
								// },
								{
									data: allLineData.value.filter((item) => item.needEffect)
								}
							]
						},
						false
					)

					chartDom.value.dispatchAction({
						type: 'showTip',
						seriesIndex: 0,
						dataIndex: active
					})

					// emit('data-changed', scatters.value[active].value[8])
					active = (active + 1) % scatters.value.length
				})
			}

			// 立即执行一次
			showTipFun()
			// 设置定时器
			timer.value = setInterval(showTipFun, 30000)
		}
	}

	onUnmounted(() => {
		if (timer.value) {
			clearInterval(timer.value)
		}
	})
</script>

<style lang="less">
	.echarts-custom-tooltip {
		background: transparent !important;
		border: none !important;
		padding: 0 !important;
		border-radius: 30px !important;

		.tooltip-wrapper {
			background-color: #014e7468;
			border-radius: 30px;
			backdrop-filter: blur(4px);
			box-shadow: 0 2px 12px 0 rgba(40, 77, 239, 0.1);
			width: 700px;
			height: 330px;
			overflow: hidden;

			.tooltip-title {
				padding: 10px 35px;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: linear-gradient(to bottom, #2a9bd3 0%, #1e5d7c 50%, #2a9bd3 100%);
				.tooltip-title-left {
					color: #fff;
					font-size: 30px;
					font-weight: bold;
				}
				.tooltip-title-right {
					color: #fff;
					font-size: 27px;
					font-weight: bold;
					background-image: linear-gradient(
						106.2deg,
						rgba(244, 117, 105, 1) 19.7%,
						rgba(247, 146, 66, 1) 50.5%,
						rgba(254, 190, 7, 1) 83.2%
					);
					border-radius: 80px;
					padding: 12px 25px;
				}
			}

			.tooltip-info {
				padding: 35px;
				display: flex;
				gap: 15px;

				.tooltip-key {
					color: #71e2f5;
					font-size: 28px;
				}

				.tooltip-value {
					color: #fff;
					font-size: 28px;
				}

				.tooltip-info-left {
					flex: 2;
					display: flex;
					flex-direction: column;
					gap: 50px;
				}

				.tooltip-info-right {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: center;
				}
			}
		}
	}
</style>
