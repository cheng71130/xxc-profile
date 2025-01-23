<template>
	<div ref="chart" class="h100 w100"></div>
</template>
<script setup>
	import * as echarts from 'echarts'

	const chart = ref(null)

	onMounted(() => {
		setTimeout(() => {
			const chartDom = echarts.init(chart.value, 'dark')
			let xAxisData = ['11-14', '11-15', '11-16', '11-17', '11-18']
			let fwrs = [110, 120, 300, 200, 100]
			let xdrs = [150, 160, 120, 130, 140]
			let zhl = [60, 70, 45, 80, 45]
			let option = {
				backgroundColor: 'transparent',
				textStyle: {
					fontSize: 24,
					color: '#fff'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						lineStyle: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [
									{
										offset: 0,
										color: 'rgba(0, 255, 233,0)'
									},
									{
										offset: 0.5,
										color: 'rgba(255, 255, 255,1)'
									},
									{
										offset: 1,
										color: 'rgba(0, 255, 233,0)'
									}
								],
								global: false
							}
						}
					},
					textStyle: {
						color: '#fff'
					},
					backgroundColor: 'rgba(0, 58, 99, 0.8)', //设置背景颜色
					borderColor: 'rgba(0, 58, 99, 0.8)',
					confine: true,
					formatter: `{b}<br>{a}：{c}千人<br>{a1}：{c1}千人<br>{a2}：{c2}%`
				},
				legend: {
					itemWidth: 24,
					itemHeight: 16,
					itemGap: 30,
					right: '2%',
					top: '6%',
					x: 'center',
					textStyle: {
						fontSize: 24,
						color: '#fff'
					},
					data: ['访问人数', '下单人数', '转化率'],
					selectedMode: false
				},
				grid: {
					left: '12%',
					right: '10%',
					top: '25%',
					bottom: '10%'
				},
				xAxis: {
					type: 'category',
					axisTick: {
						show: false
					},
					axisLine: {
						lineStyle: {
							color: '#fff'
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
				yAxis: [
					{
						type: 'value',
						name: '人数 / 千人',
						splitNumber: 5,
						nameTextStyle: {
							color: '#fff',
							fontSize: 24,
							align: 'center',
							padding: [0, 20, 5, 0]
						},
						axisLabel: {
							formatter: '{value}',
							color: 'rgba(95, 187, 235, 1)',
							textStyle: {
								fontSize: 24,
								color: '#fff',
								lineHeight: 16
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: 'rgba(28, 130, 197, .3)',
								type: 'dashed'
							}
						}
					},
					{
						name: '转化率 / %',
						splitNumber: 5,
						max: 100,
						type: 'value',
						nameTextStyle: {
							color: '#fff',
							fontSize: 24,
							align: 'center',
							padding: [0, 0, 5, 0]
						},
						axisLabel: {
							show: true,
							fontSize: 24,
							color: '#fff'
						},
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						}
					}
				],
				series: [
					{
						name: '访问人数',
						type: 'bar',
						data: fwrs,
						barWidth: 25,
						barGap: '50%',
						itemStyle: {
							normal: {
								borderColor: '#3681FF',
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
							}
						},
						label: {
							show: false,
							position: 'top',
							fontSize: 24,
							color: '#F5F5F5',
							offset: [0, -5],
							formatter: '{c}'
						}
					},
					{
						name: '下单人数',
						type: 'bar',
						data: xdrs,
						barWidth: 25,
						barGap: '50%',
						itemStyle: {
							normal: {
								borderColor: 'rgba(54, 234, 255, 1)',
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: 'rgba(15, 51, 82, 1)'
									},

									{
										offset: 1,
										color: 'rgba(21, 219, 203, 1)'
									}
								])
							}
						},
						label: {
							show: false,
							position: 'top',
							fontSize: 24,
							color: '#F5F5F5',
							offset: [0, -5],
							formatter: '{c}'
						}
					},
					{
						name: '转化率',
						type: 'line',
						yAxisIndex: 1,
						showSymbol: true,
						symbolSize: 12,
						smooth: true,
						symbol: 'circle',
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
						},
						data: zhl // 折线图的数据
					}
				]
			}
			chartDom.setOption(option)
		})
	})
</script>
<style scoped lang="less"></style>
