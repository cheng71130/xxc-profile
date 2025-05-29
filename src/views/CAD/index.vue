<template>
	<div class="cad-container h-screen flex flex-col">
		<!-- 顶部菜单栏 -->
		<div class="menu-bar">
			<el-menu mode="horizontal" class="menu-items">
				<el-menu-item index="1">文件</el-menu-item>
				<el-menu-item index="2">编辑</el-menu-item>
				<el-menu-item index="3">视图</el-menu-item>
				<el-menu-item index="4">插入</el-menu-item>
				<el-menu-item index="5">格式</el-menu-item>
				<el-menu-item index="6">工具</el-menu-item>
				<el-menu-item index="7">绘图</el-menu-item>
				<el-menu-item index="8">标注</el-menu-item>
				<el-menu-item index="9">修改</el-menu-item>
				<el-menu-item index="10">窗口</el-menu-item>
				<el-menu-item index="11">帮助</el-menu-item>
			</el-menu>

			<!-- 右侧用户信息 -->
			<div class="user-info">
				<span>insofworksCAD2025</span>
				<el-avatar size="small" class="ml-2">U</el-avatar>
			</div>
		</div>

		<!-- 工具栏 -->
		<div class="toolbar">
			<div class="toolbar-section">
				<el-button-group>
					<el-button size="small" icon="Document">新建</el-button>
					<el-button size="small" icon="FolderOpened">打开</el-button>
					<el-button size="small" icon="DocumentCopy">保存</el-button>
				</el-button-group>
			</div>

			<div class="toolbar-section">
				<el-button-group>
					<el-button size="small" icon="Back">撤销</el-button>
					<el-button size="small" icon="Right">重做</el-button>
				</el-button-group>
			</div>

			<div class="toolbar-section">
				<el-button-group>
					<el-button size="small" icon="Minus">线条</el-button>
					<el-button size="small" icon="FullScreen">矩形</el-button>
					<el-button size="small" icon="CirclePlus">圆形</el-button>
					<el-button size="small" icon="Position">移动</el-button>
					<el-button size="small" icon="CopyDocument">复制</el-button>
					<el-button size="small" icon="Delete">删除</el-button>
				</el-button-group>
			</div>

			<div class="toolbar-section">
				<el-button-group>
					<el-button size="small" icon="ZoomIn">放大</el-button>
					<el-button size="small" icon="ZoomOut">缩小</el-button>
					<el-button size="small" icon="Refresh">适合窗口</el-button>
				</el-button-group>
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
					:data="projectTreeData"
					:props="{ children: 'children', label: 'label' }"
					default-expand-all
					class="project-tree"
				>
					<template #default="{ node, data }">
						<span class="tree-node">
							<el-icon class="mr-1">
								<component :is="data.icon" />
							</el-icon>
							{{ data.label }}
						</span>
					</template>
				</el-tree>
			</div>

			<!-- 中间绘图区域 -->
			<div class="drawing-area flex-1 relative">
				<!-- 3D视图容器 -->
				<div ref="threejsContainer" class="threejs-container"></div>

				<!-- 加载提示 -->
				<div v-if="isLoading" class="loading-overlay">
					<el-loading-spinner />
					<span>正在加载模型...</span>
				</div>

				<!-- 错误提示 -->
				<div v-if="loadError" class="error-overlay">
					<el-icon><Warning /></el-icon>
					<span>模型加载失败: {{ loadError }}</span>
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
						<el-form-item label="对象类型">
							<el-input value="实体" readonly />
						</el-form-item>
						<el-form-item label="材质">
							<el-select placeholder="选择材质">
								<el-option label="金属" value="metal" />
								<el-option label="塑料" value="plastic" />
							</el-select>
						</el-form-item>
						<el-form-item label="颜色">
							<el-color-picker />
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>

		<!-- 底部状态栏 -->
		<div class="status-bar">
			<div class="status-left">
				<span>就绪</span>
			</div>
			<div class="status-right">
				<span>坐标: X:0.00 Y:0.00 Z:0.00</span>
				<span class="ml-4">比例: 1:1</span>
				<span class="ml-4">MMGS</span>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, onUnmounted } from 'vue'
	import * as THREE from 'three'
	import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

	// 响应式数据
	const threejsContainer = ref(null)
	const isLoading = ref(false)
	const loadError = ref('')

	// Three.js 相关变量
	let scene, camera, renderer, controls, animationId

	// 项目树数据
	const projectTreeData = ref([
		{
			label: '零件 1',
			icon: 'Folder',
			children: [
				{
					label: '实体 1',
					icon: 'DataLine',
					children: [
						{ label: '图层 0', icon: 'DataLine' },
						{ label: '实体', icon: 'DataLine' }
					]
				}
			]
		},
		{
			label: '曲面 1',
			icon: 'Folder',
			children: [
				{
					label: '实体 1',
					icon: 'DataLine',
					children: [
						{ label: '图层 0', icon: 'DataLine' },
						{ label: '实体', icon: 'DataLine' }
					]
				}
			]
		},
		{
			label: '曲线 1',
			icon: 'Folder',
			children: [
				{
					label: '实体 1',
					icon: 'DataLine',
					children: [
						{ label: '图层 0', icon: 'DataLine' },
						{ label: '实体', icon: 'DataLine' }
					]
				}
			]
		}
	])

	// 初始化Three.js场景
	const initThreeJS = () => {
		const container = threejsContainer.value
		if (!container) return

		// 创建场景
		scene = new THREE.Scene()
		scene.background = new THREE.Color(0x2c3e50)

		// 创建相机 - 优化近远平面设置
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

		// 加载OBJ模型
		loadOBJModel()

		// 开始渲染循环
		animate()
	}

	// 加载OBJ模型
	const loadOBJModel = () => {
		isLoading.value = true
		loadError.value = ''

		const loader = new OBJLoader()
		const modelPath = '/model/Base.obj' // 修正文件名

		loader.load(
			modelPath,
			(object) => {
				console.log('OBJ模型加载成功')

				// 清除之前的模型
				const existingModel = scene.getObjectByName('loadedModel')
				if (existingModel) {
					scene.remove(existingModel)
				}

				// 设置模型材质
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
			(progress) => {
				if (progress.lengthComputable) {
					const percentComplete = (progress.loaded / progress.total) * 100
					console.log('加载进度:', percentComplete.toFixed(2) + '%')
				}
			},
			(error) => {
				console.error('OBJ模型加载失败:', error)
				isLoading.value = false
				loadError.value = error.message || '未知错误'
				createFallbackModel()
			}
		)
	}

	// 创建备用模型
	const createFallbackModel = () => {
		const geometry = new THREE.BoxGeometry(2, 2, 2)
		const material = new THREE.MeshLambertMaterial({ color: 0x95a5a6 })
		const cube = new THREE.Mesh(geometry, material)
		cube.castShadow = true
		cube.receiveShadow = true
		cube.name = 'fallbackModel'
		scene.add(cube)
	}

	// 重新加载模型
	const retryLoad = () => {
		loadError.value = ''
		const existingModel = scene.getObjectByName('loadedModel') || scene.getObjectByName('fallbackModel')
		if (existingModel) {
			scene.remove(existingModel)
		}
		loadOBJModel()
	}

	// 动画循环
	const animate = () => {
		animationId = requestAnimationFrame(animate)
		controls.update()
		renderer.render(scene, camera)
	}

	// 处理窗口大小变化
	const handleResize = () => {
		if (!camera || !renderer || !threejsContainer.value) return

		const container = threejsContainer.value
		const width = container.clientWidth
		const height = container.clientHeight

		camera.aspect = width / height
		camera.updateProjectionMatrix()
		renderer.setSize(width, height)
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

		window.removeEventListener('resize', handleResize)
	}

	// 生命周期钩子
	onMounted(() => {
		initThreeJS()
		window.addEventListener('resize', handleResize)
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
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.el-menu-item.is-active {
			background: var(--el-color-primary-light-9) !important;
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
		flex-wrap: wrap;
		align-items: center;

		.toolbar-section {
			display: flex;
			align-items: center;
		}
	}

	.main-content {
		height: calc(100vh - 136px);
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
			background: transparent;

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

	// 响应式设计
	@media (max-width: 1200px) {
		.sidebar {
			width: 200px;
		}

		.properties-panel {
			width: 240px;
		}
	}

	@media (max-width: 768px) {
		.toolbar {
			.toolbar-section {
				margin-bottom: 8px;
			}
		}

		.main-content {
			flex-direction: column;
		}

		.sidebar,
		.properties-panel {
			width: 100%;
			height: 200px;
		}
	}
</style>
