<template>
	<div class="myLogicFlow">
		<el-card shadow="always" style="min-height: 64px">
			<el-page-header @back="router.go(-1)">
				<template #title>
					<SvgIcon name="back" size="24" />
				</template>
				<template #content>
					<div class="f-start" style="gap: 5px">
						<span class="name1">logicFlow</span>
						<SvgIcon name="flow2" size="22" />
						<span> - </span>
						<el-skeleton v-if="state.canvasLoading" animated class="f-center">
							<template #template>
								<el-skeleton-item variant="h1" />
							</template>
						</el-skeleton>
						<span v-else class="name2">xxcDemo</span>
						<!-- <span v-else class="name">{{ state.processInfo.processName }}</span> -->
					</div>
				</template>
			</el-page-header>
		</el-card>
		<div class="process-container">
			<left-right-collapse :isCollapsed="state.isCollapsed">
				<el-card class="cardLeft" shadow="always" :body-style="{ padding: 0, background: '#F7F8FA' }">
					<el-scrollbar>
						<!-- 左边栏 -->
						<div
							class="dndPanel"
							ref="dndPanelRef"
							v-loading="state.dndPanelLoading"
							element-loading-background="#F7F8FA"
						>
							<div class="f-start">
								<el-input
									class="myInput"
									ref="inputRef"
									placeholder="搜索名称"
									v-model="state.searchName"
									@focus="hideRetractBtn"
									@blur="showRetractBtn"
									@input="debouncedHandleInput"
									:suffix-icon="Search"
								></el-input>

								<el-tooltip content="隐藏组件" placement="top" :show-after="200" :hide-after="0">
									<button v-show="state.showRetractBtn" class="collapse-left-btn" @click="hideSide">
										<SvgIcon name="collapse-left" size="12" />
									</button>
								</el-tooltip>
							</div>
							<el-divider style="margin: 10px 0"></el-divider>
							<div class="modelDiv">
								<div class="f-start mb10 ml2">
									<div class="vertical-line"></div>
									<div class="title">矩形节点</div>
								</div>
								<el-empty v-if="state.algorithmModel.length == 0" :image-size="100"></el-empty>
								<div v-else class="algorithmNode x1" v-for="item in paginatedAlgorithm" :key="item.id">
									<SvgIcon name="cpu" size="20" color="blueviolet" />
									<span v-show="false">{{ item.id }}</span>
									<el-tooltip v-if="state.isOverflowing" :content="item.algorithmName" placement="right" :offset="30">
										<span class="text" @mouseenter="checkOverflow">{{ item.algorithmName }}</span>
									</el-tooltip>
									<span v-else class="text" @mouseenter="checkOverflow">{{ item.algorithmName }}</span>
								</div>
								<div class="pagination">
									<el-tooltip effect="light" placement="right">
										<template #content>
											<div style="color: #606266">
												<span style="color: blueviolet">算法模型</span>
												<el-divider style="margin: 5px 0"></el-divider>
												<span>每页 5 个，共 {{ state.algorithmTotal }} 个</span>
											</div>
										</template>
										<el-pagination
											layout="prev, pager, next"
											v-model:current-page="state.algorithmCurrentPage"
											:page-size="5"
											:pager-count="3"
											:total="state.algorithmTotal"
											small
										/>
									</el-tooltip>
								</div>
							</div>
							<el-divider class="mt1" />
							<div class="modelDiv mt20">
								<div class="f-start mb10 ml2">
									<div class="vertical-line" style="border-color: #ff9500"></div>
									<div class="title">vue自定义节点</div>
								</div>
								<el-empty v-if="state.processModel.length == 0" :image-size="100"></el-empty>
								<div v-else class="processNode x2" v-for="item in paginatedProcess" :key="item.id">
									<SvgIcon name="cpu" size="20" color="#ff9500" />
									<span v-show="false">{{ item.id }}</span>
									<el-tooltip v-if="state.isOverflowing" :content="item.processName" placement="right" :offset="30">
										<span class="text" @mouseenter="checkOverflow">{{ item.processName }}</span>
									</el-tooltip>
									<span v-else class="text" @mouseenter="checkOverflow">{{ item.processName }}</span>
								</div>
								<div class="pagination">
									<el-tooltip effect="light" placement="right">
										<template #content>
											<div style="color: #606266">
												<span style="color: #ff9500">过程模型</span>
												<el-divider style="margin: 5px 0"></el-divider>
												<span>每页 5 个，共 {{ state.processTotal }} 个</span>
											</div>
										</template>
										<el-pagination
											layout="prev, pager, next"
											v-model:current-page="state.processCurrentPage"
											:page-size="5"
											:pager-count="3"
											:total="state.processTotal"
											small
										/>
									</el-tooltip>
								</div>
							</div>
						</div>
					</el-scrollbar>
				</el-card>
			</left-right-collapse>
			<el-card class="cardRight" shadow="always" :body-style="{ padding: 0 }" v-loading="state.canvasLoading">
				<!-- 画布 -->
				<div class="h100" ref="LogicFlowContainer"></div>
				<TeleportContainer />
				<!-- 控制面板 -->
				<div class="controlPanel">
					<div class="canvasOption" @click="state.lf.extension.selectionSelect.openSelectionSelect()">
						<SvgIcon name="BoxSelection" :size="20" color="blueviolet" />
						<span>框选</span>
					</div>
					<div class="divider"></div>
					<div class="canvasOption" @click="state.lf.zoom(false)">
						<SvgIcon name="downscale" :size="20" color="blueviolet" />
						<span>缩小</span>
					</div>
					<div class="canvasOption" @click="state.lf.zoom(true)">
						<SvgIcon name="enlarge" :size="20" color="blueviolet" />
						<span>放大</span>
					</div>
					<div class="canvasOption" @click="state.lf.graphModel.fitView(20, 100)">
						<SvgIcon name="adapt" :size="20" color="blueviolet" />
						<span>适应</span>
					</div>
					<div class="canvasOption" @click="state.lf.undo()">
						<SvgIcon name="prev" :size="20" color="blueviolet" />
						<span>上一步</span>
					</div>
					<div class="canvasOption" @click="state.lf.redo()">
						<SvgIcon name="next" :size="20" color="blueviolet" />
						<span>下一步</span>
					</div>
					<div class="canvasOption" @click="state.lf.extension.miniMap.show(20, 10)">
						<SvgIcon name="telegram" :size="20" color="blueviolet" />
						<span>导航</span>
					</div>
					<div
						class="canvasOption"
						@click="
							state.lf.extension.dagre.layout({
								nodesep: 40,
								ranksep: 30
							})
						"
					>
						<SvgIcon name="beautify" :size="20" color="#ff7f00" />
						<span>一键美化</span>
					</div>
					<div class="divider"></div>
					<!-- <div class="canvasOption" @click="validateFlow">
						<SvgIcon name="validate" :size="20" color="#00bd29" />
						<span>校验</span>
					</div> -->
					<div class="canvasOption" @click="runFlowFake">
						<SvgIcon name="runFlow" :size="20" color="#426EC4" />
						<span>运行</span>
					</div>
					<div class="canvasOption" @click="saveFlow">
						<SvgIcon name="save" :size="20" color="#00bd29" />
						<span>保存</span>
					</div>
				</div>
				<!-- 下载面板 -->
				<div class="downloadPanel">
					<el-tooltip content="下载图片" placement="top">
						<div class="canvasOption" @click="state.lf.getSnapshot()">
							<SvgIcon name="img" color="#589CFD" :size="20" />
						</div>
					</el-tooltip>
					<el-tooltip content="下载xml" placement="top">
						<div class="canvasOption" @click="downloadXml">
							<SvgIcon name="xml" color="#FF6B08" :size="20" />
						</div>
					</el-tooltip>
					<el-tooltip content="下载json" placement="top">
						<div class="canvasOption" @click="downloadJson">
							<SvgIcon name="json" color="#8C62B4" :size="20" />
						</div>
					</el-tooltip>
				</div>

				<el-tooltip content="显示组件" placement="right" :show-after="400" :hide-after="0">
					<transition name="slide-fade">
						<button v-show="state.isCollapsed && state.showExpandBtn" class="collapse-right-btn" @click="showSide">
							<SvgIcon name="collapse-right1" size="14" />
						</button>
					</transition>
				</el-tooltip>
			</el-card>
		</div>

		<el-dialog v-model="state.keyboardDialog" title="键盘快捷键" width="700" draggable>
			<el-table :data="state.keyboardTableData" class="mb10">
				<el-table-column prop="shortcuts" label="快捷键" align="center" />
				<el-table-column prop="func" label="功能" align="center" />
			</el-table>
			<el-text tag="mark">备注：需将光标聚焦到画布上快捷键功能才能生效</el-text>
		</el-dialog>

		<el-dialog
			v-model="state.runResultDialog"
			title="错误信息"
			width="700"
			draggable
			class="hideScrollbar animate__animated animate__fadeIn"
		>
			<!-- <template #header>
				<span style="color: red"> 执行中断 </span>
			</template> -->
			<div class="runResultDiv">
				<div class="resultTitle">{{ state.resultConsole }}</div>
				<el-divider class="mt15 mb15"></el-divider>
				<div class="resultContent animate__animated animate__fadeInUp">{{ state.resultInfo }}</div>
			</div>
		</el-dialog>
	</div>
