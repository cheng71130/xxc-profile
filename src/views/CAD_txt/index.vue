<template>
	<div class="cad-container h-screen flex flex-col">
		<!-- 文件上传区域 -->
		<div v-if="!configLoaded" class="upload-container">
			<el-upload
				class="upload-dragger"
				drag
				:auto-upload="false"
				:on-change="handleFileChange"
				:show-file-list="false"
				accept=".txt"
			>
				<el-icon class="el-icon--upload"><UploadFilled /></el-icon>
				<div class="el-upload__text">拖拽TXT配置文件到此处，或<em>点击上传</em></div>
				<template #tip>
					<div class="el-upload__tip">只支持 .txt 格式的配置文件</div>
				</template>
			</el-upload>

			<div v-if="parseError" class="error-message">
				<el-alert type="error" :title="parseError" show-icon />
			</div>
		</div>

		<!-- 动态生成的CAD界面 -->
		<template v-else>
			<!-- 顶部菜单栏 -->
			<div class="menu-bar">
				<el-menu mode="horizontal" class="menu-items">
					<el-menu-item v-for="(menu, index) in config.menus" :key="index" :index="String(index + 1)">
						{{ menu }}
					</el-menu-item>
				</el-menu>

				<!-- 右侧用户信息 -->
				<div class="user-info">
					<span>{{ config.systemName }}</span>
					<el-avatar size="small" class="ml-2">U</el-avatar>
				</div>
			</div>

			<!-- 工具栏 -->
			<div class="toolbar">
				<div class="toolbar-section">
					<el-button-group>
						<el-button v-for="tool in config.tools" :key="tool" size="small" :icon="getToolIcon(tool)">
							{{ tool }}
						</el-button>
					</el-button-group>
				</div>

				<div class="toolbar-section">
					<el-button size="small" @click="reloadConfig">重新加载配置</el-button>
				</div>
			</div>

			<!-- 主要内容区域 -->
			<div class="main-content flex-1 flex">
				<!-- 左侧项目树 -->
				<div class="sidebar">
					<div class="sidebar-header">
						<span>项目</span>
						<el-button size="small" text icon="More" />
					</div>

					<el-tree
						:data="config.projectTree"
						:props="{ children: 'children', label: 'label' }"
						default-expand-all
						class="project-tree"
					>
						<template #default="{ node, data }">
							<span class="tree-node">{{ data.label }}</span>
						</template>
					</el-tree>
				</div>

				<!-- 3D视图容器 (全屏) -->
				<div class="drawing-area flex-1 relative">
					<div ref="threejsContainer" class="threejs-container"></div>

					<!-- 加载提示 -->
					<div v-if="isLoading" class="loading-overlay">
						<el-loading-spinner />
						<span>正在加载模型...</span>
					</div>

					<!-- 错误提示 -->
					<div v-if="loadError" class="error-overlay">
						<el-icon><Warning /></el-icon>
						<span>{{ loadError }}</span>
						<el-button size="small" @click="retryLoad">重新加载</el-button>
					</div>
				</div>

				<!-- 右侧属性面板 -->
				<div class="properties-panel">
					<div class="panel-header">
						<span>属性</span>
					</div>
					<div class="panel-content">
						<el-form label-position="top" size="small">
							<el-form-item v-for="(value, key) in config.properties" :key="key" :label="key">
								<el-input :value="value" readonly />
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>

			<!-- 底部状态栏 -->
			<div class="status-bar">
				<div class="status-left">
					<span>{{ config.status.message }}</span>
				</div>
				<div class="status-right">
					<span>服务器: {{ config.status.server }}</span>
					<span class="ml-4">版本: {{ config.status.version }}</span>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup>
	import * as THREE from 'three'
	import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

	// 响应式数据
	const threejsContainer = ref(null)
	const isLoading = ref(false)
	const loadError = ref('')
	const configLoaded = ref(false)
	const parseError = ref('')

	// 配置数据
	const config = ref({
		systemName: 'CrownCAD',
		menus: [],
		tools: [],
		projectTree: [],
		modelPath: '',
		properties: {},
		status: {
			message: '就绪',
			server: '未知',
			version: '未知'
		}
	})

	// Three.js 相关变量
	let scene, camera, renderer, controls, animationId

	// 简化的TXT解析器
	const parseConfig = (content) => {
		const result = {
			systemName: 'CrownCAD',
			menus: ['文件', '编辑', '视图', '工具', '帮助'],
			tools: ['新建', '打开', '保存', '撤销', '重做'],
			projectTree: [],
			modelPath: '',
			properties: {},
			status: {
				message: '就绪',
				server: '未知',
				version: '未知'
			}
		}

		const lines = content
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line)

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i]

			// 解析系统名称
			if (line.startsWith('[SYSTEM]')) {
				const nameLine = lines[i + 1]
				if (nameLine && nameLine.includes('=')) {
					result.systemName = nameLine.split('=')[1].trim()
				}
			}

			// 解析菜单
			else if (line.startsWith('[MENU]')) {
				const menuLine = lines[i + 1]
				if (menuLine) {
					result.menus = menuLine.split(',').map((item) => item.trim())
				}
			}

			// 解析工具栏
			else if (line.startsWith('[TOOLBAR]')) {
				const toolLine = lines[i + 1]
				if (toolLine) {
					result.tools = toolLine.split(',').map((item) => item.trim())
				}
			}

			// 解析项目树
			else if (line.startsWith('[PROJECT_TREE]')) {
				let j = i + 1
				while (j < lines.length && !lines[j].startsWith('[')) {
					const treeLine = lines[j]
					if (treeLine.includes('|')) {
						const [category, items] = treeLine.split('|')
						const children = items.split(',').map((item) => ({
							label: item.trim()
						}))

						result.projectTree.push({
							label: category.trim(),
							icon: 'Folder',
							children: children
						})
					}
					j++
				}
			}

			// 解析模型
			else if (line.startsWith('[MODEL]')) {
				const modelLine = lines[i + 1]
				if (modelLine) {
					result.modelPath = modelLine.trim()
				}
			}

			// 解析属性
			else if (line.startsWith('[PROPERTIES]')) {
				let j = i + 1
				while (j < lines.length && !lines[j].startsWith('[')) {
					const propLine = lines[j]
					if (propLine.includes('=')) {
						const [key, value] = propLine.split('=')
						result.properties[key.trim()] = value.trim()
					}
					j++
				}
			}

			// 解析状态栏
			else if (line.startsWith('[STATUS]')) {
				const statusLine = lines[i + 1]
				if (statusLine) {
					const parts = statusLine.split('|')
					if (parts.length >= 3) {
						result.status = {
							message: parts[0].trim(),
							server: parts[1].trim(),
							version: parts[2].trim()
						}
					}
				}
			}
		}

		return result
	}

	// 工具图标映射
	const getToolIcon = (toolName) => {
		const icons = {
			新建: 'Document',
			打开: 'FolderOpened',
			保存: 'DocumentCopy',
			撤销: 'Back',
			重做: 'Right'
		}
		return icons[toolName] || 'Setting'
	}

	// 文件处理
	const handleFileChange = (file) => {
		parseError.value = ''

		if (!file.raw || !file.name.toLowerCase().endsWith('.txt')) {
			parseError.value = '请选择TXT格式的文件'
			return
		}

		const reader = new FileReader()
		reader.onload = (e) => {
			try {
				const content = e.target.result
				console.log('文件内容:', content)

				const parsedConfig = parseConfig(content)
				config.value = parsedConfig
				configLoaded.value = true

				// 初始化3D场景
				setTimeout(() => {
					initThreeJS()
				}, 100)
			} catch (error) {
				console.error('解析错误:', error)
				parseError.value = error.message
			}
		}

		reader.onerror = () => {
			parseError.value = '文件读取失败'
		}

		reader.readAsText(file.raw, 'UTF-8')
	}

	// 重新加载配置
	const reloadConfig = () => {
		configLoaded.value = false
		parseError.value = ''
		cleanup()
	}

	// 初始化Three.js场景
	const initThreeJS = () => {
		const container = threejsContainer.value
		if (!container) return

		// 创建场景
		scene = new THREE.Scene()
		scene.background = new THREE.Color(0x2c3e50)

		// 创建相机
		const width = container.clientWidth
		const height = container.clientHeight
		camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 10000)
		camera.position.set(5, 5, 5)

		// 创建渲染器
		renderer = new THREE.WebGLRenderer({ antialias: true })
		renderer.setSize(width, height)
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFSoftShadowMap
		container.appendChild(renderer.domElement)

		// 添加控制器 - 优化控制参数
		controls = new OrbitControls(camera, renderer.domElement)
		controls.enableDamping = true
		controls.dampingFactor = 0.05
		controls.target.set(0, 0, 0)

		// 优化缩放设置，防止模型消失
		controls.minDistance = 0.1 // 最小缩放距离
		controls.maxDistance = 1000 // 最大缩放距离
		controls.enableZoom = true
		controls.zoomSpeed = 1.0

		// 添加光源
		const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
		scene.add(ambientLight)

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
		directionalLight.position.set(10, 10, 5)
		directionalLight.castShadow = true
		scene.add(directionalLight)

		// 加载模型
		if (config.value.modelPath) {
			loadModel(config.value.modelPath)
		} else {
			createDefaultModel()
		}

		// 开始渲染循环
		animate()
	}

	// 加载模型
	const loadModel = (modelPath) => {
		isLoading.value = true
		loadError.value = ''

		const loader = new OBJLoader()

		loader.load(
			modelPath,
			(object) => {
				// 设置材质
				object.traverse((child) => {
					if (child.isMesh) {
						child.material = new THREE.MeshLambertMaterial({
							color: 0x95a5a6,
							side: THREE.DoubleSide
						})
						child.castShadow = true
						child.receiveShadow = true
					}
				})

				// 计算模型包围盒
				const box = new THREE.Box3().setFromObject(object)
				const center = box.getCenter(new THREE.Vector3())
				const size = box.getSize(new THREE.Vector3())

				// 将模型居中
				object.position.x = -center.x
				object.position.y = -center.y
				object.position.z = -center.z
				object.name = 'loadedModel'

				// 优化相机设置
				const maxDim = Math.max(size.x, size.y, size.z)

				if (maxDim > 0) {
					// 设置合适的近远平面
					camera.near = maxDim * 0.001 // 更小的近平面
					camera.far = maxDim * 100 // 合适的远平面
					camera.updateProjectionMatrix()

					// 计算合适的相机距离
					const fov = camera.fov * (Math.PI / 180)
					let cameraDistance = maxDim / (2 * Math.tan(fov / 2))
					cameraDistance *= 1.5 // 稍微远一点看全貌

					// 设置相机位置
					camera.position.set(cameraDistance, cameraDistance, cameraDistance)
					camera.lookAt(0, 0, 0)

					// 更新控制器设置
					controls.target.set(0, 0, 0)
					controls.minDistance = maxDim * 0.1 // 基于模型大小设置最小距离
					controls.maxDistance = maxDim * 10 // 基于模型大小设置最大距离
					controls.update()
				}

				scene.add(object)
				isLoading.value = false
			},
			undefined,
			(error) => {
				console.error('模型加载失败:', error)
				isLoading.value = false
				loadError.value = `模型加载失败: ${error.message}`
				createDefaultModel()
			}
		)
	}

	// 创建默认模型
	const createDefaultModel = () => {
		const geometry = new THREE.BoxGeometry(2, 2, 2)
		const material = new THREE.MeshLambertMaterial({ color: 0x95a5a6 })
		const cube = new THREE.Mesh(geometry, material)
		cube.castShadow = true
		cube.receiveShadow = true
		cube.name = 'defaultModel'
		scene.add(cube)
	}

	// 重新加载模型
	const retryLoad = () => {
		loadError.value = ''
		const existingModel = scene.getObjectByName('loadedModel') || scene.getObjectByName('defaultModel')
		if (existingModel) {
			scene.remove(existingModel)
		}

		if (config.value.modelPath) {
			loadModel(config.value.modelPath)
		} else {
			createDefaultModel()
		}
	}

	// 动画循环
	const animate = () => {
		animationId = requestAnimationFrame(animate)
		if (controls) controls.update()
		if (renderer && scene && camera) renderer.render(scene, camera)
	}

	// 清理Three.js资源
	const cleanup = () => {
		if (animationId) {
			cancelAnimationFrame(animationId)
		}

		if (renderer) {
			renderer.dispose()
			if (threejsContainer.value && renderer.domElement) {
				threejsContainer.value.removeChild(renderer.domElement)
			}
		}

		if (controls) {
			controls.dispose()
		}
	}

	// 生命周期钩子
	onMounted(() => {
		window.addEventListener('resize', () => {
			if (!camera || !renderer || !threejsContainer.value) return

			const container = threejsContainer.value
			const width = container.clientWidth
			const height = container.clientHeight

			camera.aspect = width / height
			camera.updateProjectionMatrix()
			renderer.setSize(width, height)
		})
	})

	onUnmounted(() => {
		cleanup()
	})
