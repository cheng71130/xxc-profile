<template>
	<div class="w-full h-screen relative">
		<!-- 加载进度显示 -->
		<div v-if="loading" class="loading-overlay flex items-center justify-center absolute inset-0 z-10">
			<div class="loading-container">
				<div class="loading-card">
					<div class="loading-header">
						<div class="loading-icon">
							<div class="spinner"></div>
						</div>
						<h3 class="loading-title">机器人加载中</h3>
					</div>

					<div class="progress-section">
						<el-progress
							:percentage="loadingProgress"
							:status="loadingProgress === 100 ? 'success' : ''"
							:stroke-width="8"
							:show-text="false"
						/>
						<div class="progress-text">
							<span class="progress-percentage">{{ loadingProgress }}%</span>
							<span class="progress-description">{{ loadingText }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 机器人控制面板 -->
		<div class="control-panel absolute top-6 left-6 z-5">
			<el-scrollbar max-height="850px">
				<div class="control-card">
					<div class="card-header">
						<div class="header-icon">
							<el-icon><Setting /></el-icon>
						</div>
						<h3 class="header-title">机器人控制</h3>
					</div>

					<div class="card-content">
						<!-- URDF文件选择 -->
						<div class="control-section">
							<div class="section-label">
								<el-icon class="label-icon"><Document /></el-icon>
								<span>URDF文件</span>
							</div>
							<el-select
								v-model="selectedUrdf"
								@change="onUrdfChange"
								:disabled="loading"
								placeholder="选择URDF文件"
								class="full-width-select"
							>
								<el-option v-for="urdf in availableUrdfs" :key="urdf.value" :label="urdf.label" :value="urdf.value" />
							</el-select>
							<el-button @click="loadRobot" :loading="loading" type="primary" class="action-button" icon="Robot">
								加载机器人
							</el-button>
						</div>

						<!-- 关节控制 -->
						<div v-if="robot && jointNames.length > 0" class="control-section">
							<div class="section-label">
								<el-icon class="label-icon"><Operation /></el-icon>
								<span>关节控制</span>
								<el-tag size="small" class="model-count-tag">{{ jointNames.length }}</el-tag>
							</div>

							<div class="joint-controls">
								<div v-for="jointName in jointNames" :key="jointName" class="joint-control-item">
									<div class="joint-label">{{ jointName }}</div>
									<div class="joint-slider">
										<el-slider
											v-model="jointValues[jointName]"
											:min="getJointLimit(jointName, 'lower')"
											:max="getJointLimit(jointName, 'upper')"
											:step="0.1"
											@change="onJointValueChange(jointName)"
											:show-tooltip="true"
											:format-tooltip="(val) => `${((val * 180) / Math.PI).toFixed(1)}°`"
										/>
									</div>
									<div class="joint-value">{{ ((jointValues[jointName] * 180) / Math.PI).toFixed(1) }}°</div>
								</div>
							</div>
						</div>

						<!-- 动画控制 -->
						<div v-if="robot" class="control-section">
							<div class="section-label">
								<el-icon class="label-icon"><VideoPlay /></el-icon>
								<span>动画控制</span>
							</div>
							<div class="animation-controls">
								<el-button @click="startAnimation" :disabled="isAnimating" type="primary" icon="VideoPlay">
									开始动画
								</el-button>
								<el-button @click="stopAnimation" :disabled="!isAnimating" type="warning" icon="VideoPause">
									停止动画
								</el-button>
								<el-button @click="resetJoints" type="info" icon="RefreshRight"> 复位关节 </el-button>
							</div>
						</div>

						<!-- 光照控制 -->
						<div class="control-section">
							<div class="section-label">
								<el-icon class="label-icon"><Sunny /></el-icon>
								<span>光照设置</span>
							</div>
							<el-slider
								v-model="lightIntensity"
								:min="0.5"
								:max="3"
								:step="0.1"
								@change="updateLighting"
								:show-tooltip="true"
								:format-tooltip="(val) => `${val.toFixed(1)}`"
							/>
						</div>

						<!-- 机器人信息 -->
						<div v-if="robot" class="control-section">
							<div class="section-label">
								<el-icon class="label-icon"><InfoFilled /></el-icon>
								<span>机器人信息</span>
							</div>
							<div class="robot-info">
								<div class="info-item">
									<span class="info-label">关节数量:</span>
									<span class="info-value">{{ jointNames.length }}</span>
								</div>
								<div class="info-item">
									<span class="info-label">连杆数量:</span>
									<span class="info-value">{{ linkNames.length }}</span>
								</div>
								<div class="info-item">
									<span class="info-label">自由度:</span>
									<span class="info-value">{{ revoluteJoints.length }}</span>
								</div>
							</div>
						</div>

						<!-- 视角控制 -->
						<div class="control-section">
							<div class="section-label">
								<el-icon class="label-icon"><View /></el-icon>
								<span>视角控制</span>
							</div>
							<div class="view-controls">
								<el-button @click="resetView" type="info" icon="Refresh"> 重置视角 </el-button>
								<el-button @click="focusRobot" type="primary" icon="ZoomIn"> 聚焦机器人 </el-button>
							</div>
						</div>
					</div>
				</div>
			</el-scrollbar>
		</div>

		<!-- Three.js 渲染容器 -->
		<div ref="containerRef" class="w-full h-full"></div>
	</div>
</template>

<script setup>
	import { ElMessage, ElMessageBox } from 'element-plus'
	import * as THREE from 'three'
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
	import { ViewportGizmo } from 'three-viewport-gizmo'
	import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
	import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
	import URDFLoader from 'urdf-loader'

	// 响应式数据
	const containerRef = ref(null)
	const loading = ref(false)
	const loadingProgress = ref(0)
	const loadingText = ref('准备加载机器人...')
	const lightIntensity = ref(1.5)
	const selectedUrdf = ref('robot.urdf')

	// 机器人相关数据
	const jointNames = ref([])
	const linkNames = ref([])
	const revoluteJoints = ref([])
	const jointValues = ref({})
	const isAnimating = ref(false)

	// 可用的URDF文件
	const availableUrdfs = ref([
		{
			label: 'R2000iC-165F 机器人',
			value: 'robot.urdf'
		},
		{
			label: 'UR5 机器人',
			value: 'ur5.urdf'
		},
		{
			label: 'Panda 机器人',
			value: 'panda.urdf'
		}
	])

	// Three.js 相关变量
	let scene, camera, renderer, controls, gizmo, robot
	let animationId = null
	let robotAnimationId = null
	let lights = []

	// 初始化Three.js场景 - 保持你原来的设置
	const initThreeJS = () => {
		scene = new THREE.Scene()
		scene.background = new THREE.Color('#f0f0f0')

		// 保持你原来的地面和网格设置
		const groundGeometry = new THREE.BoxGeometry(100, 100, 4)
		const groundMaterial = new THREE.MeshBasicMaterial({
			color: '#333333',
			transparent: true,
			opacity: 0.4
		})
		const ground = new THREE.Mesh(groundGeometry, groundMaterial)
		ground.position.z = -2
		scene.add(ground)

		const grid = new THREE.GridHelper(100, 20, '#ffffff', '#ffffff')
		grid.material.opacity = 0.6
		grid.material.depthWrite = false
		grid.material.transparent = true
		grid.rotateX(Math.PI / 2) // 将网格从XZ平面旋转到XY平面
		scene.add(grid)

		// 保持你原来的相机设置
		const aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
		camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
		camera.position.set(8, -8, 6) // 保持CAD视角
		camera.up.set(0, 0, 1) // 保持Z轴向上
		camera.lookAt(0, 0, 0)

		// 渲染器设置保持一致
		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		})
		renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFSoftShadowMap
		renderer.outputEncoding = THREE.sRGBEncoding
		renderer.toneMapping = THREE.ReinhardToneMapping
		renderer.toneMappingExposure = 1.2
		containerRef.value.appendChild(renderer.domElement)

		// 控制器设置保持一致
		controls = new OrbitControls(camera, renderer.domElement)
		controls.enableDamping = true
		controls.dampingFactor = 0.05
		controls.minDistance = 0.5
		controls.maxDistance = 100
		controls.target.set(0, 0, 0)
		controls.enablePan = true
		controls.mouseButtons = {
			LEFT: THREE.MOUSE.ROTATE,
			MIDDLE: THREE.MOUSE.PAN,
			RIGHT: null
		}
		controls.panSpeed = 0.7

		// 视角小工具
		gizmo = new ViewportGizmo(camera, renderer, { className: 'viewport-gizmo' })
		gizmo.attachControls(controls)

		// 设置光照系统
		setupLights()

		// 开始渲染循环
		animate()
	}

	// 设置光照系统 - 保持你原来的设置
	const setupLights = () => {
		lights.forEach((light) => scene.remove(light))
		lights = []

		const ambientLight = new THREE.AmbientLight(0x404040, lightIntensity.value * 0.8)
		scene.add(ambientLight)
		lights.push(ambientLight)

		const lightDistance = 100
		const directionalLight1 = new THREE.DirectionalLight(0xffffff, lightIntensity.value)
		directionalLight1.position.set(lightDistance, lightDistance, lightDistance / 2)
		directionalLight1.castShadow = true
		directionalLight1.shadow.mapSize.width = 2048
		directionalLight1.shadow.mapSize.height = 2048
		scene.add(directionalLight1)
		lights.push(directionalLight1)

		const directions = [
			{ pos: [-lightDistance, lightDistance, lightDistance / 2], intensity: 0.6 },
			{ pos: [lightDistance / 2, -lightDistance, lightDistance], intensity: 0.5 },
			{ pos: [-lightDistance / 2, lightDistance / 2, -lightDistance], intensity: 0.4 },
			{ pos: [0, lightDistance * 1.5, 0], intensity: 0.3 },
			{ pos: [lightDistance * 1.5, 0, 0], intensity: 0.3 }
		]

		directions.forEach(({ pos, intensity }) => {
			const light = new THREE.DirectionalLight(0xffffff, lightIntensity.value * intensity)
			light.position.set(pos[0], pos[1], pos[2])
			scene.add(light)
			lights.push(light)
		})

		const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, lightIntensity.value * 0.5)
		scene.add(hemisphereLight)
		lights.push(hemisphereLight)
	}

	// 更新光照强度
	const updateLighting = () => {
		lights.forEach((light, index) => {
			if (light.isAmbientLight) {
				light.intensity = lightIntensity.value * 0.8
			} else if (light.isDirectionalLight) {
				if (index === 1) {
					light.intensity = lightIntensity.value
				} else {
					light.intensity = lightIntensity.value * (0.3 + index * 0.1)
				}
			} else if (light.isHemisphereLight) {
				light.intensity = lightIntensity.value * 0.5
			}
		})
	}

	const loadRobot = async () => {
		if (!selectedUrdf.value) {
			ElMessage.error('请选择URDF文件')
			return
		}

		loading.value = true
		loadingProgress.value = 10
		loadingText.value = '正在加载URDF文件...'

		try {
			// 清理现有机器人
			if (robot) {
				scene.remove(robot)
				robot = null
				jointNames.value = []
				linkNames.value = []
				revoluteJoints.value = []
				jointValues.value = {}
			}

			const loader = new URDFLoader()

			loader.loadMeshCb = (path, manager, onComplete) => {
				loadingText.value = `正在加载模型: ${path.split('/').pop()}`

				if (path.endsWith('.obj')) {
					const objLoader = new OBJLoader()
					const mtlLoader = new MTLLoader()

					// 尝试加载对应的MTL文件
					const mtlPath = path.replace('.obj', '.mtl')

					mtlLoader.load(
						mtlPath,
						(materials) => {
							materials.preload()
							// 应用材质增强
							Object.values(materials.materials).forEach((material) => {
								enhanceMaterial(material)
							})
							objLoader.setMaterials(materials)
							objLoader.load(path, (obj) => {
								// 应用模型增强
								enhanceModel(obj)
								onComplete(obj)
							})
						},
						undefined,
						() => {
							// MTL加载失败，使用默认材质
							objLoader.load(path, (obj) => {
								applyDefaultMaterials(obj)
								enhanceModel(obj)
								onComplete(obj)
							})
						}
					)
				} else if (path.endsWith('.stl')) {
					const stlLoader = new THREE.STLLoader(manager)
					stlLoader.load(path, (geometry) => {
						const material = new THREE.MeshPhongMaterial({
							color: 0x888888,
							shininess: 30,
							specular: 0x222222
						})
						const mesh = new THREE.Mesh(geometry, material)
						enhanceModel(mesh)
						onComplete(mesh)
					})
				}
			}

			loadingProgress.value = 30
			loadingText.value = '正在解析机器人结构...'

			loader.load(
				`/models/${selectedUrdf.value}`,
				(loadedRobot) => {
					loadingProgress.value = 70
					loadingText.value = '正在处理机器人数据...'

					robot = loadedRobot
					scene.add(robot)

					// 提取关节信息
					extractRobotInfo(robot)

					// 应用你原来的模型处理逻辑
					processRobotModel(robot)

					// 调整相机视角 - 保持CAD风格
					adjustCameraView(robot)

					loadingProgress.value = 100
					loadingText.value = '加载完成！'

					setTimeout(() => {
						loading.value = false
						ElMessage.success(`机器人加载成功！找到 ${jointNames.value.length} 个关节`)
					}, 500)
				},
				(progress) => {
					// 加载进度回调
					// const percent = Math.round((progress.loaded / progress.total) * 40) + 30
					// loadingProgress.value = Math.min(percent, 70)
				},
				(error) => {
					console.error('URDF加载失败:', error)
					ElMessage.error(`URDF加载失败: ${error.message || error}`)
					loading.value = false
				}
			)
		} catch (error) {
			console.error('加载过程失败:', error)
			ElMessage.error('加载过程失败')
			loading.value = false
		}
	}

	// 提取机器人信息
	const extractRobotInfo = (robotModel) => {
		const joints = []
		const links = []
		const revolutes = []

		robotModel.traverse((child) => {
			if (child.isURDFJoint) {
				joints.push(child.name)
				if (child.jointType === 'revolute') {
					revolutes.push(child.name)
					// 初始化关节值
					jointValues.value[child.name] = 0
				}
			} else if (child.isURDFLink) {
				links.push(child.name)
			}
		})

		jointNames.value = joints
		linkNames.value = links
		revoluteJoints.value = revolutes
	}

	// 处理机器人模型
	const processRobotModel = (robotModel) => {
		// 1. 先应用缩放
		robotModel.scale.multiplyScalar(0.005)

		// 2. 强制更新变换矩阵
		robotModel.updateMatrixWorld(true)

		// 3. 计算缩放后的边界盒
		const box = new THREE.Box3().setFromObject(robotModel)
		const center = box.getCenter(new THREE.Vector3())
		const size = box.getSize(new THREE.Vector3())

		// 4. 🎯 X、Y轴居中，Z轴底部贴地
		robotModel.position.x = -center.x // X轴居中
		robotModel.position.y = -center.y // Y轴居中
		robotModel.position.z = -box.min.z // Z轴底部贴地面 (地面是z=0)


		// 5. 应用材质和阴影设置
		robotModel.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true
				child.receiveShadow = true

				if (child.material) {
					const materials = Array.isArray(child.material) ? child.material : [child.material]
					materials.forEach((mat) => enhanceMaterial(mat))
				}
			}
		})
	}

	// 材质增强
	const enhanceMaterial = (material) => {
		if (material.emissive && material.emissive.getHex() === 0x000000) {
			if (material.color) {
				material.emissive.setRGB(material.color.r * 0.05, material.color.g * 0.05, material.color.b * 0.05)
			} else {
				material.emissive.setHex(0x0a0a0a)
			}
		}
		if (material.shininess !== undefined && material.shininess === 0) {
			material.shininess = 30
		}
		material.receiveShadow = true
		if (material.transparent === undefined) {
			material.transparent = false
		}
	}

	// 应用默认材质
	const applyDefaultMaterials = (object) => {
		const defaultMaterial = new THREE.MeshPhongMaterial({
			color: 0x888888,
			shininess: 30,
			specular: 0x222222
		})

		object.traverse((child) => {
			if (child.isMesh) {
				child.material = defaultMaterial.clone()
				child.material.color.setHex(Math.random() * 0xffffff)
			}
		})
	}

	// 模型增强
	const enhanceModel = (object) => {
		object.traverse((child) => {
			if (child.isMesh && child.material) {
				const material = child.material
				if (Array.isArray(material)) {
					material.forEach((mat) => enhanceMaterial(mat))
				} else {
					enhanceMaterial(material)
				}
			}
		})
	}

	// 调整相机视角
	const adjustCameraView = (robotModel) => {
		// const box = new THREE.Box3().setFromObject(robotModel)
		// const center = box.getCenter(new THREE.Vector3())
		// const size = box.getSize(new THREE.Vector3())
		// const maxDim = Math.max(size.x, size.y, size.z)
		// cameraDistance *= distanceMultiplier
		// // 设置合理的距离范围限制
		// cameraDistance = Math.max(cameraDistance, 1.0) // 最小距离
		// cameraDistance = Math.min(cameraDistance, 500.0) // 最大距离
		// // 保持CAD视角方向，但调整距离
		// const direction = new THREE.Vector3(8, -8, 6).normalize()
		// camera.position.copy(center).add(direction.multiplyScalar(cameraDistance))
		// camera.up.set(0, 0, 1)
		// camera.lookAt(center.x, center.y, center.z)
		// controls.target.copy(center)
		// controls.update()
	}

	// 关节控制
	const onJointValueChange = (jointName) => {
		if (robot && jointValues.value[jointName] !== undefined) {
			robot.setJointValue(jointName, jointValues.value[jointName])
		}
	}

	// 获取关节限制
	const getJointLimit = (jointName, type) => {
		if (!robot) return type === 'lower' ? -Math.PI : Math.PI

		const joint = robot.joints[jointName]
		if (joint && joint.limit) {
			return joint.limit[type] || (type === 'lower' ? -Math.PI : Math.PI)
		}
		return type === 'lower' ? -Math.PI : Math.PI
	}

	// 动画控制
	const startAnimation = () => {
		if (isAnimating.value || !robot) return

		isAnimating.value = true

		const animate = () => {
			if (!isAnimating.value) return

			const time = Date.now() * 0.001

			// 标准方式控制关节
			revoluteJoints.value.forEach((jointName, index) => {
				const frequency = 0.5 + index * 0.2
				const amplitude = 0.8 + Math.sin(index) * 0.3
				const offset = (index * Math.PI) / 3

				const value = Math.sin(time * frequency + offset) * amplitude
				robot.setJointValue(jointName, value)
				jointValues.value[jointName] = value
			})

			robotAnimationId = requestAnimationFrame(animate)
		}

		animate()
		ElMessage.success('动画已开始')
	}

	const stopAnimation = () => {
		isAnimating.value = false
		if (robotAnimationId) {
			cancelAnimationFrame(robotAnimationId)
			robotAnimationId = null
		}
		ElMessage.info('动画已停止')
	}

	const resetJoints = () => {
		if (!robot) return

		revoluteJoints.value.forEach((jointName) => {
			robot.setJointValue(jointName, 0)
			jointValues.value[jointName] = 0
		})

		ElMessage.success('关节已复位')
	}

	// 视角控制
	const resetView = () => {
		camera.position.set(8, -8, 6)
		camera.up.set(0, 0, 1)
		camera.lookAt(0, 0, 0)
		controls.target.set(0, 0, 0)
		controls.update()
	}

	const focusRobot = () => {
		if (robot) {
			adjustCameraView(robot)
		}
	}

	// URDF文件改变
	const onUrdfChange = () => {
		// 可以在这里添加一些逻辑
	}

	// 渲染循环
	const animate = () => {
		animationId = requestAnimationFrame(animate)
		if (controls) {
			controls.update()
		}
		if (renderer && scene && camera) {
			renderer.render(scene, camera)
		}
		if (gizmo) {
			gizmo.render()
		}
	}

	// 处理窗口大小变化
	const handleResize = () => {
		if (!containerRef.value || !camera || !renderer) return
		const width = containerRef.value.clientWidth
		const height = containerRef.value.clientHeight
		camera.aspect = width / height
		camera.updateProjectionMatrix()
		renderer.setSize(width, height)
		gizmo.update()
	}

	// 清理资源
	const cleanup = () => {
		if (animationId) {
			cancelAnimationFrame(animationId)
		}
		if (robotAnimationId) {
			cancelAnimationFrame(robotAnimationId)
		}
		if (renderer) {
			renderer.dispose()
		}
		if (controls) {
			controls.dispose()
		}
		if (gizmo) {
			gizmo.dispose()
		}

		scene?.traverse((object) => {
			if (object.geometry) {
				object.geometry.dispose()
			}
			if (object.material) {
				if (Array.isArray(object.material)) {
					object.material.forEach((material) => material.dispose())
				} else {
					object.material.dispose()
				}
			}
		})
	}

	// 组件生命周期
	onMounted(async () => {
		await nextTick()
		if (containerRef.value) {
			initThreeJS()
			window.addEventListener('resize', handleResize)
		}
	})

	onUnmounted(() => {
		window.removeEventListener('resize', handleResize)
		cleanup()
	})
