<template>
	<div ref="chart" class="h-full w-full"></div>
</template>
<script setup>
	import * as echarts from 'echarts'

	const chart = ref(null)

	onMounted(() => {
		setTimeout(() => {
			const chartDom = echarts.init(chart.value, 'dark')
			const xAxisData = ['本部', 'HY104', 'HY204', 'QS204', 'xxx']
			const seriesData = [
				{ measureUnit: '吨', value: 500 },
				{ measureUnit: '吨', value: 800 },
				{ measureUnit: '吨', value: 400 },
				{ measureUnit: '吨', value: 300 },
				{ measureUnit: '吨', value: 500 }
			]

			let maxAmount = 0
			seriesData.map((item) => {
				item.value > maxAmount ? (maxAmount = item.value) : (maxAmount = maxAmount)
			})

			let maxValArr = new Array(seriesData.length).fill(maxAmount)
			const option = {
				backgroundColor: 'transparent',
				textStyle: {
					fontSize: 24,
					color: '#fff'
				},
				legend: {
					show: false,
					icon: 'rect',
					textStyle: {
						color: '#fff'
					}
				},
				grid: {
					left: '12%',
					right: '5%',
					top: '15%',
					bottom: '12%'
				},
				xAxis: {
					type: 'category',
					axisTick: {
						show: false
					},
					axisLine: {
						// show: false,
						lineStyle: {
							color: 'rgba(255, 255, 255, .1)'
						}
					},
					axisLabel: {
						textStyle: {
							color: '#fff',
							fontSize: 24
						}
					},
					data: xAxisData
				},
				yAxis: {
					type: 'value',
					splitLine: {
						lineStyle: {
							color: '#2D4377',
							opacity: 0.5
						}
					},
					axisLabel: {
						textStyle: {
							color: '#fff',
							fontSize: 24
						}
					}
				},
				series: [
					{
						name: '全量背景图',
						type: 'bar',
						barGap: '-100%',
						data: maxValArr,
						barWidth: 50,
						itemStyle: {
							normal: {
								// color: 'rgba(63, 169, 245, 0.2)',
								color: '#172450'
							}
						},
						z: 0
					},
					{
						type: 'pictorialBar',
						name: '渐变背景',
						barWidth: 50,
						symbol: 'rect',
						symbolSize: '100%',
						symbolPosition: 'start',
						symbolOffset: [0, 0],
						label: {
							normal: {
								show: true,
								position: 'top',
								// formatter: (params) => {
								// 	return [...Object.values(seriesData[params.dataIndex])].join('\n')
								// },
								fontSize: 24,
								lineHeight: 16,
								color: '#fff'
							}
						},
						itemStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: 'rgba(221, 255, 252, 1)'
									},
									{
										offset: 0.1,
										color: 'rgba(8, 239, 222, 1)'
									},
									{
										offset: 1,
										color: 'rgba(0, 128, 167, 0.20)'
									}
								])
							}
						},
						z: 1,
						zlevel: 0,
						data: seriesData.map((item) => {
							return item.value
						})
					},
					{
						type: 'pictorialBar',
						name: '块状切片',
						itemStyle: {
							normal: {
								color: '#011140'
							}
						},
						barWidth: 50,
						symbolRepeat: 28,
						symbol: 'rect',
						symbolClip: true,
						symbolSize: [50, 4],
						symbolPosition: 'start',
						symbolOffset: [0, 0],
						data: seriesData.map((item) => {
							return item.value
						}),
						z: 2,
						zlevel: 0
					}
				]
			}
			chartDom.setOption(option)
		})
	})
</script>
<style scoped lang="less"></style>
