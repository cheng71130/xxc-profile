<template>
	<div class="cad-container">
		<!-- 导入按钮 -->
		<div class="import-section" v-if="!pageLoaded">
			<el-card class="import-card">
				<h2 class="text-xl font-bold mb-4">导入CAD页面配置</h2>
				<el-upload class="upload-demo" :before-upload="handleFileUpload" :show-file-list="false" accept=".txt" drag>
					<el-icon class="el-icon--upload"><UploadFilled /></el-icon>
					<div class="el-upload__text">将txt配置文件拖到此处，或<em>点击上传</em></div>
					<template #tip>
						<div class="el-upload__tip">只支持 .txt 格式的配置文件</div>
					</template>
				</el-upload>
			</el-card>
		</div>

		<!-- CAD主界面 -->
		<div v-else class="cad-main">
			<!-- 顶部菜单栏 -->
			<div class="top-header">
				<div class="menu-bar flex items-center">
					<div class="logo px-2">
						<span class="text-blue-500 font-bold">{{ config.appName }}</span>
					</div>
					<el-menu mode="horizontal" class="flex-1" :default-active="activeMenu">
						<el-menu-item v-for="(item, index) in config.menuItems" :key="index" :index="String(index + 1)">
							{{ item }}
						</el-menu-item>
					</el-menu>
					<div class="user-info flex items-center px-4">
						<el-button type="primary" size="small">登录</el-button>
					</div>
				</div>

				<!-- 工具栏 -->
				<div class="toolbar flex items-center px-2 py-1 border-b">
					<div class="tool-groups flex items-center gap-4">
						<template v-for="(group, gIndex) in config.toolGroups" :key="gIndex">
							<div class="tool-group flex items-center gap-1">
								<el-button
									v-for="tool in group"
									:key="tool.name"
									:icon="getIcon(tool.icon)"
									size="small"
									:title="tool.name"
								/>
							</div>
							<el-divider v-if="gIndex < config.toolGroups.length - 1" direction="vertical" />
						</template>
					</div>
				</div>
			</div>

			<!-- 主体内容区 -->
			<div class="main-content flex">
				<!-- 左侧边栏 -->
				<div class="left-sidebar">
					<el-tabs v-model="activeTab" class="h-full">
						<el-tab-pane v-for="tab in config.sidebarTabs" :key="tab.key" :label="tab.label" :name="tab.key">
							<div v-if="tab.key === 'parts'" class="tree-container p-2">
								<el-tree :data="treeData" :props="defaultProps" default-expand-all>
									<template #default="{ node, data }">
										<span class="custom-tree-node">
											<el-icon v-if="data.type === 'folder'"><FolderOpened /></el-icon>
											<el-icon v-else-if="data.type === 'part'"><Document /></el-icon>
											<span class="ml-1">{{ node.label }}</span>
										</span>
									</template>
								</el-tree>
							</div>
							<div v-else class="p-2">{{ tab.label }}内容</div>
						</el-tab-pane>
					</el-tabs>
				</div>

				<!-- 中间CAD视图区 -->
				<div class="cad-viewport flex-1" :style="{ background: '#e8e8e8' }">
					<div class="viewport-container">
						<!-- 3D视图区域 -->
						<div class="viewport-3d">
							<div class="cad-object">
								<div
									class="panel-3d"
									:style="{
										width: config.view3d.width + 'px',
										height: config.view3d.height + 'px',
										background: config.view3d.color,
										transform: `rotateY(${config.view3d.rotateY}deg) rotateX(${config.view3d.rotateX}deg)`
									}"
								></div>
							</div>
						</div>

						<!-- 右侧工具栏 -->
						<div class="right-toolbar">
							<el-button
								v-for="tool in config.rightTools"
								:key="tool.name"
								:icon="getIcon(tool.icon)"
								circle
								size="small"
								:title="tool.name"
							/>
						</div>

						<!-- 坐标轴指示器 -->
						<div class="axis-indicator" v-if="config.showAxis">
							<div class="axis-cube">
								<div class="axis x-axis" :style="{ background: config.axisColors.x }">X</div>
								<div class="axis y-axis" :style="{ background: config.axisColors.y }">Y</div>
								<div class="axis z-axis" :style="{ background: config.axisColors.z }">Z</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 底部状态栏 -->
			<div class="status-bar flex items-center justify-between px-4 py-1">
				<div class="status-left flex items-center gap-4">
					<span v-for="status in config.statusLeft" :key="status" class="text-xs">{{ status }}</span>
				</div>
				<div class="status-right">
					<span class="text-xs">{{ config.statusRight }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, shallowRef } from 'vue'
	import {
		DocumentCopy,
		FolderOpened,
		Download,
		Back,
		Right,
		ZoomIn,
		ZoomOut,
		FullScreen,
		View,
		Refresh,
		Camera,
		Setting,
		Document,
		UploadFilled
	} from '@element-plus/icons-vue'
	import { ElMessage } from 'element-plus'

	const pageLoaded = ref(false)
	const activeMenu = ref('1')
	const activeTab = ref('parts')
	const treeData = ref([])

	const config = ref({
		appName: 'CrownCAD',
		version: 'insofworks2025',
		themeColor: '#409EFF',
		menuItems: [],
		toolGroups: [],
		sidebarTabs: [],
		view3d: {
			width: 400,
			height: 500,
			color: '#808080',
			rotateY: -20,
			rotateX: 10,
			showGrid: true
		},
		rightTools: [],
		showAxis: true,
		axisColors: {
			x: '#ff4444',
			y: '#44ff44',
			z: '#4444ff'
		},
		statusLeft: [],
		statusRight: ''
	})

	const defaultProps = {
		children: 'children',
		label: 'label'
	}

	// 图标映射
	const iconMap = {
		DocumentCopy: DocumentCopy,
		FolderOpened: FolderOpened,
		Download: Download,
		Back: Back,
		Right: Right,
		ZoomIn: ZoomIn,
		ZoomOut: ZoomOut,
		FullScreen: FullScreen,
		View: View,
		Refresh: Refresh,
		Camera: Camera,
		Setting: Setting,
		Document: Document
	}

	const getIcon = (iconName) => {
		return iconMap[iconName] || Document
	}

	// 解析配置文件
	const parseConfig = (content) => {
		const lines = content.split('\n')
		const result = {
			menuItems: [],
			toolGroups: [],
			sidebarTabs: [],
			view3d: {},
			rightTools: [],
			axisColors: {},
			statusLeft: [],
			treeStructure: []
		}

		let currentSection = ''

		lines.forEach((line) => {
			line = line.trim()
			if (!line || line.startsWith('#')) return

			if (line.startsWith('[') && line.endsWith(']')) {
				currentSection = line.slice(1, -1)
				return
			}

			if (line.includes('=')) {
				const [key, value] = line.split('=').map((s) => s.trim())

				switch (currentSection) {
					case '基本信息':
						if (key === '应用名称') result.appName = value
						if (key === '版本') result.version = value
						if (key === '主题色') result.themeColor = value
						break

					case '菜单配置':
						if (key === '菜单项') result.menuItems = value.split(',')
						break

					case '工具栏':
						if (key.startsWith('工具组')) {
							const tools = value.split(',').map((t) => {
								const [name, icon] = t.split('|')
								return { name, icon }
							})
							result.toolGroups.push(tools)
						}
						break

					case '侧边栏标签':
						if (key.startsWith('标签')) {
							const [label, key] = value.split('|')
							result.sidebarTabs.push({ label, key })
						}
						break

					case '3D视图配置':
						if (key === '面板宽度') result.view3d.width = parseInt(value)
						if (key === '面板高度') result.view3d.height = parseInt(value)
						if (key === '面板颜色') result.view3d.color = value
						if (key === '旋转Y') result.view3d.rotateY = parseInt(value)
						if (key === '旋转X') result.view3d.rotateX = parseInt(value)
						if (key === '显示网格') result.view3d.showGrid = value === 'true'
						break

					case '右侧工具':
						if (key === '工具按钮') {
							result.rightTools = value.split(',').map((t) => {
								const [name, icon] = t.split('|')
								return { name, icon }
							})
						}
						break

					case '坐标轴':
						if (key === '显示坐标轴') result.showAxis = value === 'true'
						if (key === 'X轴颜色') result.axisColors.x = value
						if (key === 'Y轴颜色') result.axisColors.y = value
						if (key === 'Z轴颜色') result.axisColors.z = value
						break

					case '状态栏':
						if (key === '左侧状态') result.statusLeft = value.split(',')
						if (key === '右侧状态') result.statusRight = value
						break
				}
			} else if (currentSection === '零件树结构') {
				const [level, type, label] = line.split('|')
				result.treeStructure.push({ level: parseInt(level), type, label })
			}
		})

		return result
	}

	// 构建树形结构
	const buildTree = (items) => {
		const tree = []
		const stack = []

		items.forEach((item) => {
			const node = {
				label: item.label,
				type: item.type,
				children: item.type === 'folder' || item.type === 'part' ? [] : undefined
			}

			while (stack.length >= item.level) {
				stack.pop()
			}

			if (stack.length === 0) {
				tree.push(node)
			} else {
				const parent = stack[stack.length - 1]
				if (!parent.children) parent.children = []
				parent.children.push(node)
			}

			if (item.type === 'folder' || item.type === 'part') {
				stack.push(node)
			}
		})

		return tree
	}

	// 处理文件上传
	const handleFileUpload = (file) => {
		const reader = new FileReader()

		reader.onload = (e) => {
			try {
				const content = e.target.result
				const parsedConfig = parseConfig(content)

				// 更新配置
				Object.assign(config.value, parsedConfig)

				// 构建树形结构
				treeData.value = buildTree(parsedConfig.treeStructure)

				// 设置默认活动标签
				if (config.value.sidebarTabs.length > 0) {
					activeTab.value = config.value.sidebarTabs[0].key
				}

				pageLoaded.value = true
				ElMessage.success('配置文件导入成功！')
			} catch (error) {
				ElMessage.error('配置文件解析失败：' + error.message)
			}
		}

		reader.readAsText(file)
		return false // 阻止默认上传行为
	}