</template>
<script setup>
	import LogicFlow from '@logicflow/core'
	import { Menu, SelectionSelect, MiniMap, lfJson2Xml, Snapshot } from '@logicflow/extension'
	import '@logicflow/core/lib/style/index.css'
	import '@logicflow/extension/lib/style/index.css'
	import algorithmNode from './node/algorithmNode'
	import processNode from './node/algorithmNode'
	import niceEdge from './edge/niceEdge'
	import Dagre from './tools/dagre.ts'
	// =====================================================================================
	import { ElMessage } from 'element-plus'
	import { Search } from '@element-plus/icons-vue'
	import LeftRightCollapse from '@/components/leftRightCollapse.vue'
	import { debounce } from '@/utils/debounce'

	import { register, getTeleport } from '@logicflow/vue-node-registry'
	import vueNode from './node/vueNode.vue'
	// import overwriteBezier from './edge/overwriteBezier';

	import { processModelDetail, algorithmRes, processRes } from './mock/demo1'

	const router = useRouter()
	const route = useRoute()
	const dndPanelRef = ref()
	const LogicFlowContainer = ref()
	const TeleportContainer = getTeleport()
	const inputRef = ref()
	const state = reactive({
		processId: 0,
		processInfo: {},
		lf: null,
		// 左侧模板数据
		isOverflowing: false,
		isCollapsed: false,
		showRetractBtn: true,
		showExpandBtn: false,
		searchName: '',
		dndPanelLoading: true,
		algorithmModel: [],
		algorithmTotal: 0,
		algorithmCurrentPage: 1,
		processModel: [],
		processTotal: 0,
		processCurrentPage: 1,
		// 画布数据
		canvasLoading: true,
		graphData: {},
		keyboardDialog: false,
		keyboardTableData: [
			{ shortcuts: 'cmd + c 或 ctrl + c', func: '复制节点' },
			{ shortcuts: 'cmd + v 或 ctrl + v', func: '粘贴节点' },
			{ shortcuts: 'cmd + z 或 ctrl + z', func: '撤销操作' },
			{ shortcuts: 'cmd + y 或 ctrl + y', func: '回退操作' },
			{ shortcuts: 'backspace', func: '删除操作' }
		],
		// 运行
		runResultDialog: false,
		resultConsole: null,
		resultInfo: null,
		// 插件配置
		miniMapOptions: {
			isShowCloseIcon: true,
			width: 210,
			height: 110
		}
	})

	const paginatedAlgorithm = computed(() => {
		const start = (state.algorithmCurrentPage - 1) * 5
		const end = start + 5
		return state.algorithmModel.slice(start, end)
	})

	const paginatedProcess = computed(() => {
		const start = (state.processCurrentPage - 1) * 5
		const end = start + 5
		return state.processModel.slice(start, end)
	})

	onMounted(async () => {
		state.lf = new LogicFlow({
			container: LogicFlowContainer.value,
			background: {
				backgroundImage: 'url(/assets/grid.svg)',
				backgroundRepeat: 'repeat'
			},
			edgeType: 'niceEdge',
			edgeTextEdit: false,
			plugins: [Menu, SelectionSelect, MiniMap, Dagre, Snapshot],
			pluginsOptions: {
				miniMap: state.miniMapOptions
			},
			keyboard: {
				enabled: true
			}
		})

		// 设置logicFlow主题
		state.lf.setTheme({
			arrow: {
				offset: 4,
				verticalLength: 2
			},
			bezier: {
				fill: 'none',
				stroke: '#636e72',
				strokeWidth: 1.5
			},
			outline: {
				strokeDasharray: '0 0'
			},
			anchor: {
				stroke: 'rgb(24, 125, 255)',
				fill: '#FFFFFF',
				r: 3,
				hover: {
					fill: 'rgb(24, 125, 255)',
					fillOpacity: 0.5,
					stroke: 'rgb(24, 125, 255)',
					r: 8
				}
			},
			anchorLine: {
				stroke: 'rgb(24, 125, 255)',
				strokeWidth: 2,
				strokeDasharray: '8,3'
			},
			nodeText: {
				overflowMode: 'ellipsis',
				padding: '0 20px 0 50px',
				textAlign: 'start'
			},
			edgeText: {
				textWidth: 100,
				overflowMode: 'default',
				fontSize: 20,
				color: 'red',
				background: {
					fill: '#fff'
				}
			}
		})

		// 设置logicFlow菜单
		state.lf.extension.menu.addMenuConfig({
			nodeMenu: [
				{
					text: '属性',
					callback(node) {
						alert(`
          节点id：${node.id}
          节点类型：${node.type}
          节点坐标：(x: ${node.x}, y: ${node.y})`)
					}
				},
				{
					text: '修改输入',
					callback(node) {
						openInOrOutDialog(node, 'Input')
					}
				},
				{
					text: '查看输出',
					callback(node) {
						openInOrOutDialog(node, 'Output')
					}
				}
			],
			graphMenu: [
				{
					text: '键盘快捷键',
					callback() {
						state.keyboardDialog = true
					}
				},
				{
					text: '清空画布',
					callback() {
						state.lf.graphModel.clearData()
					}
				}
			]
		})

		state.lf.extension.menu.setMenuConfig({
			edgeMenu: [
				{
					text: '删除',
					callback(edge) {
						state.lf.deleteEdge(edge.id)
					}
				},
				{
					text: '属性',
					callback(edge) {
						alert(`
          边id：${edge.id}
          边类型：${edge.type}
          边坐标：(x: ${edge.x}, y: ${edge.y})
          源节点id：${edge.sourceNodeId}
          目标节点id：${edge.targetNodeId}`)
					}
				}
			]
		})

		// 注册节点
		const toRegister = [algorithmNode, processNode, niceEdge]
		toRegister.forEach((item) => state.lf.register(item))

		register(
			{
				type: 'vue-node',
				component: vueNode
			},
			state.lf
		)

		// 获取后端数据
		await init()

		// 渲染数据
		state.lf.render(state.graphData)

		// 监听框选事件
		state.lf.on('selection:selected', (data) => {
			state.lf.extension.selectionSelect.closeSelectionSelect()
		})

		// 默认开启小地图
		state.lf.extension.miniMap.show(20, 10)

		// 重写下载图片样式
		state.lf.extension.snapshot.customCssRules = `
.lf-canvas-overlay {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA2CAIAAADoEEaJAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAACBSURBVGiB7dWxDcAgDAVRJ6JC1Oy/nhegzgQhxSnCxb0WkK7iX5kZhbWImHO+Ha+1eu+b939fuDcvK7CPsY+xj6ned2XmGON0xqsWEZvv2/34YB9jH2MfYx/jvrlvJ9nH2MfYx1Tvc9/ct5PsY+xj7GOq97lv7ttJ9jH2MfYx1fseLtlLY98Bn/oAAAAASUVORK5CYII=');
}
`

		// 左侧拖拽模板
		dndPanelRef.value.addEventListener('mousedown', async (e) => {
			// 使用closest查找最近的具有指定类名的祖先元素
			const node = e.target.closest('.x1, .x2')

			const bizId = node?.querySelector('span:nth-child(2)').textContent

			// 拖拽时初始化输入（业务相关）
			// const res = await getAPI(AlgorithmParameterApi).apiAlgorithmParameterPagePost({
			// 	algorithmId: bizId,
			// 	inOrOut: 'in'
			// })
			// const parameters = res.data.result.items
			// let input = null

			// if (parameters.length > 0) {
			// 	// 输出所有参数key
			// 	input = parameters.reduce((acc, item) => {
			// 		const parameterName = item.parameterInfo.parameterName
			// 		acc[parameterName] = ''
			// 		return acc
			// 	}, {})
			// }

			if (node?.classList.contains('x1')) {
				state.lf.dnd.startDrag({
					type: 'algorithmNode',
					text: node.innerText
					// properties: { bizId, input, previousAllResult: {} }
				})
			} else if (node?.classList.contains('x2')) {
				state.lf.dnd.startDrag({
					type: 'vue-node',
					// text: node.innerText,
					properties: { bizId, title: node.innerText, width: 300, height: 150 }
				})
			} else console.log('没有选中node节点')
		})
	})

	// 模拟业务请求api
	const mockApiCall = (ms) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({ data: 'Sample data from API' })
			}, ms)
		})
	}

	const init = async () => {
		state.processId = route.query.id
		getDndPanelData()
		try {
			// const res = await getAPI(ProcessModelApi).apiProcessModelDetailGet(state.processId)
			await mockApiCall(1500)
			const res = processModelDetail
			state.canvasLoading = false
			state.processInfo = res
			state.graphData = res.flowJson
		} catch (error) {
			console.error('An error occurred:', error)
		} finally {
			state.canvasLoading = false
		}
	}

	const getDndPanelData = async () => {
		state.dndPanelLoading = true
		try {
			// 获取业务数据
			// const responses = await Promise.all([
			// 	getAPI(AlgorithmModelApi).apiAlgorithmModelPagePost({ algorithmName: state.searchName, pageSize: 999 }),
			// 	getAPI(ProcessModelApi).apiProcessModelPagePost({ processName: state.searchName, pageSize: 999 })
			// ])
			// const [algorithmRes, processRes] = responses

			await mockApiCall(1000)
			state.algorithmModel = algorithmRes.items
			state.algorithmTotal = algorithmRes.total

			state.processModel = processRes.items
			state.processTotal = processRes.total
		} catch (error) {
			console.error('An error occurred:', error)
		} finally {
			state.dndPanelLoading = false
		}
	}

	const debouncedHandleInput = debounce(getDndPanelData, 400)

	const updateStatus = (obj) => {
		return {
			...obj,
			properties: {
				...obj.properties,
				status: ' '
			}
		}
	}

	// 保存数据
	const saveFlow = () => {
		console.log('画布数据', state.lf.getGraphData())
		ElMessage.success('保存成功')

		// 保存带有状态的数据
		// state.canvasLoading = true;
		// getAPI(ProcessModelApi)
		// 	.apiProcessModelUpdatePost({ id: state.processId, flowJson: JSON.stringify(state.lf.getGraphData()) })
		// 	.then(res => {
		// 		ElMessage.success('保存成功');
		// 		state.canvasLoading = false;
		// 	});

		// 保存不带状态的数据
		// const graphData = state.lf.getGraphData()
		// const newNodes = graphData.nodes.map(updateStatus)
		// const newEdges = graphData.edges.map(updateStatus)
		// const newGraphData = {
		// 	nodes: newNodes,
		// 	edges: newEdges
		// }

		// getAPI(ProcessModelApi)
		// 	.apiProcessModelUpdatePost({ id: state.processId, flowJson: JSON.stringify(newGraphData) })
		// 	.then((res) => {
		// 		ElMessage.success('保存成功')
		// 	})
	}

	// 校验流程
	// const validateFlow = () => {
	// 	ElMessage({
	// 		message: '校验成功，请开始执行流程',
	// 		type: 'success',
	// 		plain: true,
	// 	});
	// 	getAPI(FlowApi)
	// 		.apiFlowVerificationParametersPost({ flowId: state.processId, flowJson: JSON.stringify(state.lf.getGraphData()) })
	// 		.then(res => {
	// 			console.log(res);
	// 		});
	// };

	// 开始执行流程
	const runFlow = async () => {
		ElMessage({
			message: '流程开始执行'
		})

		const graphModel = state.lf.graphModel
		const nodes = state.lf.getGraphData().nodes
		const edges = state.lf.getGraphData().edges

		// 初始化节点和边状态
		nodes.forEach((node) => {
			state.lf.setProperties(node.id, {
				status: ''
			})
		})
		edges.forEach((edge) => {
			state.lf.setProperties(edge.id, {
				status: ''
			})
		})

		// 找到起始节点
		let executingNode = nodes.find((node) => graphModel.getNodeIncomingNode(node.id).length == 0)
		let executingEdge = { id: null }
		state.lf.setProperties(executingNode.id, {
			status: 'running'
		})

		// 流程执行
		for (let i = 0; i < nodes.length; i++) {
			executingNode = state.lf.getNodeDataById(executingNode.id)
			if (i == 0) {
				// 清空第一个节点的result
				executingNode.properties.previousAllResult = {}
			}
			console.log('executingNode', executingNode)
			try {
				const res = await getAPI(FlowApi).apiFlowRunPost({
					flowId: state.processId,
					nodeString: JSON.stringify(executingNode)
				})
				// console.log('res', res);
				if (res.duration < 1000) {
					await delay(1000)
				}
				const output = res.data.result
				if (output.error) {
					// 中断
					state.lf.setProperties(executingNode.id, {
						status: 'fail'
					})
					state.lf.setProperties(executingEdge.id, {
						status: 'fail'
					})
					ElMessage.error('算法运行错误，流程执行中断')
					state.resultConsole = output.console
					state.resultInfo = output.error
					state.runResultDialog = true
					break
				} else {
					// 将executingNode的output赋值
					state.lf.setProperties(executingNode.id, {
						output: JSON.parse(output.result)
					})
					state.lf.setProperties(executingNode.id, {
						status: 'success'
					})
					state.lf.setProperties(executingEdge.id, {
						status: 'success'
					})
					// 拿到当前节点的previousAllResult
					let previousAllResult = executingNode.properties.previousAllResult

					// 获取下一个节点与边(注意先获取边)
					executingEdge = graphModel.getNodeOutgoingEdge(executingNode.id)[0]

					if (executingEdge) {
						// 如果还有下一个节点
						const nextNodeId = graphModel.getNodeOutgoingNode(executingNode.id)[0].id
						executingNode = state.lf.getNodeDataById(nextNodeId)

						state.lf.setProperties(executingNode.id, {
							status: 'running'
						})
						state.lf.setProperties(executingEdge.id, {
							status: 'running'
						})
						// 组合previousAllResult
						state.lf.setProperties(executingNode.id, {
							previousAllResult: { ...previousAllResult, ...JSON.parse(output.result) }
						})
					} else {
						ElMessage({
							message:
								'我们校验了每个模型的出参参数组和下一个模型的入参参数组，全部符合要求！如果需要详情确认，请自行查看参数的数据并进行比对',
							type: 'success',
							plain: true,
							showClose: true,
							duration: 0,
							// offset: 150,
							center: true
						})
					}
				}
			} catch (error) {
				state.lf.setProperties(executingNode.id, {
					status: 'fail'
				})
				state.lf.setProperties(executingEdge.id, {
					status: 'fail'
				})
				break
			}
		}
	}

	const delay = (ms) => {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	const mockApiCallRandom = (ms) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const isSuccess = Math.random() > 0.4 // 随机决定成功或失败
				if (isSuccess) {
					resolve({ data: 'Sample data from API' })
				} else {
					// reject(new Error('Failed to fetch data from API'))
					resolve({ error: 'Failed to fetch data from API' })
				}
			}, ms)
		})
	}

	const runFlowFake = async () => {
		ElMessage({
			message: 'Flow execution begins...'
		})

		const graphModel = state.lf.graphModel
		const nodes = state.lf.getGraphData().nodes
		const edges = state.lf.getGraphData().edges

		// 初始化节点和边状态
		nodes.forEach((node) => {
			state.lf.setProperties(node.id, {
				status: ''
			})
		})
		edges.forEach((edge) => {
			state.lf.setProperties(edge.id, {
				status: ''
			})
		})

		// 找到起始节点
		let executingNode = nodes.find((node) => graphModel.getNodeIncomingNode(node.id).length == 0)
		let executingEdge = { id: null }
		state.lf.setProperties(executingNode.id, {
			status: 'running'
		})

		// 流程执行
		for (let i = 0; i < nodes.length; i++) {
			executingNode = state.lf.getNodeDataById(executingNode.id)
			console.log('executingNode', executingNode)
			try {
				const res = await mockApiCallRandom(2000)
				if (res.error) {
					// 中断
					state.lf.setProperties(executingNode.id, {
						status: 'fail'
					})
					state.lf.setProperties(executingEdge.id, {
						status: 'fail'
					})
					ElMessage.error('Flow execution interrupted, please check where the problem occurred')
					state.resultConsole = 'Persist and never give up'
					state.resultInfo = `Life is a journey filled with ups and downs, challenges and triumphs. At times, the path may seem daunting, and the obstacles insurmountable. Yet, it is crucial to remember the importance of perseverance and the will to keep moving forward. Living is not merely about existing; it is about thriving despite the adversities we face.

Every individual encounters moments of doubt and despair, where giving up seems like the easiest option. However, it is during these times that the true strength of character is revealed. Perseverance is the key to unlocking potential and achieving dreams. It is the unwavering determination to push through hardships and emerge stronger on the other side.`
					setTimeout(() => {
						state.runResultDialog = true
					}, 1000)

					break
				} else {
					state.lf.setProperties(executingNode.id, {
						status: 'success'
					})
					state.lf.setProperties(executingEdge.id, {
						status: 'success'
					})
					// 获取下一个节点与边(注意先获取边)
					executingEdge = graphModel.getNodeOutgoingEdge(executingNode.id)[0]

					if (executingEdge) {
						// 如果还有下一个节点
						const nextNodeId = graphModel.getNodeOutgoingNode(executingNode.id)[0].id
						executingNode = state.lf.getNodeDataById(nextNodeId)

						state.lf.setProperties(executingNode.id, {
							status: 'running'
						})
						state.lf.setProperties(executingEdge.id, {
							status: 'running'
						})
					} else {
						ElMessage({
							message: 'Congratulations, the flow was executed successfully and the data is being generated',
							type: 'success',
							plain: true,
							showClose: true,
							duration: 5000,
							// offset: 150,
							center: true
						})
					}
				}
			} catch (error) {
				state.lf.setProperties(executingNode.id, {
					status: 'fail'
				})
				state.lf.setProperties(executingEdge.id, {
					status: 'fail'
				})
				break
			}
		}
	}

	/**
	 * 下载文件
	 * @param {string} filename - 文件名
	 * @param {string|object} content - 文件内容，字符串或对象
	 * @param {boolean} [isJson=false] - 如果为 true，content 将被 JSON 格式化
	 */
	const download = (filename, content, isJson = false) => {
		const element = document.createElement('a')
		const text = isJson ? JSON.stringify(content, null, 2) : content
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
		element.setAttribute('download', filename)
		element.style.display = 'none'
		document.body.appendChild(element)
		element.click()
		document.body.removeChild(element)
	}

	const downloadXml = () => {
		const data = state.lf.getGraphData()
		console.log(data)
		download('logicflow.xml', lfJson2Xml(data))
	}

	const downloadJson = () => {
		const data = state.lf.getGraphData()
		download('logicflow.txt', data, true)
	}

	// 一些配合过度的函数
	const hideSide = () => {
		state.isCollapsed = true
		setTimeout(() => {
			state.showExpandBtn = true
		}, 600)
	}

	const showSide = () => {
		state.isCollapsed = false
		state.showExpandBtn = false
	}

	const hideRetractBtn = () => {
		state.showRetractBtn = false
		inputRef.value.$el.style.width = '188px'
	}

	const showRetractBtn = () => {
		inputRef.value.$el.style.width = '154px'
		setTimeout(() => {
			state.showRetractBtn = true
		}, 300)
	}

	const checkOverflow = (e) => {
		state.isOverflowing = e.target.scrollWidth > e.target.clientWidth
	}
