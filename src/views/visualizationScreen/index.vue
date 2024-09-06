<template>
	<dv-full-screen-container class="bg">
		<dv-loading v-if="loading">Loading...</dv-loading>
		<div v-else class="dataV-demo">
			<div class="floating-button">
				<button @click="goBack" class="backButton">
					<el-icon size="26"><Back /></el-icon>
				</button>
			</div>

			<header>
				<div><dv-decoration8 style="width: 90%; height: 50px" /></div>
				<div class="header-center">
					<div class="title">无损检测数字化平台</div>
					<dv-decoration5 :dur="4" style="height: 40px; position: absolute; bottom: 6px" />
				</div>
				<div>
					<dv-decoration8 :reverse="true" style="width: 90%; height: 50px; float: right" />
				</div>
			</header>
			<main>
				<div class="main-top">
					<div class="mainTop">
						<div class="grid-box">
							<div class="statistic">核电厂业主</div>
							<dataDisplay :text="{ numText: '15' }" style="text-align: right"></dataDisplay>
						</div>
						<div class="grid-box">
							<div class="statistic">合作机组</div>
							<dataDisplay
								:text="{ numText: '56' }"
								:color="{ numColor: '#f88484' }"
								style="text-align: right"
							></dataDisplay>
						</div>
						<div class="grid-box">
							<div class="statistic">大修项目</div>
							<dataDisplay
								:text="{ numText: '382' }"
								:color="{ numColor: '#36b9ff' }"
								style="text-align: right"
							></dataDisplay>
						</div>
						<div class="grid-box">
							<div class="statistic">资质证书</div>
							<dataDisplay :text="{ numText: '256' }" style="text-align: right"></dataDisplay>
						</div>
						<div class="grid-box">
							<div class="statistic">在役设备</div>
							<dataDisplay
								:text="{ numText: '382' }"
								:color="{ numColor: '#32C5E9' }"
								style="text-align: right"
							></dataDisplay>
						</div>
						<div class="grid-box">
							<div class="statistic">仪器工具</div>
							<dataDisplay :text="{ numText: '643' }" style="text-align: right"></dataDisplay>
						</div>
						<div class="grid-box">
							<div class="statistic">检测文件</div>
							<dataDisplay
								:text="{ numText: '459', unitText: '个' }"
								:color="{ numColor: '#36b9ff' }"
								style="text-align: right"
							></dataDisplay>
						</div>
						<div class="grid-box">
							<div class="statistic">检查大纲</div>
							<dataDisplay
								:text="{ numText: '56' }"
								:color="{ numColor: '#f88484' }"
								style="text-align: right"
							></dataDisplay>
						</div>
						<div class="grid-box">
							<div class="statistic">年度项目</div>
							<dataDisplay :text="{ numText: '23' }" style="text-align: right"></dataDisplay>
						</div>
					</div>
					<dv-decoration-10 style="width: 100%; height: 5px" />
				</div>
				<div class="main-bottom">
					<dv-border-box8 :dur="5" backgroundColor="#0922595c" class="border-box">
						<div class="subtitle">核电厂项目汇总</div>
						<dv-scroll-ranking-board :config="config" style="height: calc(100% - 40px)" />
					</dv-border-box8>

					<div class="main-bottomRight">
						<div class="main-bottomRight-top" style="margin-bottom: 10px">
							<dv-border-box13 :dur="5" backgroundColor="#0922595c" class="border-box">
								<div class="subtitle">年度项目汇总</div>
								<dv-charts :option="option" class="dv_chart" />
							</dv-border-box13>
							<dv-border-box8 :dur="5" backgroundColor="#0922595c" class="border-box">
								<div class="subtitle">耗材使用统计</div>
								<dv-decoration1 :color="['#fff', '#9FE6B8']" style="width: 120px; height: 20px" />
								<dv-digital-flop :config="config2" style="margin-top: 20px" />
								<dv-water-level-pond :config="config3" style="height: 50%" />
								<!-- <dataDisplay
									:text="{ frontText: '安全天数', numText: '10086', unitText: '天' }"
									:color="{ frontColor: '#3DE7BF', unitColor: '#3DE7BF' }"
									:fontSize="{ frontSize: '22px', numSize: '36px', unitSize: '22px' }"
									style="margin-top: 50px"
								></dataDisplay> -->
							</dv-border-box8>
							<dv-border-box8 :dur="5" style="box-sizing: border-box; padding: 3px">
								<dv-scroll-board
									ref="scrollBoard"
									:config="config1"
									@mouseover="mouseoverHandler"
									@click="clickHandler"
								/>
							</dv-border-box8>
						</div>
						<div class="main-bottomRight-bottom">
							<dv-border-box12 class="border-box" backgroundColor="#0922595c">
								<div class="subtitle">设备资源</div>
								<dv-active-ring-chart :config="config4" style="width: 100%; height: 64%" />
								汇总情况
								<div>均无异常</div>
							</dv-border-box12>
							<dv-border-box12 class="border-box" backgroundColor="#0922595c">
								<div class="subtitle">文件管理</div>
								<dv-active-ring-chart :config="config4" style="width: 100%; height: 64%" />
								汇总情况
								<div>均无异常</div>
							</dv-border-box12>
							<dv-border-box12 class="border-box" backgroundColor="#0922595c">
								<div class="subtitle">进度管理</div>
								<dv-active-ring-chart :config="config4" style="width: 100%; height: 64%" />
								汇总情况
								<div>均无异常</div>
							</dv-border-box12>
							<dv-border-box12 class="border-box" backgroundColor="#0922595c">
								<div class="subtitle">健康监测</div>
								<dv-active-ring-chart :config="config4" style="width: 100%; height: 64%" />
								汇总情况
								<div>均无异常</div>
							</dv-border-box12>
							<dv-border-box12 class="border-box" backgroundColor="#0922595c">
								<div class="subtitle">故障预警</div>
								<dv-active-ring-chart :config="config4" style="width: 100%; height: 64%" />
								汇总情况
								<div>均无异常</div>
							</dv-border-box12>
						</div>
					</div>
				</div>
			</main>
		</div>
	</dv-full-screen-container>
