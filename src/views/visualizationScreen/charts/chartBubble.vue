<template>
	<div ref="chart" class="h-full w-full"></div>
</template>
<script setup>
	import * as echarts from 'echarts'

	const chart = ref(null)
	onMounted(() => {
		setTimeout(() => {
			const chartDom = echarts.init(chart.value, 'dark')
			const data = [
				{ name: '项目组', value: 0.6, x: 10, y: 50, color: '#46B955' },
				{ name: '磁粉', value: 18.8, x: 30, y: 80, color: '#26D4FF' },
				{ name: '涡流', value: 7.3, x: 50, y: 60, color: '#1D4AFF' },
				{ name: '超声', value: 5.8, x: 70, y: 40, color: '#2F54EB' },
				{ name: '目视', value: 3.3, x: 90, y: 70, color: '#389E0D' },
				{ name: '安徽', value: 2.8, x: 20, y: 20, color: '#2F54EB' },
				{ name: '湖南', value: 1.5, x: 40, y: 30, color: '#389E0D' },
				{ name: '甘肃', value: 0.9, x: 60, y: 10, color: '#36CFC9' }
			]
			const option = {
				backgroundColor: 'transparent',
				grid: {
					left: '12%',
					right: '10%',
					top: '25%',
					bottom: '10%'
				},
				tooltip: {
					trigger: 'item',
					formatter: (params) => `${params.data.name}: ${params.data.value}%`
				},
				xAxis: {
					show: false
				},
				yAxis: {
					show: false
				},
				series: [
					{
						type: 'scatter',
						data: data.map((item) => ({
							name: item.name,
							value: [item.x, item.y],
							symbolSize: Math.random() * 60 + 100, // 随机大小，范围在 60 到 80 之间
							itemStyle: {
								normal: {
									color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
										{
											offset: 0.2,
											color: 'rgba(27, 54, 72, 0.2)'
										},
										{
											offset: 0.8,
											color: item.color
										}
									]),
									opacity: 1,
									borderWidth: 3,
									borderColor: item.color,
									shadowBlur: 14,
									symbolOffset: 1.2,
									shadowColor: item.color
								}
							}
						})),
						label: {
							show: true,
							formatter: (params) => `{a|${params.data.name}}\n{b|${params.data.value[0]}%}`,
							rich: {
								a: {
									color: '#fff',
									lineHeight: 40,
									fontSize: 20
								},
								b: {
									fontSize: 30
								}
							},

							position: 'inside'
							// color: '#fff',
							// fontSize: 24
						}
					}
				]
			}
			chartDom.setOption(option)
		})
	})
</script>