</script>

<style scoped lang="scss">
	.cad-container {
		background: #f5f5f5;
		font-family: 'Microsoft YaHei', sans-serif;
	}

	.upload-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		padding: 40px;

		.upload-dragger {
			width: 500px;
		}

		.error-message {
			margin-top: 20px;
			width: 500px;
		}
	}

	.menu-bar {
		background: #ffffff;
		border-bottom: 1px solid #e4e7ed;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0;
		height: 44px;

		.menu-items {
			border-bottom: none;
			background: transparent;
			flex: 1;
			height: 100%;
			padding-left: 16px;
		}

		.el-menu-item {
			height: 44px;
			line-height: 44px;
			padding: 0 20px;
			font-size: 14px;
		}

		.el-menu-item.is-active {
			background-color: var(--el-color-primary-light-9);
		}

		.user-info {
			display: flex;
			align-items: center;
			font-size: 13px;
			color: #606266;
			height: 100%;
			padding: 0 16px;
		}
	}

	.toolbar {
		background: #fafafa;
		border-bottom: 1px solid #e4e7ed;
		padding: 8px 16px;
		display: flex;
		gap: 16px;
		align-items: center;

		.toolbar-section {
			display: flex;
			align-items: center;
		}
	}

	.main-content {
		height: calc(100vh - 120px);
	}

	.sidebar {
		width: 240px;
		background: #ffffff;
		border-right: 1px solid #e4e7ed;
		display: flex;
		flex-direction: column;

		.sidebar-header {
			padding: 12px 16px;
			border-bottom: 1px solid #e4e7ed;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-weight: 500;
			font-size: 14px;
			height: 48px;
		}

		.project-tree {
			flex: 1;
			padding: 8px;

			.tree-node {
				display: flex;
				align-items: center;
				font-size: 13px;
			}
		}
	}

	.drawing-area {
		position: relative;
		overflow: hidden;

		.threejs-container {
			width: 100%;
			height: 100%;

			canvas {
				display: block;
			}
		}

		.loading-overlay,
		.error-overlay {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(44, 62, 80, 0.8);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: white;
			font-size: 14px;
			z-index: 10;

			.el-loading-spinner,
			.el-icon {
				margin-bottom: 16px;
			}

			.el-button {
				margin-top: 16px;
			}
		}
	}

	.properties-panel {
		width: 280px;
		background: #ffffff;
		border-left: 1px solid #e4e7ed;

		.panel-header {
			padding: 12px 16px;
			border-bottom: 1px solid #e4e7ed;
			font-weight: 500;
			font-size: 14px;
			height: 48px;
			display: flex;
			align-items: center;
		}

		.panel-content {
			padding: 16px;
		}
	}

	.status-bar {
		height: 32px;
		background: #fafafa;
		border-top: 1px solid #e4e7ed;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 16px;
		font-size: 12px;
		color: #606266;

		.status-right {
			display: flex;
			align-items: center;
		}
	}
</style>
