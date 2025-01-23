<template>
	<div ref="chart" class="h100 w100"></div>
</template>
<script setup>
	import * as echarts from 'echarts'

	const chart = ref(null)
	onMounted(() => {
		setTimeout(() => {
			const chartDom = echarts.init(chart.value, 'dark')
			let information = {
				dataArray: [
					{
						value: 45,
						name: '正常'
					},
					{
						value: 32,
						name: '故障'
					},
					{
						value: 16,
						name: '报废'
					},
					{
						value: 7,
						name: '其他'
					}
				]
			}
			let option = {
				backgroundColor: 'transparent',
				tooltip: {
					trigger: 'item',
					backgroundColor: 'rgba(9,40,84,0.8)',
					borderColor: 'rgba(9,40,84,0.8)',
					textStyle: {
						fontSize: 20,
						color: '#fff'
					},
					formatter: function (params) {
						return (
							'<span style="margin-right: 5px; border-radius: 50%; display: inline-block; width:14px; height: 14px; vertical-align: middle; background:linear-gradient( ' +
							params.color.colorStops[0].color +
							', ' +
							params.color.colorStops[1].color +
							');"></span>' +
							params.name +
							"&nbsp;&nbsp;<span style='font-weight:bold'>" +
							params.value +
							'</span>'
						)
					}
				},
				polar: {},
				angleAxis: {
					interval: 1,
					type: 'category',
					data: [],
					z: 10,
					axisLine: {
						show: false,
						lineStyle: {
							color: '#0B4A6B',
							width: 1,
							type: 'solid'
						}
					},
					axisLabel: {
						show: false,
						interval: 0,
						color: '#0B4A6B',
						margin: 8,
						fontSize: 20
					}
				},
				radiusAxis: {
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						formatter: '{value} %',
						show: false,
						padding: [0, 0, 20, 0],
						color: '#0B3E5E',
						fontSize: 20
					}
				},
				calculable: true,
				series: [
					{
						type: 'pie',
						radius: ['16%', '17%'],
						center: ['50%', '55%'],
						emphasis: {
							scale: false
						},
						labelLine: {
							show: false,
							length: 30,
							length2: 55
						},
						data: [
							{
								name: '',
								value: 0,
								itemStyle: {
									color: '#0189cc'
								},
								tooltip: {
									show: false
								}
							}
						]
					},
					{
						type: 'pie',
						radius: ['20%', '70%'],
						center: ['50%', '55%'],
						roseType: 'area', // 展示南丁格尔图
						zlevel: 10,
						label: {
							show: true,
							formatter: function (param) {
								return '{a|' + param.name + '}' + '{s|' + ' ' + param.percent + '%}\n\n'
							},
							padding: [0, -140],
							height: 80,
							rich: {
								a: {
									color: '#fff',
									fontSize: '26'
								},
								s: {
									color: '#00ffff',
									fontSize: '24'
								}
							},
							position: 'outside'
						},
						emphasis: {
							label: {
								show: true
							},
							labelLine: {
								show: true
							}
						},
						itemStyle: {
							color: function (params) {
								const colorList = [
									{
										c1: ' #45EAFF',
										c2: '#40ADAC'
									},
									{
										c1: '#12B3F8',
										c2: '#7DE8FF'
									},
									{
										c1: ' #0176D3',
										c2: '#13B7FF'
									},
									{
										c1: '#015BD3',
										c2: '#138DFF'
									}
								]
								return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
									{
										offset: 0,
										color: colorList[params.dataIndex].c1
									},
									{
										offset: 1,
										color: colorList[params.dataIndex].c2
									}
								])
							}
						},
						labelLine: {
							show: true,
							length: 30,
							length2: 150,
							color: '#46d6ff',
							lineStyle: {
								type: 'dashed',
								width: 2
							}
						},

						data: information.dataArray
					}
				]
			}

			chartDom.setOption(option)
		})
	})
</script>
