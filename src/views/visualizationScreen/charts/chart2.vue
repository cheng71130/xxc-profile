<template>
	<div ref="chart" class="h100 w100"></div>
</template>
<script setup>
	import * as echarts from 'echarts'

	const chart = ref(null)

	onMounted(() => {
		setTimeout(() => {
			const chartDom = echarts.init(chart.value, 'dark')
			const xAxisData = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '西安', '厦门']
			const yAxisData = [54, 75, 122, 65, 50, 75, 130, 62, 34, 63]
			const option = {
				backgroundColor: 'transparent',
				textStyle: {
					fontSize: 24
				},
				tooltip: {
					// trigger: 'axis',
					backgroundColor: 'rgba(17,95,182,0.5)',
					textStyle: {
						color: '#fff'
					},
					formatter: function (params) {
						return (
							params[1].marker +
							'' +
							params[1].name +
							'\n' +
							'<div>' +
							"<span style='display:inline-block;border-radius:1px;width:10px;height:10px;background-color:#007AFF;option:0.5'></span>" +
							"<span style=''> " +
							params[1].seriesName +
							': ' +
							params[1].value +
							'\n' +
							' </span>' +
							'</div>' +
							"<span style='display:inline-block;border-radius:1px;width:10px;height:10px;background-color:#FF9B61;'></span>" +
							'' +
							"<span style=''> " +
							params[3].seriesName +
							': ' +
							params[3].value
						)
					}
				},
				grid: {
					left: '12%',
					right: '5%',
					top: '20%',
					bottom: '15%'
				},
				xAxis: {
					data: xAxisData,
					show: true,
					axisTick: {
						show: false
					},
					axisLine: {
						show: false,
						lineStyle: {
							type: 'solid',
							color: '#fff',
							opacity: 1
						}
					},
					// lineStyle: {
					//     show: true,
					//     type: 'solid'
					// },
					axisLabel: {
						interval: 0,
						rotate: 30,
						align: 'center',
						verticalAlign: 'top',
						textStyle: {
							color: '#fff',
							fontSize: 24
						},
						margin: 12 // 刻度标签与轴线之间的距离。
					}
				},
				yAxis: [
					{
						min: 0,
						max: 150,
						name: '数量',
						nameGap: 25,
						nameTextStyle: {
							align: 'left',
							color: 'rgba(255,255,255,1)',
							padding: [0, 0, 0, -30]
						},
						splitLine: {
							show: false,
							lineStyle: {
								type: 'dashed',
								color: '#2D4377',
								opacity: 0.5
							}
						},
						axisTick: {
							show: false
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#2D4377'
							}
						},
						axisLabel: {
							textStyle: {
								color: '#fff',
								fontSize: 24
							}
						}
					},
					{
						show: false,
						name: '(万户)',
						nameTextStyle: {
							align: 'left',
							color: 'rgba(255,255,255,0.8)',
							padding: [0, 0, 0, 10]
						},
						splitLine: { show: false },
						axisLine: { show: true },
						axisTick: { show: false },
						axisLabel: {
							textStyle: { color: 'rgba(255,255,255,0.8)' }
						}
					}
				],
				// legend: {
				// 	top: '5%',
				// 	left: '50%',
				// 	textStyle: {
				// 		color: '#fff',
				// 		fontSize: 14
				// 	},

				// 	itemGap: 12 // 设置间距
				// },
				series: [
					// 下半截柱状图
					{
						name: '数量',
						type: 'bar',
						barWidth: 20,
						barGap: '-100%',
						itemStyle: {
							// legend文本
							opacity: 1,
							borderRadius: 40,
							borderColor: '#3681FF',
							// color: function (params) {
							// 	var a = params.name.slice(0, 2)
							// 	return new echarts.graphic.LinearGradient(
							// 		0,
							// 		0,
							// 		0,
							// 		1,
							// 		[
							// 			{
							// 				offset: 0,
							// 				color: '#12B9DB' // 0% 处的颜色
							// 			},
							// 			{
							// 				offset: 1,
							// 				color: '#007AFF' // 100% 处的颜色
							// 			}
							// 		],
							// 		false
							// 	)
							// },
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgba(15, 51, 82, 1)'
								},

								{
									offset: 1,
									color: 'rgba(0, 168, 255, 1)'
								}
							])
						},

						data: yAxisData
					},
					{
						name: '数量',
						z: 9,
						yAxisIndex: 0,
						type: 'line',
						// smooth: true,
						data: yAxisData,
						symbol: 'circle',
						symbolSize: 12,
						lineStyle: {
							normal: {
								color: '#02D6B0'
							}
						},
						itemStyle: {
							color: '#02D6B0',
							borderColor: '#fff',
							borderWidth: 2
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1,
									[
										{
											offset: 0,
											color: 'rgba(0, 255, 246, 0.5)'
										},
										{
											offset: 1,
											color: 'rgba(0, 255, 246, 0)'
										}
									],
									false
								)
							}
						}
					},
					{
						name: '',
						type: 'bar',
						barWidth: 21,
						barGap: '-100%',
						z: 0,
						itemStyle: {
							borderRadius: 40,
							color: '#163F7A',
							opacity: 0.7,
							color: '#1F5382'
						},
						data: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150]
					}
				]
			}
			chartDom.setOption(option)
			setInterval(function () {
				yAxisData.shift()
				yAxisData.push(Math.round(Math.random() * 150))
				chartDom.setOption({
					series: [
						{
							data: yAxisData
						},
						{
							data: yAxisData
						}
					]
				})
			}, 2500)
		})
	})
</script>
<style scoped lang="less"></style>
