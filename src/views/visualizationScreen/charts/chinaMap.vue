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
	const customerInfo = ref([])

	onMounted(async () => {
		// drawMap()
	})

	const drawMap = () => {
		chartDom.value = echarts.init(chart.value)
		echarts.registerMap('china', chinaMap)
		echarts.registerMap('chinaNoSouthIsland', chinaMapNoSouthIsland)
		option.value = {
			backgroundColor: 'transparent',
			tooltip: {
				show: false
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
					data: customerInfo.value,
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
							color: '#16ffff'
						},
						opacity: 0.5
					},
					zlevel: 4
				}
			]
		}
		chartDom.value.setOption(option.value)
	}
</script>
<style scoped lang="less"></style>