</template>

<script setup>
	import dataDisplay from '@/components/dataDisplay.vue'

	if (document.documentElement.requestFullscreen) {
		// 请求全屏
		document.documentElement.requestFullscreen()
	}

	const router = useRouter()
	const goBack = () => {
		router.go(-1)
		if (document.exitFullscreen) {
			document.exitFullscreen()
		}
	}

	const loading = ref(true)

	onMounted(() => {
		setTimeout(() => {
			loading.value = false
		}, 1500)
	})

	// chart 配置
	const config = reactive({
		data: [
			{
				name: '红沿河核电厂',
				value: 13
			},
			{
				name: '国核示范核电厂',
				value: 4
			},
			{
				name: '海阳核电厂',
				value: 23
			},
			{
				name: '田湾核电站',
				value: 16
			},
			{
				name: '秦山核电厂',
				value: 25
			},
			{
				name: '宁德核电厂',
				value: 18
			},
			{
				name: '秦山第二核电厂',
				value: 45
			},
			{
				name: '台山核电厂',
				value: 17
			}
		],
		rowNum: 7,
		unit: ' 个'
		// waitTime: 100000,
	})
	const config1 = reactive({
		header: ['业主', '机组', '项目', '项目等级'],
		data: [
			['<span style="color:#37a2da;">红沿河核电厂</span>', '6号机组', '红沿河602次大修', 'B'],
			['田湾核电厂', '<span style="color:#32c5e9;">5号机组</span>', '田湾502次大修', 'A'],
			['海阳核电厂', '2号机组', '<span style="color:#67e0e3;">海阳201次大修</span>', 'A'],
			['海阳核电厂', '<span style="color:#9fe6b8;">1号机组</span>', '海阳102次大修', 'B'],
			['<span style="color:#ffdb5c;">海阳核电厂</span>', '2号机组', '海阳202次大修	', 'A'],
			['海阳核电厂', '<span style="color:#ff9f7f;">1号机组</span>', '海阳101次大修', 'A'],
			['国核示范核电厂', '4号机组', '<span style="color:#fb7293;">国核401次大修</span>', 'B'],
			['田湾核电厂', '<span style="color:#e062ae;">3号机组</span>', '田湾312次大修', 'C'],
			['<span style="color:#e690d1;">国核示范核电厂</span>', '5号机组', '国核533次大修', 'A'],
			['红沿河核电厂', '<span style="color:#e7bcf3;">6号机组</span>', '红沿河603次大修', 'B']
		],
		rowNum: 8,
		headerBGC: '#3E81F4',
		oddRowBGC: '#002b5c6b',
		evenRowBGC: '#13386c85',
		index: true,
		indexHeader: '',
		columnWidth: [50],
		align: ['center', 'center', 'center', 'center', 'center']
	})
	function formatter(number) {
		const numbers = number.toString().split('').reverse()
		const segs = []

		while (numbers.length) segs.push(numbers.splice(0, 3).join(''))

		return segs.join(',').split('').reverse().join('')
	}
	const config2 = reactive({
		number: [1635648],
		content: '{nt} 个',
		formatter
	})
	setInterval(() => {
		config2.number[0] += Math.random() * 20
	}, 5000)
	const config3 = reactive({
		data: [52],
		shape: 'round'
	})

	const config4 = reactive({
		lineWidth: 18,
		digitalFlopStyle: {
			fill: 'pink'
		},
		radius: '75%',
		activeRadius: '80%',
		data: [
			{
				name: '荣成',
				value: 98
			},
			{
				name: '烟台',
				value: 150
			},
			{
				name: '瓦房店',
				value: 62
			},
			{
				name: '嘉兴',
				value: 54
			}
		]
	})

	const option = reactive({
		grid: {
			top: 40,
			bottom: 40
		},
		// legend: {
		// 	data: ['降雨量', '气温'],
		// 	top: 20,
		// 	textStyle: {
		// 		fill: '#fff'
		// 	}
		// },
		xAxis: {
			data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
			axisLine: {
				style: {
					stroke: '#D4D4D4',
					lineWidth: 1
				}
			},
			axisLabel: {
				style: {
					fill: '#fff',
					fontSize: 12
				}
			},
			axisTick: {
				style: {
					stroke: '#D4D4D4',
					lineWidth: 1
				}
			}
		},
		yAxis: [
			{
				// name: '个',
				// nameTextStyle: {
				// 	fill: '#fff',
				// 	fontSize: 12
				// },
				data: 'value',
				min: 0,
				max: 200,
				interval: 50,
				axisLine: {
					show: false
				},
				splitLine: {
					style: {
						lineDash: [3, 3]
					}
				},
				axisLabel: {
					style: {
						fill: '#fff',
						fontSize: 12
					}
				},
				axisTick: {
					show: false
				}
			},
			{
				// name: '个',
				// nameTextStyle: {
				// 	fill: '#fff',
				// 	fontSize: 12
				// },
				data: 'value',
				position: 'right',
				min: 0,
				max: 200,
				interval: 50,
				axisLine: {
					show: false
				},
				splitLine: {
					style: {
						lineDash: [3, 3]
					}
				},
				axisLabel: {
					style: {
						fill: '#fff',
						fontSize: 12
					}
				},
				axisTick: {
					show: false
				}
			}
			// {
			// 	name: '个',
			// 	nameTextStyle: {
			// 		fill: '#fff',
			// 		fontSize: 12
			// 	},
			// 	data: 'value',
			// 	position: 'right',
			// 	min: 0,
			// 	max: 25,
			// 	interval: 5,
			// 	axisLine: {
			// 		show: false
			// 	},
			// 	splitLine: {
			// 		show: false
			// 	},
			// 	axisLabel: {
			// 		style: {
			// 			fill: '#fff'
			// 		}
			// 	},
			// 	axisTick: {
			// 		show: false
			// 	}
			// }
		],
		series: [
			// {
			// 	data: [8, 12, 38, 25, 90, 85, 150],
			// 	type: 'bar',
			// 	gradient: {
			// 		color: ['#37a2da', '#67e0e3']
			// 	}
			// },
			// {
			// 	data: [9, 20, 40, 27, 130, 65, 230],
			// 	type: 'bar',
			// 	gradient: {
			// 		color: ['#9FE6B8', '#95CB77']
			// 	}
			// },
			{
				data: [8, 16, 39, 26, 110, 75, 190],
				type: 'line',
				// yAxisIndex: 1,
				lineStyle: {
					lineWidth: 2,
					stroke: '#67E0E3'
				},
				smooth: true,

				lineArea: {
					show: true,
					gradient: ['#F4CA5F', 'rgba(55, 162, 218, 0.4)'],
					style: {
						opacity: 0.5
					}
				},
				label: {
					show: true,
					offset: [0, -15],
					style: {
						fontSize: 12,
						fill: '#F4CA5F'
					}
				}
			}
		]
	})
