<template>
	<div ref="chart" class="h-full w-full"></div>
</template>
<script setup>
	import * as echarts from 'echarts'

	const chart = ref(null)

	onMounted(() => {
		setTimeout(() => {
			const chartDom = echarts.init(chart.value, 'dark')
			const option = {
				backgroundColor: 'transparent',
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
					}
				},
				grid: {
					top: '12%',
					left: '7%',
					right: '7%',
					bottom: '12%'
				},
				xAxis: [
					{
						type: 'category',
						splitArea: {
							color: '#f00',
							lineStyle: {
								color: '#f00'
							}
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							textStyle: {
								color: '#fff',
								fontSize: 24
							}
						},
						axisLine: {
							lineStyle: {
								// color: '#fff'
								color: 'rgba(255, 255, 255, .5)'
							}
						},
						axisTick: {
							show: false
						},
						boundaryGap: false,
						data: ['A', 'B', 'C', 'D', 'E', 'F']
					}
				],
				yAxis: [
					{
						type: 'value',
						min: 0,
						splitNumber: 4,
						splitLine: {
							show: true,
							lineStyle: {
								color: 'rgba(255,255,255,0.1)'
							}
						},
						axisLine: {
							show: false
						},
						axisLabel: {
							show: false,
							margin: 20,
							textStyle: {
								color: '#d1e6eb'
							}
						},
						axisTick: {
							show: false
						}
					}
				],
				series: [
					{
						name: '注册总量',
						type: 'line',
						smooth: true,
						showAllSymbol: true,
						symbol: 'circle',
						symbolSize: 20,
						lineStyle: {
							normal: {
								color: '#00b3f4',
								width: 2,
								shadowColor: 'rgba(0, 0, 0, .3)',
								shadowBlur: 0,
								shadowOffsetY: 5,
								shadowOffsetX: 5
							}
						},
						label: {
							show: false,
							position: 'top',
							textStyle: {
								color: '#00b3f4',
								fontSize: 24
							}
						},
						itemStyle: {
							color: '#00b3f4',
							borderColor: '#fff',
							borderWidth: 3,
							shadowColor: 'rgba(0, 0, 0, .3)',
							shadowBlur: 0,
							shadowOffsetY: 2,
							shadowOffsetX: 2
						},
						tooltip: {
							show: false
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
											color: 'rgba(0,179,244,0.3)'
										},
										{
											offset: 1,
											color: 'rgba(0,179,244,0)'
										}
									],
									false
								),
								shadowColor: 'rgba(0,179,244, 0.9)',
								shadowBlur: 20
							}
						},
						markPoint: {
							data: [
								{
									type: 'min',
									name: 'Min',
									symbolSize: 90,
									symbolOffset: [0, -15],
									label: {
										fontSize: 24,
										color: '#fff'
									}
								}
							]
						},
						data: [502, 205, 332, 281, 398, 214]
					},
					{
						name: '注册总量',
						type: 'line',
						smooth: true,
						showAllSymbol: true,
						symbol: 'circle',
						symbolSize: 20,
						lineStyle: {
							normal: {
								color: '#00ca95',
								width: 2,
								shadowColor: 'rgba(0, 0, 0, .3)',
								shadowBlur: 0,
								shadowOffsetY: 5,
								shadowOffsetX: 5
							}
						},
						label: {
							show: false,
							position: 'top',
							textStyle: {
								color: '#00ca95',
								fontSize: 24
							}
						},

						itemStyle: {
							color: '#00ca95',
							borderColor: '#fff',
							borderWidth: 3,
							shadowColor: 'rgba(0, 0, 0, .3)',
							shadowBlur: 0,
							shadowOffsetY: 2,
							shadowOffsetX: 2
						},
						tooltip: {
							show: false
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
											color: 'rgba(0,202,149,0.3)'
										},
										{
											offset: 1,
											color: 'rgba(0,202,149,0)'
										}
									],
									false
								),
								shadowColor: 'rgba(0,202,149, 0.9)',
								shadowBlur: 20
							}
						},
						markPoint: {
							data: [
								{
									type: 'max',
									name: 'Max',
									symbolSize: 90,
									symbolOffset: [0, -15],
									label: {
										fontSize: 24,
										color: '#fff'
									}
								}
							]
						},
						data: [281, 398, 214, 479, 189, 356]
					}
				]
			}
			chartDom.setOption(option)
		})
	})
</script>
<style scoped lang="less"></style>
