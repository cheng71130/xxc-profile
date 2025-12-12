<template>
	<div ref="chart" class="h-full w-full"></div>
</template>
<script setup>
	import * as echarts from 'echarts'

	const chart = ref(null)
	const chartDom = ref(null)
	onMounted(() => {
		setTimeout(() => {
			chartDom.value = echarts.init(chart.value, 'dark')
			const option = {
				backgroundColor: 'transparent',
				color: ['#3058DC', '#17C2D4', '#16C38B', '#248DA2', '#3F5785'],
				tooltip: {
					trigger: 'item'
				},
				legend: {
					orient: 'vertical',
					itemWidth: 24,
					itemHeight: 16,
					itemGap: 40,
					right: '15%',
					top: '15%',
					textStyle: {
						fontSize: 24,
						color: '#fff'
					}
				},
				series: [
					{
						name: 'Access From',
						type: 'pie',
						center: ['30%', '50%'],
						radius: '70%',
						data: [
							{ value: 1048, name: 'Search Engine' },
							{ value: 735, name: 'Direct' },
							{ value: 580, name: 'Email' },
							{ value: 484, name: 'Union Ads' },
							{ value: 300, name: 'Video Ads' }
						],
						label: {
							show: false
						},
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}
				]
			}
			chartDom.value.setOption(option)
		})
	})
	onUnmounted(() => {
		if (chartDom.value) {
			chartDom.value.dispose()
		}
	})
</script>