</script>

<style lang="scss" scoped>
	@use './styles/index.scss';

	.loading-overlay {
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(5px);
	}

	.loading-container {
		max-width: 500px;
		width: 90%;
	}

	.loading-card {
		background: white;
		border-radius: 12px;
		padding: 30px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	}

	.loading-header {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}

	.loading-icon {
		margin-right: 15px;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #409eff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.control-panel,
	.settings-panel {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.joint-controls {
		max-height: 300px;
		overflow-y: auto;
	}

	.joint-control-item {
		display: flex;
		align-items: center;
		padding: 10px 0;
		border-bottom: 1px solid #f0f0f0;
	}

	.joint-label {
		width: 80px;
		font-size: 14px;
		font-weight: 500;
	}

	.joint-slider {
		flex: 1;
		margin: 0 15px;
	}

	.joint-value {
		width: 60px;
		text-align: right;
		font-family: monospace;
		font-size: 12px;
		color: #666;
	}

	.robot-info {
		background: #f8f9fa;
		border-radius: 8px;
		padding: 15px;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.info-label {
		font-size: 14px;
		color: #666;
	}

	.info-value {
		font-weight: 500;
		color: #333;
	}
</style>

<style lang="scss">
	.viewport-gizmo {
		top: unset !important;
		bottom: 30px;
		background-color: #6d6d6d28;
	}
</style>
