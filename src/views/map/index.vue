<template>
	<div ref="chinaMap" class="box-card"></div>
</template>
<script setup>
	import { mapData } from '../../common/mapData.js'
	import * as echarts from 'echarts'

	const chinaMap = ref()
	onMounted(() => {
		drawChina()
	})
	let regions = [
		{
			name: '山东',
			itemStyle: {
				areaColor: '#BEC4F3',
				opacity: 1
			}
		},
		{
			name: '辽宁',
			itemStyle: {
				areaColor: '#BEC4F3',
				opacity: 1
			}
		},
		{
			name: '浙江',
			itemStyle: {
				areaColor: '#BEC4F3',
				opacity: 1
			}
		}
	]
	function drawChina() {
		let myChart = echarts.init(chinaMap.value)
		echarts.registerMap('china', mapData) //注册可用的地图
		let option = {
			title: {
				text: '中国 - China',
				textStyle: {
					fontSize: 28
				},
				left: '45%',
				top: '2%'
			},

			tooltip: {
				show: true,
				padding: 5
			},
			legend: {
				show: true
			},
			geo: {
				silent: true,
				map: 'china',
				// roam: true,
				// zoom: 1,
				// scaleLimit: {
				//   min: 0.5, //最小
				//   max: 2, //最大
				// },
				label: {
					show: true,
					color: '#454545'
				},
				// regions: regions,
				itemStyle: {
					areaColor: '#fff',
					borderWidth: 1
				}
			},
			//配置属性
			series: [
				{
					type: 'map',
					map: 'china',
					silent: true,
					label: {
						show: true,
						color: '#454545'
					},
					itemStyle: {
						normal: {
							areaColor: '#fff',
							borderColor: '#a18a3a',
							borderWidth: 0.2
						},
						emphasis: {
							show: false,
							areaColor: null
						}
					},
					data: regions
				},
				{
					type: 'effectScatter',
					coordinateSystem: 'geo',
					data: [
						{ name: '荣成', value: [122.41, 37.16] },
						{ name: '烟台', value: [121.454425, 37.469868] }
						// { name: "瓦房店", value: [121.979603, 39.627114] },
						// { name: "嘉兴", value: [120.762045, 30.750912] },
					],
					showEffectOn: 'render',
					rippleEffect: {
						//涟漪特效相关配置
						brushType: 'stroke', //波纹的绘制方式，可选 'stroke' 和 'fill'
						scale: 5
					},
					hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果
					label: {
						// show: true,
						show: false,
						formatter: '{b}',
						position: 'bottom',
						distance: 10,
						color: '#ff0048',
						fontStyle: 'oblique',
						fontWeight: 'bold'
					},
					itemStyle: {
						//图形样式，normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时
						normal: {
							color: '#ff0048', //散点的颜色
							shadowBlur: 10,
							shadowColor: 20
						}
					},
					symbolSize: 8,
					zlevel: 1,
					tooltip: {
						formatter: '{b}<br/>状态：进行中',
						borderColor: '#82A6CD'
					}
				},
				{
					type: 'scatter',
					coordinateSystem: 'geo',
					data: [
						{ name: '瓦房店', value: [121.979603, 39.627114] },
						{ name: '嘉兴', value: [120.762045, 30.750912] }
					],
					showEffectOn: 'render',
					hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果
					label: {
						// show: true,
						show: false,
						formatter: '{b}',
						position: 'bottom',
						distance: 10,
						color: '#ff0048',
						fontStyle: 'oblique',
						fontWeight: 'bold'
					},
					itemStyle: {
						//图形样式，normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时
						normal: {
							color: '#ff0048', //散点的颜色
							shadowBlur: 10,
							shadowColor: 20
						}
					},
					symbolSize: 8,
					zlevel: 1,
					tooltip: {
						formatter: '{b}<br/>状态：未开始',
						borderColor: '#82A6CD'
					}
				}
				// {
				//   type: "lines",
				//   coordinateSystem: "geo",
				//   data: [
				//     {
				//       coords: [
				//         [122.41, 37.16],
				//         [121.454425, 37.469868],
				//       ],
				//       // 统一的样式设置
				//       lineStyle: {
				//         width: 2,
				//       },
				//     },
				//   ],
				// },
			]
		}
		myChart.setOption(option)
	}
</script>
<style scoped lang="less">
	.box-card {
		width: 100vw;
		height: 100vh;
		background-color: antiquewhite;
		// background-color: #454545;
	}
</style>
