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
			<div class="control-card">
				<div class="card-header">
					<div class="card-header-left">
						<div class="header-icon">
							<el-icon><Setting /></el-icon>
						</div>
						<h3 class="header-title">机器人控制</h3>
					</div>

					<div class="header-expand" @click="leftShow = !leftShow">
						<el-icon><component :is="leftShow ? 'Minus' : 'Plus'" /></el-icon>
					</div>
				</div>
				<el-collapse-transition>
					<el-scrollbar v-show="leftShow" max-height="850px">
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
								<el-button @click="loadRobot" :loading="loading" type="primary" class="action-button" icon="Download">
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

							<!-- 机器人信息 -->
							<div v-if="robot" class="control-section">
								<div class="section-label">
									<el-icon class="label-icon"><InfoFilled /></el-icon>
									<span>机器人信息</span>
								</div>
								<div class="robot-info">
									<div class="info-item">
										<span class="info-label">关节数量</span>
										<span class="info-value">{{ jointNames.length }}</span>
									</div>
									<div class="info-item">
										<span class="info-label">连杆数量</span>
										<span class="info-value">{{ linkNames.length }}</span>
									</div>
									<div class="info-item">
										<span class="info-label">自由度</span>
										<span class="info-value">{{ revoluteJoints.length }}</span>
									</div>
								</div>
							</div>

							<!-- 动画控制 -->
							<div v-if="robot" class="control-section">
								<div class="section-label">
									<el-icon class="label-icon"><Odometer /></el-icon>
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

							<!-- <div class="control-section">
							<div class="section-label">
								<el-icon class="label-icon"><Sunny /></el-icon>
								<span>光照控制</span>
							</div>
							<el-slider
								v-model="lightIntensity"
								:min="0.1"
								:max="3"
								:step="0.1"
								@change="updateLighting"
								:show-tooltip="true"
								:format-tooltip="(val) => `${val.toFixed(1)}x`"
							/>
						</div>
						<div class="control-section">
							<div class="section-label">
								<el-icon class="label-icon"><Finished /></el-icon>
								<span>阴影质量</span>
							</div>
							<el-select v-model="shadowQuality" @change="updateShadowQuality">
								<el-option label="低" value="low" />
								<el-option label="中" value="medium" />
								<el-option label="高" value="high" />
							</el-select>
						</div> -->
						</div>
					</el-scrollbar>
				</el-collapse-transition>
			</div>
		</div>

		<!-- 其他配置 -->
		<div class="control-panel absolute top-6 right-6 z-5">
			<div class="control-card">
				<div class="card-header">
					<div class="card-header-left">
						<div class="header-icon">
							<el-icon><Setting /></el-icon>
						</div>
						<h3 class="header-title">环境控制</h3>
					</div>

					<div class="header-expand" @click="rightShow = !rightShow">
						<el-icon><component :is="rightShow ? 'Minus' : 'Plus'" /></el-icon>
					</div>
				</div>
				<el-collapse-transition>
					<el-scrollbar v-show="rightShow" max-height="850px">
						<div class="card-content">
							<div class="control-section">
								<div class="section-label">
									<el-icon class="label-icon"><Sunny /></el-icon>
									<span>光照控制</span>
								</div>
								<el-slider
									v-model="lightIntensity"
									:min="0.1"
									:max="3"
									:step="0.1"
									@change="updateLighting"
									:show-tooltip="true"
									:format-tooltip="(val) => `${val.toFixed(1)}x`"
								/>
							</div>
							<div class="control-section">
								<div class="section-label">
									<el-icon class="label-icon"><Finished /></el-icon>
									<span>阴影质量</span>
								</div>
								<el-select v-model="shadowQuality" @change="updateShadowQuality">
									<el-option label="低" value="low" />
									<el-option label="中" value="medium" />
									<el-option label="高" value="high" />
								</el-select>
							</div>
						</div>
					</el-scrollbar>
				</el-collapse-transition>
			</div>
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

	const leftShow = ref(true)
	const rightShow = ref(true)

	// 响应式数据
	const containerRef = ref(null)
	const loading = ref(false)
	const loadingProgress = ref(0)
	const loadingText = ref('准备加载机器人...')
	const lightIntensity = ref(2)
	const shadowQuality = ref('high')
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
			label: 'R2000iC-165F',
			value: 'robot.urdf'
		}
	])

	// Three.js 相关变量
	let scene, camera, renderer, controls, gizmo, robot
	let animationId = null
	let robotAnimationId = null
	let lights = []
	let mainLight = null

	// 阴影质量配置
	const shadowConfigs = {
		low: { mapSize: 1024, bias: -0.001 },
		medium: { mapSize: 2048, bias: -0.0005 },
		high: { mapSize: 4096, bias: -0.0001 }
	}

	// 初始化Three.js场景
	const initThreeJS = () => {
		scene = new THREE.Scene()
		scene.background = new THREE.Color('#f0f0f0')

		// 创建地面 - 使用支持光照的材质
		const groundGeometry = new THREE.BoxGeometry(30, 30, 0.5)
		const groundMaterial = new THREE.MeshLambertMaterial({
			color: '#f5f5f5',
			transparent: true,
			opacity: 0.8
		})
		const ground = new THREE.Mesh(groundGeometry, groundMaterial)
		ground.position.z = -0.25
		ground.receiveShadow = true // 接收阴影
		scene.add(ground)

		// 网格
		const grid = new THREE.GridHelper(30, 12, '#ffffff', '#ffffff')
		grid.material.opacity = 1
		grid.material.depthWrite = false
		grid.material.transparent = true
		grid.rotateX(Math.PI / 2)
		scene.add(grid)

		// 相机设置
		const aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
		camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
		camera.position.set(8, -8, 6)
		camera.up.set(0, 0, 1)
		camera.lookAt(0, 0, 0)

		// 渲染器设置 - 启用阴影
		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		})
		renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFSoftShadowMap // 使用软阴影
		renderer.outputEncoding = THREE.sRGBEncoding
		renderer.toneMapping = THREE.ReinhardToneMapping
		renderer.toneMappingExposure = 1.2
		containerRef.value.appendChild(renderer.domElement)

		// 控制器设置
		controls = new OrbitControls(camera, renderer.domElement)
		controls.enableDamping = true
		controls.dampingFactor = 0.05
		controls.minDistance = 0.5
		controls.maxDistance = 1000
		controls.target.set(0, 0, 0)
		controls.enablePan = true
		controls.mouseButtons = {
			LEFT: THREE.MOUSE.ROTATE,
			MIDDLE: THREE.MOUSE.PAN,
			RIGHT: null
		}
		controls.panSpeed = 0.7

		// 视角小工具
		gizmo = new ViewportGizmo(camera, renderer, {
			placement: 'bottom-right',
			offset: {
				right: 22,
				bottom: 22
			},
			background: {
				color: '#F0F0F0',
				opacity: 0.6,
				hover: {
					color: 0xffffff,
					opacity: 0.6
				}
			}
		})
		gizmo.attachControls(controls)

		// 设置光照系统
		setupLights()

		// 开始渲染循环
		animate()
	}

	// 设置光照系统 - 优化阴影效果
	const setupLights = () => {
		lights.forEach((light) => scene.remove(light))
		lights = []

		// 环境光 - 提供基础照明
		const ambientLight = new THREE.AmbientLight(0x404040, lightIntensity.value * 0.4)
		scene.add(ambientLight)
		lights.push(ambientLight)

		// 主光源 - 投射阴影
		mainLight = new THREE.DirectionalLight(0xffffff, lightIntensity.value * 0.8)
		mainLight.position.set(10, 10, 8)
		mainLight.castShadow = true

		// 设置阴影质量
		const config = shadowConfigs[shadowQuality.value]
		mainLight.shadow.mapSize.width = config.mapSize
		mainLight.shadow.mapSize.height = config.mapSize
		mainLight.shadow.camera.near = 0.1
		mainLight.shadow.camera.far = 50
		mainLight.shadow.camera.left = -15
		mainLight.shadow.camera.right = 15
		mainLight.shadow.camera.top = 15
		mainLight.shadow.camera.bottom = -15
		mainLight.shadow.bias = config.bias
		scene.add(mainLight)
		lights.push(mainLight)

		// 辅助光源 - 不投射阴影，用于补光
		const fillLight = new THREE.DirectionalLight(0xffffff, lightIntensity.value * 0.3)
		fillLight.position.set(-8, -8, 6)
		scene.add(fillLight)
		lights.push(fillLight)

		// 背光 - 增强轮廓
		const backLight = new THREE.DirectionalLight(0xffffff, lightIntensity.value * 0.2)
		backLight.position.set(0, -15, 2)
		scene.add(backLight)
		lights.push(backLight)

		// 天空光 - 模拟天空散射
		const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, lightIntensity.value * 0.3)
		scene.add(hemisphereLight)
		lights.push(hemisphereLight)
	}

	// 更新光照
	const updateLighting = () => {
		setupLights()
	}

	// 更新阴影质量
	const updateShadowQuality = () => {
		if (mainLight) {
			const config = shadowConfigs[shadowQuality.value]
			mainLight.shadow.mapSize.width = config.mapSize
			mainLight.shadow.mapSize.height = config.mapSize
			mainLight.shadow.bias = config.bias
			mainLight.shadow.needsUpdate = true
		}
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
						const material = new THREE.MeshLambertMaterial({
							color: 0x888888,
							shininess: 30,
							specular: 0x222222
						})
						const mesh = new THREE.Mesh(geometry, material)
						mesh.castShadow = true
						mesh.receiveShadow = true
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

					// 模型处理
					processRobotModel(robot)

					setTimeout(() => {
						// 调整相机视角
						adjustCameraView(robot)
						loadingProgress.value = 100
						loadingText.value = '加载完成！'
						setTimeout(() => {
							loading.value = false
							ElMessage.success(`机器人加载成功！找到 ${jointNames.value.length} 个关节`)
						}, 1000)
					}, 500)
				},
				(progress) => {
					// 加载进度回调
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

	// 处理机器人模型 - 添加阴影设置
	const processRobotModel = (robotModel) => {
		// 单位转换：mm -> m 然后缩放
		robotModel.scale.multiplyScalar(0.001 * 3)

		// 应用材质和阴影设置
		robotModel.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true // 投射阴影
				child.receiveShadow = true // 接收阴影

				if (child.material) {
					const materials = Array.isArray(child.material) ? child.material : [child.material]
					materials.forEach((mat) => {
						enhanceMaterial(mat)
						// 确保材质支持阴影
						if (mat.type === 'MeshBasicMaterial') {
							// 将基础材质替换为支持光照的材质
							const newMat = new THREE.MeshLambertMaterial({
								color: mat.color,
								transparent: mat.transparent,
								opacity: mat.opacity
							})
							child.material = newMat
						}
					})
				}
			}
		})
	}

	// 材质增强 - 确保材质支持光照
	const enhanceMaterial = (material) => {
		// 如果是基础材质，需要有光照计算才能显示阴影
		if (material.type === 'MeshBasicMaterial') {
			return // 在processRobotModel中会被替换
		}

		if (material.emissive && material.emissive.getHex() === 0x000000) {
			if (material.color) {
				material.emissive.setRGB(material.color.r * 0.02, material.color.g * 0.02, material.color.b * 0.02)
			}
		}

		if (material.shininess !== undefined && material.shininess === 0) {
			material.shininess = 60
		}

		// 确保材质接收阴影
		material.needsUpdate = true

		if (material.transparent === undefined) {
			material.transparent = false
		}
	}

	// 应用默认材质
	const applyDefaultMaterials = (object) => {
		const colors = [0x888888, 0x666666, 0xaaaaaa, 0x999999, 0x777777]

		object.traverse((child) => {
			if (child.isMesh) {
				const randomColor = colors[Math.floor(Math.random() * colors.length)]
				child.material = new THREE.MeshLambertMaterial({
					color: randomColor,
					shininess: 60
				})
				child.castShadow = true
				child.receiveShadow = true
			}
		})
	}

	// 模型增强
	const enhanceModel = (object) => {
		object.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true
				child.receiveShadow = true

				if (child.material) {
					const material = child.material
					if (Array.isArray(material)) {
						material.forEach((mat) => enhanceMaterial(mat))
					} else {
						enhanceMaterial(material)
					}
				}
			}
		})
	}

	// 调整相机视角
	const adjustCameraView = (robotModel) => {
		const box = new THREE.Box3().setFromObject(robotModel)
		const center = box.getCenter(new THREE.Vector3())
		const size = box.getSize(new THREE.Vector3())

		const fov = camera.fov * (Math.PI / 180)
		const maxDimAfterScale = Math.max(size.x, size.y, size.z)
		let cameraDistance = Math.abs(maxDimAfterScale / 2 / Math.tan(fov / 2))
		cameraDistance *= 1.8

		// 保持固定的CAD视角方向 (8, -8, 6)
		const direction = new THREE.Vector3(8, -8, 6).normalize()

		// 设置新位置：模型中心 + 方向 * 距离
		camera.position.copy(center).add(direction.multiplyScalar(cameraDistance))
		camera.up.set(0, 0, 1)
		camera.lookAt(center.x, center.y, center.z)
		controls.target.copy(center)
		controls.update()
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
	@use '../3dModel/styles/index.scss';

	.joint-controls {
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
		background: #f0f0f0;
		border-radius: 8px;
		padding: 15px;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.info-item:last-child {
		margin-bottom: 0;
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