</script>

<style lang="less" scoped>
	// .floating-button {
	// 	position: fixed;
	// 	top: 0;
	// 	left: 0;
	// 	height: 100px;
	// 	width: 200px;
	// }

	// .backButton {
	// 	position: fixed;
	// 	top: -50px;
	// 	left: 100px;
	// 	border-radius: 50%;
	// 	height: 50px;
	// 	width: 50px;
	// 	border: none;
	// 	color: #fff;
	// 	background-color: #21252c78;
	// 	transition: 0.25s top;
	// }

	// .floating-button:hover .backButton {
	// 	cursor: pointer;
	// 	top: 45px;
	// }

	.backButton {
		position: fixed;
		top: 45px;
		left: 100px;
		border-radius: 50%;
		height: 50px;
		width: 50px;
		border: none;
		color: #fff;
		background-color: #21252c78;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.bg {
		color: white;
		background-image: url('@/assets/bg.png');
		background-size: cover;
		background-position: center center;
		// 解决适配问题
		height: 100% !important;
		width: 100% !important;
		transform: scale(1) !important;
	}
	.dataV-demo {
		padding: 10px;
		height: 100%;
		header {
			display: grid;
			grid-template-columns: 1fr 2fr 1fr;
			height: 80px;
			.header-center {
				text-align: center;
				position: relative;
				.title {
					font-weight: bold;
					font-size: 35px;
				}
			}
		}
		main {
			height: calc(100% - 100px);
		}
		.main-top {
			height: 15%;
			margin-bottom: 20px;
			background-color: #0922595c;
			.mainTop {
				height: 98%;
				display: grid;
				grid-template-columns: repeat(9, 1fr);

				.grid-box {
					position: relative;
					text-align: center;
					padding: 20px;
					.statistic {
						font-weight: bold;
						font-size: 20px;
						height: 60%;
					}
				}
				.grid-box:not(:last-child)::after {
					content: '';
					position: absolute;
					top: 10%;
					right: 0;
					height: 80%;
					width: 2px;
					background-color: #007092; /* 分割线的颜色 */
				}
			}
		}
		.main-bottom {
			height: calc(85% - 20px);
			display: grid;
			grid-template-columns: 1fr 4fr;
			gap: 10px;
			.subtitle {
				font-weight: bold;
				font-size: 18px;
				margin-bottom: 10px;
			}
			.border-box {
				padding: 15px 30px;
				box-sizing: border-box;
				height: 100%;
				overflow: hidden;
			}
			.main-bottomRight {
				.main-bottomRight-top {
					height: 60%;
					display: grid;
					grid-template-columns: 1.5fr 1fr 2.5fr;
					gap: 10px;
					.dv_chart {
						width: 100%;
						height: calc(100% - 40px);
					}
				}
				.main-bottomRight-bottom {
					height: calc(40% - 10px);
					display: grid;
					grid-template-columns: repeat(5, 1fr);
					gap: 10px;
				}
			}
		}
	}

	:deep(.dv-active-ring-chart .active-ring-info .active-ring-name) {
		height: auto;
	}

	:deep(.anticon svg) {
		height: 23px;
		width: 23px;
		margin-top: 5px;
	}
</style>