</script>

<style scoped lang="scss">
	.cad-container {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;

		.import-section {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #f0f2f5;

			.import-card {
				width: 500px;

				::v-deep(.el-upload) {
					width: 100%;

					.el-upload-dragger {
						width: 100%;
						height: 200px;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;

						.el-icon--upload {
							font-size: 67px;
							color: #c0c4cc;
							margin-bottom: 16px;
						}
					}
				}
			}
		}

		.cad-main {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
		}

		.top-header {
			background: white;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

			.menu-bar {
				border-bottom: 1px solid #e0e0e0;

				::v-deep(.el-menu) {
					border: none;

					.el-menu-item {
						height: 40px;
						line-height: 40px;
						font-size: 13px;
					}
				}
			}

			.toolbar {
				background: #fafafa;

				.tool-group {
					::v-deep(.el-button) {
						padding: 4px 8px;
					}
				}
			}
		}

		.main-content {
			flex: 1;
			overflow: hidden;

			.left-sidebar {
				width: 280px;
				background: white;
				border-right: 1px solid #e0e0e0;

				::v-deep(.el-tabs) {
					.el-tabs__header {
						margin: 0;
					}

					.el-tabs__content {
						padding: 0;
						height: calc(100% - 40px);
						overflow: auto;
					}
				}

				.custom-tree-node {
					display: flex;
					align-items: center;
					font-size: 13px;
				}
			}

			.cad-viewport {
				position: relative;

				.viewport-container {
					width: 100%;
					height: 100%;
					position: relative;

					.viewport-3d {
						width: 100%;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						perspective: 1000px;

						.cad-object {
							transform-style: preserve-3d;

							.panel-3d {
								border: 2px solid #666;
								box-shadow: 0 0 20px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.1);
								position: relative;
								transition: transform 0.3s ease;

								&::before {
									content: '';
									position: absolute;
									top: 50%;
									left: 0;
									right: 0;
									height: 1px;
									background: rgba(255, 255, 255, 0.2);
								}

								&::after {
									content: '';
									position: absolute;
									top: 0;
									bottom: 0;
									left: 50%;
									width: 1px;
									background: rgba(255, 255, 255, 0.2);
								}
							}
						}
					}

					.right-toolbar {
						position: absolute;
						right: 20px;
						top: 20px;
						display: flex;
						flex-direction: column;
						gap: 8px;

						::v-deep(.el-button) {
							background: white;
							border-color: #dcdfe6;

							&:hover {
								background: #f5f7fa;
							}
						}
					}

					.axis-indicator {
						position: absolute;
						bottom: 20px;
						left: 20px;

						.axis-cube {
							width: 80px;
							height: 80px;
							position: relative;
							transform-style: preserve-3d;

							.axis {
								position: absolute;
								width: 30px;
								height: 30px;
								display: flex;
								align-items: center;
								justify-content: center;
								font-size: 14px;
								font-weight: bold;
								border-radius: 50%;
								color: white;

								&.x-axis {
									bottom: 0;
									left: 0;
								}

								&.y-axis {
									top: 0;
									left: 50%;
									transform: translateX(-50%);
								}

								&.z-axis {
									bottom: 30%;
									right: 0;
								}
							}
						}
					}
				}
			}
		}

		.status-bar {
			background: white;
			border-top: 1px solid #e0e0e0;
			height: 24px;
			font-size: 12px;
			color: #666;
		}
	}
</style>
