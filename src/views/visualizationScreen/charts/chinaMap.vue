<template>
	<div ref="chart" class="h100 w100"></div>
</template>
<script setup>
	import * as echarts from 'echarts'
	import { chinaMap } from '../common/chinaMap.js'
	import { chinaMapNoSouthIsland } from '../common/chinaMapNoSouthIsland.js'

	const chart = ref(null)
	const chartDom = ref(null)
	const option = ref({})
	const scatters = ref([])
	const timer = ref()

	onMounted(async () => {
		await getScatters()
		drawMap()
	})

	const getScatters = async () => {
		scatters.value = [
			{
				name: 'HY101',
				value: ['121.173506', '36.688316', '海阳市', '暂无', 'A', 463830391451717]
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
	}

	const drawMap = () => {
		chartDom.value = echarts.init(chart.value)
		echarts.registerMap('china', chinaMap)
		echarts.registerMap('chinaNoSouthIsland', chinaMapNoSouthIsland)
		option.value = {
			backgroundColor: 'transparent',
			tooltip: {
				trigger: 'item',
				className: 'echarts-custom-tooltip',
				position: 'top',
				formatter: function (params) {
					if (params.componentSubType === 'effectScatter') {
						return `
								<div class="tooltip-wrapper">
	           					  <div class="tooltip-title">${params.name}</div>
								  <div class="tooltip-info">
	           						<div class="tooltip-item">
	           						  <span class="tooltip-dot" style="background-color: ${params.color}"></span>
	           						  <span class="tooltip-value">地址 ：${params.value[2]}</span>
	           						</div>
	           						<div class="tooltip-item">
	           						  <span class="tooltip-dot" style="background-color: ${params.color}"></span>
	           						  <span class="tooltip-value">进程 ：${params.value[3]}</span>
	           						</div>
	           						<div class="tooltip-item">
	           						  <span class="tooltip-dot" style="background-color: ${params.color}"></span>
	           						  <span class="tooltip-value">等级 ：${params.value[4]}</span>
	           						</div>
								  </div>
	           					</div>
							`
					}
				}
			},
			geo: [
				{
					layoutCenter: ['50%', '50%'], //位置
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
										color: 'rgba(3,27,78,0.75)' // 0% 处的颜色
									},
									{
										offset: 1,
										color: 'rgba(58,149,253,0.75)' // 50% 处的颜色
									}
								],
								global: true // 缺省为 false
							},
							borderColor: '#c0f3fb',
							borderWidth: 3
							// shadowColor: '#8cd3ef',
							// shadowOffsetY: 10,
							// shadowBlur: 120
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
					layoutCenter: ['50%', '51%'],
					layoutSize: '145%',
					silent: true,
					itemStyle: {
						normal: {
							borderWidth: 1,
							// borderColor:"rgba(17, 149, 216,0.6)",
							borderColor: 'rgba(58,149,253,0.8)',
							shadowColor: 'rgba(172, 122, 255,0.5)',
							shadowOffsetY: 5,
							shadowBlur: 10,
							areaColor: 'rgba(5,21,35,0.1)'
						}
					}
				},
				{
					type: 'map',
					map: 'chinaNoSouthIsland',
					zlevel: -2,
					aspectScale: 0.88,
					zoom: 0.65,
					layoutCenter: ['50%', '52%'],
					layoutSize: '145%',
					silent: true,
					itemStyle: {
						normal: {
							borderWidth: 1,
							borderColor: 'rgba(58,149,253,0.6)',
							shadowColor: 'rgba(65, 214, 255,1)',
							shadowOffsetY: 5,
							shadowBlur: 10,
							areaColor: 'transpercent'
						}
					}
				},
				{
					type: 'map',
					map: 'chinaNoSouthIsland',
					zlevel: -3,
					aspectScale: 0.88,
					zoom: 0.65,
					layoutCenter: ['50%', '53%'],
					layoutSize: '145%',
					silent: true,
					itemStyle: {
						normal: {
							borderWidth: 1,
							// borderColor: "rgba(11, 43, 97,0.8)",
							borderColor: 'rgba(58,149,253,0.4)',
							shadowColor: 'rgba(58,149,253,1)',
							shadowOffsetY: 15,
							shadowBlur: 10,
							areaColor: 'transpercent'
						}
					}
				},
				{
					type: 'map',
					map: 'chinaNoSouthIsland',
					zlevel: -4,
					aspectScale: 0.88,
					zoom: 0.65,
					layoutCenter: ['50%', '54%'],
					layoutSize: '145%',
					silent: true,
					itemStyle: {
						normal: {
							borderWidth: 5,
							// borderColor: "rgba(11, 43, 97,0.8)",
							borderColor: 'rgba(5,9,57,0.8)',
							shadowColor: 'rgba(29, 111, 165,0.8)',
							shadowOffsetY: 15,
							shadowBlur: 10,
							areaColor: 'rgba(5,21,35,0.1)'
						}
					}
				}
			],
			series: [
				// 涟漪散点图
				{
					type: 'effectScatter',
					coordinateSystem: 'geo',
					data: scatters.value,
					showEffectOn: 'render',
					rippleEffect: {
						scale: 4,
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
				}
			]
		}
		chartDom.value.setOption(option.value)

		// 轮播
		if (scatters.value) {
			let active = 0
			const showTipFun = () => {
				chartDom.value.dispatchAction({
					type: 'showTip',
					seriesIndex: 0,
					dataIndex: active
				})
				// emit('dataChanged', scatters.value[active].value[5])
				active++
			}
			const activeFun = () => {
				if (active < scatters.value.length) {
					showTipFun()
				} else {
					active = 0 // 重置计数器
					showTipFun()
				}
			}
			// 立即执行一次
			activeFun()
			// 然后设置定时器
			timer.value = setInterval(activeFun, 5000)
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
		.tooltip-wrapper {
			background: linear-gradient(to left, rgba(11, 46, 143, 0.75), rgba(54, 120, 218, 0.75));
			padding: 20px 30px;
			border-radius: 10px;
			min-width: 150px;
			backdrop-filter: blur(4px);
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			.tooltip-title {
				color: #fff;
				font-size: 30px;
				font-weight: 500;
				margin-bottom: 30px;
			}

			.tooltip-info {
				display: flex;
				flex-direction: column;
				gap: 15px;

				.tooltip-item {
					display: flex;
					align-items: center;
					gap: 20px;
					color: rgba(255, 255, 255, 0.9);
					font-size: 26px;

					.tooltip-dot {
						width: 12px;
						height: 12px;
						border-radius: 50%;
						flex-shrink: 0;
					}

					.tooltip-value {
						font-weight: 500;
					}
				}
			}
		}
	}
</style>