</script>
<style scoped lang="scss">
	.myLogicFlow {
		height: 100%;
		padding: 15px;
		display: flex;
		flex-direction: column;
		overflow: hidden;

		.name1 {
			font-weight: bold;
			color: #80b8f8;
			margin-right: 5px;
			font-size: 24px;
		}

		.name2 {
			background: antiquewhite;
			padding: 1px 11px;
			border-radius: 10px;
		}
		.process-container {
			margin-top: 10px;
			// overflow: hidden;
			flex: 1;
			display: flex;
			.cardLeft {
				width: 220px;
				margin-right: 10px;
				height: 100%;
				.dndPanel {
					height: 100%;
					background-color: #f7f8fa;
					width: 100%;
					padding: 15px;
					user-select: none;
					// box-shadow: 5px 0 10px rgba(0, 0, 0, 0.1);
					.myInput {
						width: 154px;
						transition: all 0.3s ease;
					}

					.collapse-left-btn {
						border: none;
						margin-left: 6px;
						background-color: transparent;
						padding: 6px 8px;
						border-radius: 6px;
						color: #acacac;
						&:hover {
							background-color: #edeeee;
							cursor: pointer;
							color: #71777f;
						}
					}
					.modelDiv {
						height: 305px;
						position: relative;

						.vertical-line {
							height: 14px;
							border-right: 3px solid blueviolet;
							margin-right: 10px;
						}

						.title {
							color: #333333;
							font-size: 14px;
						}

						.node {
							user-select: none;
							height: 35px;
							width: 100%;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							gap: 15px;
							padding: 10px 15px 10px 10px;
							background-color: #fff;
							border-radius: 4px;
							margin-bottom: 12px;
							box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
							transition: box-shadow ease 0.5s;
							cursor: grab;
							.text {
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								flex: 1;
								color: #606266;
							}
						}

						.algorithmNode {
							@extend .node;
							&:hover {
								box-shadow: 0px 0px 8px 4px rgba(167, 44, 238, 0.3);
							}
						}

						.processNode {
							@extend .node;
							&:hover {
								box-shadow: 0px 0px 8px 4px rgba(255, 145, 0, 0.4);
							}
						}

						.pagination {
							position: absolute;
							right: 0;
							bottom: 20px;
						}
					}
				}
			}
			.cardRight {
				flex: 1;
				position: relative;
				border-top: none;
				border-left: none;
				.canvasPanel {
					user-select: none;
					position: absolute;
					padding: 0 15px;
					border: 1px solid rgb(233, 233, 233);
					border-radius: 6px;
					box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.2);
					background-color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					.canvasOption {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						gap: 5px;
						font-size: 12px;
						padding: 5px 10px;
						transition: background-color ease 0.3s;
						&:hover {
							background-color: #efefef;
							cursor: pointer;
						}
					}
				}

				.controlPanel {
					@extend .canvasPanel;
					top: 10px;
					right: 22%;
					.divider {
						height: 25px;
						border-right: 1px solid rgb(163, 163, 163);
						margin: 0 10px;
					}
				}

				.downloadPanel {
					@extend .canvasPanel;
					padding: 0 5px;
					bottom: 15px;
					left: 20px;
				}
			}
		}
	}

	.collapse-right-btn {
		position: absolute;
		left: -10px;
		top: 240px;
		width: 40px;
		height: 35px;
		padding: 10px 15px;
		border: none;
		color: #acacac;
		background-color: #fff;
		box-shadow: 1px 3px 6px -4px rgba(0, 0, 0, 0.5);
		border-radius: 0 30px 30px 0;
		border: 1px solid #dee0e3;
		transition: left 0.3s ease;
		&:hover {
			cursor: pointer;
			color: #71777f;
			left: -1px;
		}
	}

	.slide-fade-enter-active,
	.slide-fade-leave-active {
		transition: all 0.3s ease;
	}

	.slide-fade-enter-from,
	.slide-fade-leave-to {
		transform: translateX(-100%);
		opacity: 0;
	}

	:deep(.el-pager li),
	:deep(.el-pagination .btn-prev),
	:deep(.el-pagination > .is-last) {
		background: transparent;
	}

	:deep(.el-page-header__icon) {
		display: none;
	}
	:deep(.el-page-header__title) {
		display: flex;
		align-items: center;
	}
	:deep(.el-page-header__content) {
		display: -webkit-inline-box;
	}

	.runResultDiv {
		// background: rgba(249, 255, 182, 1);
		// background-image: linear-gradient(184.1deg, rgba(249, 255, 182, 1) 44.7%, rgba(226, 255, 172, 1) 67.2%);
		background-image: radial-gradient(
			circle farthest-corner at 10% 20%,
			rgba(255, 246, 236, 1) 39.5%,
			rgba(100, 46, 122, 0.23) 100.2%
		);
		padding: 20px 30px;
		border-radius: 6px;
		.resultTitle {
			font-size: 26px;
			color: #333333;
		}
		.resultContent {
			font-size: 16px;
			line-height: 22px;
			color: #ed3b3b;
		}
	}
</style>

<style>
	.hideScrollbar .el-dialog__body {
		overflow: hidden;
	}

	.animate__animated.animate__fadeIn {
		--animate-duration: 1s;
	}
	.animate__animated.animate__fadeInUp {
		--animate-duration: 3s;
	}

	/* logicFlow ui优化 */
	.lf-mini-map {
		border-radius: 4px;
		/* box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.2); */
	}

	.lf-menu {
		width: 150px;
		padding: 4px 2px;
		border-radius: 4px;
	}

	.lf-menu > li {
		font-size: 14px;
		padding: 5px 12px;
	}
</style>
