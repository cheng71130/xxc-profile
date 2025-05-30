<template>
	<div ref="chart" class="h-full w-full"></div>
</template>
<script setup>
	import * as echarts from 'echarts'

	const chart = ref(null)
	onMounted(() => {
		setTimeout(() => {
			const chartDom = echarts.init(chart.value, 'dark')
			const color = ['#4A99FF', '#4BFFFC'] //线条边框颜色
			const legend = {
				//data，就是取得每个series里面的name属性。
				orient: 'vertical',
				padding: 0,
				top: 50,
				right: 100,
				itemWidth: 24,
				itemHeight: 16,
				itemGap: 30,
				textStyle: {
					fontSize: 24,
					color: '#fff'
				}
			}
			const tooltip = {
				show: false
			}
			const indicator = [
				{
					name: 'UT',
					max: 6000
				},
				{
					name: 'RT',
					max: 5000
				},
				{
					name: 'PT',
					max: 5000
				},
				{
					name: 'VT',
					max: 5000
				},
				{
					name: 'ET',
					max: 5000
				},
				{
					name: 'MT',
					max: 5000
				},
				{
					name: 'LT',
					max: 5000
				},
				{
					name: 'AT',
					max: 5000
				}
			]
			const dataArr = [
				{
					name: '一级',
					value: [4300, 4700, 3600, 3900, 3800, 4200, 2000, 1900],
					symbolSize: 8,
					symbol: 'circle',

					lineStyle: {
						width: 3
					},
					areaStyle: {
						// 单项区域填充样式
						color: {
							type: 'linear',
							x: 0, //右
							y: 0, //下
							x2: 1, //左
							y2: 1, //上
							colorStops: [
								{
									offset: 0,
									color: color[0]
								},
								{
									offset: 0.5,
									color: 'rgba(0,0,0,0)'
								},
								{
									offset: 1,
									color: color[0]
								}
							],
							global: false
						},
						opacity: 1 // 区域透明度
					}
				},
				{
					value: [3200, 3000, 3400, 2000, 3900, 2000, 3200, 4900],
					name: '二级',
					symbolSize: 8,
					symbol: 'circle',
					lineStyle: {
						width: 3
					},

					areaStyle: {
						// 单项区域填充样式
						color: {
							type: 'linear',
							x: 0, //右
							y: 0, //下
							x2: 1, //左
							y2: 1, //上
							colorStops: [
								{
									offset: 0,
									color: color[1]
								},
								{
									offset: 0.5,
									color: 'rgba(0,0,0,0)'
								},
								{
									offset: 1,
									color: color[1]
								}
							],
							global: false
						},
						opacity: 1 // 区域透明度
					}
				},
				{
					value: [3600, 2000, 4400, 3000, 2900, 4000, 2000, 1900],
					name: '三级',
					symbolSize: 8,
					symbol: 'circle',
					lineStyle: {
						width: 3
					},

					areaStyle: {
						// 单项区域填充样式
						color: {
							type: 'linear',
							x: 0, //右
							y: 0, //下
							x2: 1, //左
							y2: 1, //上
							colorStops: [
								{
									offset: 0,
									color: color[1]
								},
								{
									offset: 0.5,
									color: 'rgba(0,0,0,0)'
								},
								{
									offset: 1,
									color: color[1]
								}
							],
							global: false
						},
						opacity: 1 // 区域透明度
					}
				}
			]

			const option = {
				backgroundColor: 'transparent',
				color,
				legend,
				tooltip,
				radar: {
					center: ['35%', '52%'], //圆心坐标距离左边和上边的距离
					radius: ['1%', '65%'], //内外半径，不写默认是75%
					startAngle: 90, //可以旋转图形
					shape: 'polygon',
					axisName: {
						color: '#fff',
						fontSize: 24
					},
					indicator: indicator,
					splitArea: {
						show: false //默认显示颜色分割区域，不需要显示
					},
					axisLine: {
						show: true, //是否显示十字交叉线
						//指向外圈文本的分隔线样式
						lineStyle: {
							color: '#153269' //线条颜色
						}
					},
					axisLabel: { show: false },
					splitLine: {
						//雷达一圈圈
						show: true,
						lineStyle: {
							type: 'solid',
							color: '#113865', // 雷达一圈圈颜色分隔线颜色
							width: 2 // 分隔线线宽
						}
					}
				},
				series: [
					{
						type: 'radar',
						data: dataArr
					}
				]
			}

			chartDom.setOption(option)
		})
	})
</script>
