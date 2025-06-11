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
						<h3 class="loading-title">模型加载中</h3>
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

					<div class="model-list" v-if="modelConfigs.length > 0">
						<div class="list-header">
							<span class="list-title">模型列表</span>
							<span class="list-count"
								>{{ modelConfigs.filter((m) => m.status === 'success').length }} / {{ modelConfigs.length }}</span
							>
						</div>
						<div class="list-content">
							<div
								v-for="(model, index) in modelConfigs"
								:key="index"
								class="model-item"
								:class="getModelItemClass(model.status)"
							>
								<div class="model-status-icon">
									<el-icon class="status-icon">
										<Loading v-if="model.status === 'loading'" />
										<Check v-else-if="model.status === 'success'" />
										<Close v-else-if="model.status === 'error'" />
										<Clock v-else />
									</el-icon>
								</div>
								<span class="model-name">{{ model.name }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 模型控制面板 -->
		<div class="control-panel absolute top-6 left-6 z-5">
			<el-scrollbar height="800px">
				<div class="control-card">
					<div class="card-header">
						<div class="header-icon">
							<el-icon><Setting /></el-icon>
						</div>
						<h3 class="header-title">模型控制</h3>
					</div>

					<div class="card-content">
						<!-- 导入方式选择 -->
						<div class="control-section">
							<div class="section-label">
								<el-icon class="label-icon"><FolderOpened /></el-icon>
								<span>导入方式</span>
							</div>
							<el-radio-group v-model="importType" @change="onImportTypeChange" class="import-radio-group">
								<el-radio-button value="preset" class="mr-2">预设文件夹</el-radio-button>
								<el-radio-button value="local">本地文件夹</el-radio-button>
							</el-radio-group>
						</div>

						<!-- 预设文件夹选择 -->
						<div v-if="importType === 'preset'" class="control-section">
							<div class="section-label">
								<el-icon class="label-icon"><Folder /></el-icon>
								<span>预设文件夹</span>
							</div>
							<el-select
								v-model="selectedFolder"
								@change="onFolderChange"
								:disabled="loading"
								placeholder="选择文件夹"
								class="full-width-select"
							>
								<el-option
									v-for="folder in availableFolders"
									:key="folder.value"
									:label="folder.label"
									:value="folder.value"
								/>
							</el-select>
							<el-button
								@click="loadFolderModels"
								:loading="loading"
								type="primary"
								class="action-button"
								icon="Download"
							>
								加载预设模型
							</el-button>
						</div>

						<!-- 本地文件夹导入 -->
						<div v-if="importType === 'local'" class="control-section">
							<div class="section-label">
								<el-icon class="label-icon"><Folder /></el-icon>
								<span>本地文件夹</span>
							</div>
							<input
								ref="folderInputRef"
								type="file"
								webkitdirectory
								multiple
								accept=".obj,.mtl,.png,.jpg,.jpeg,.bmp,.tga"
								@change="onLocalFolderSelect"
								style="display: none"
							/>
							<el-button @click="selectLocalFolder" :disabled="loading" class="select-folder-button" icon="Upload">
								选择文件夹
							</el-button>

							<div v-if="selectedLocalFolder" class="folder-info">
								<div class="info-item">
									<el-icon class="info-icon"><Folder /></el-icon>
									<span class="info-text">{{ selectedLocalFolder.name }}</span>
								</div>
								<div class="info-item">
									<el-icon class="info-icon"><Document /></el-icon>
									<span class="info-text">{{ localModelFiles.length }} 个模型文件</span>
								</div>
							</div>

							<el-button
								v-if="selectedLocalFolder || localModelFiles.length"
								@click="loadLocalFolderModels"
								:loading="loading"
								type="primary"
								class="action-button"
								icon="Download"
							>
								加载本地模型
							</el-button>
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

						<!-- 当前加载的模型列表 -->
						<div v-if="loadedModels.length > 0" class="control-section">
							<div class="section-label">
								<el-icon class="label-icon"><View /></el-icon>
								<span>当前模型</span>
								<el-tag size="small" class="model-count-tag">{{ loadedModels.length }}</el-tag>
							</div>
							<div class="current-model-list">
								<div
									v-for="(model, index) in loadedModels"
									:key="index"
									class="current-model-item"
									:class="{ selected: selectedModel?.name === model.name }"
									@click="selectModelFromList(model)"
								>
									<div class="model-indicator" :style="{ backgroundColor: getModelDisplayColor(model) }"></div>
									<span class="model-name">{{ model.name }}</span>
									<el-icon class="model-arrow"><ArrowRight /></el-icon>
								</div>
							</div>
						</div>

						<!-- 机器人控制 -->
						<div class="robot-controls">
							<el-button
								@click="makeRobotMovable"
								type="primary"
								:disabled="hasRobot"
								:loading="robotLoading"
								class="w-full"
								icon="VideoPlay"
							>
								开启机器人仿真
							</el-button>
							<el-button @click="clearRobot" type="warning" :disabled="!hasRobot" class="w-full" icon="RefreshRight">
								恢复静态模型
							</el-button>
						</div>
					</div>
				</div>
			</el-scrollbar>
		</div>

		<!-- 右侧模型设置面板 -->
		<div v-if="selectedModel" class="settings-panel absolute top-6 right-6 z-5">
			<div class="settings-card">
				<div class="settings-header">
					<div class="header-content">
						<div class="header-icon">
							<el-icon><Tools /></el-icon>
						</div>
						<div class="header-text">
							<h3 class="header-title">{{ selectedModel.name }}</h3>
						</div>
					</div>
					<el-button @click="deselectModel" size="small" type="info" circle class="close-button">
						<el-icon><Close /></el-icon>
					</el-button>
				</div>

				<div class="settings-content">
					<!-- 显示控制 -->
					<div class="setting-section">
						<div class="setting-label">
							<el-icon class="setting-icon"><View /></el-icon>
							<span>显示设置</span>
						</div>
						<div class="setting-control">
							<el-switch
								v-model="selectedModel.visible"
								@change="toggleSelectedModelVisibility"
								size="default"
								active-text="显示"
								inactive-text="隐藏"
							/>
						</div>
					</div>

					<!-- 颜色控制 -->
					<div class="setting-section">
						<div class="setting-label">
							<el-icon class="setting-icon"><Brush /></el-icon>
							<span>颜色设置</span>
						</div>
						<div class="setting-control">
							<div class="color-controls">
								<el-color-picker
									v-model="selectedModelColor"
									@change="onModelColorChange"
									:predefine="predefinedColors"
								/>
								<el-button @click="resetModelColor" type="info" class="reset-color-btn"> 重置 </el-button>
							</div>
						</div>
					</div>
					<!-- 空间位置控制 -->
					<div class="setting-section">
						<div class="setting-label">
							<el-icon class="setting-icon"><Location /></el-icon>
							<span>空间位置</span>
						</div>
						<div class="setting-control">
							<div class="position-controls">
								<div class="position-row">
									<span class="position-label">X</span>
									<el-input-number
										v-model="selectedModelPosition.x"
										:precision="2"
										:step="0.1"
										size="small"
										@change="onModelPositionChange"
										class="position-input"
										controls-position="right"
									/>
								</div>
								<div class="position-row">
									<span class="position-label">Y</span>
									<el-input-number
										v-model="selectedModelPosition.y"
										:precision="2"
										:step="0.1"
										size="small"
										@change="onModelPositionChange"
										class="position-input"
										controls-position="right"
									/>
								</div>
								<div class="position-row">
									<span class="position-label">Z</span>
									<el-input-number
										v-model="selectedModelPosition.z"
										:precision="2"
										:step="0.1"
										size="small"
										@change="onModelPositionChange"
										class="position-input"
										controls-position="right"
									/>
								</div>
							</div>
						</div>
					</div>

					<!-- 操作按钮 -->
					<div class="setting-section">
						<div class="setting-label">
							<el-icon class="setting-icon"><Operation /></el-icon>
							<span>操作</span>
						</div>
						<div class="setting-actions">
							<el-button @click="focusOnModel" type="primary" icon="ZoomIn" class="action-btn"> 聚焦 </el-button>
							<el-button @click="deleteModel" type="danger" icon="Delete" class="action-btn"> 删除 </el-button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Three.js 渲染容器 -->
		<div ref="containerRef" class="w-full h-full"></div>
	</div>
</template>

<script setup>
	import { ElMessage, ElMessageBox } from 'element-plus'
	import * as THREE from 'three'
	import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
	import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
	import { ViewportGizmo } from 'three-viewport-gizmo'
	import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
	import URDFLoader from 'urdf-loader'

	// 响应式数据
	const containerRef = ref(null)
	const folderInputRef = ref(null)
	const loading = ref(false)
	const loadingProgress = ref(0)
	const loadingText = ref('准备加载模型...')
	const loadedModels = ref([])
	const lightIntensity = ref(1.5)
	const selectedFolder = ref('R2000iC-165F')
	const modelConfigs = ref([])
	// 鼠标状态跟踪
	const mouseDownPos = ref({ x: 0, y: 0 })
	const isDragging = ref(false)
	const selectedModelPosition = ref({ x: 0, y: 0, z: 0 })

	// 导入方式和本地文件夹相关
	const importType = ref('preset')
	const selectedLocalFolder = ref(null)
	const localModelFiles = ref([])
	const fileUrlMap = ref(new Map())

	// 模型选择和交互相关
	const selectedModel = ref(null)
	const hoveredModel = ref(null)
	const selectedModelColor = ref('#ffffff')

	// 预定义颜色
	const predefinedColors = [
		'#ff4500',
		'#ff8c00',
		'#ffd700',
		'#90ee90',
		'#00ced1',
		'#1e90ff',
		'#c71585',
		'#ff1493',
		'#dda0dd',
		'#98fb98'
	]

	// Three.js 相关变量
	let scene, camera, renderer, controls, gizmo
	let animationId = null
	let modelGroup = null
	let lights = []
	let modelCenter = new THREE.Vector3(0, 0, 0)
	let raycaster = new THREE.Raycaster()
	let mouse = new THREE.Vector2()

	// 模型原始材质存储
	const originalMaterials = new Map()
	const customColorMaterials = new Map() // 存储自定义颜色材质
	const highlightMaterial = new THREE.MeshPhongMaterial({
		color: 0x90ee90, // 浅绿色
		transparent: true,
		opacity: 0.8,
		emissive: 0x004400
	})

	// 可用的预设模型文件夹配置
	const availableFolders = ref([
		{
			label: 'R2000iC-165F',
			value: 'R2000iC-165F',
			globPattern: './models/R2000iC-165F/*'
		},
		{
			label: 'PipeBender01',
			value: 'PipeBender01',
			globPattern: './models/PipeBender01/*'
		},
		{
			label: '机器人底座',
			value: '机器人底座',
			globPattern: './models/机器人底座/*'
		},
		{
			label: '套筒夹持器',
			value: '套筒夹持器',
			globPattern: './models/套筒夹持器/*'
		}
	])

	// 获取模型显示颜色
	const getModelDisplayColor = (model) => {
		if (!model.object) return '#888888'

		// 优先检查是否有自定义颜色
		if (customColorMaterials.has(model.name)) {
			const customMaterial = customColorMaterials.get(model.name)
			return `#${customMaterial.color.getHexString()}`
		}

		// 统计颜色分布
		const colorStats = new Map() // 颜色 -> { count: mesh数量, vertices: 顶点数 }

		model.object.traverse((child) => {
			if (child.isMesh && child.material) {
				const materials = Array.isArray(child.material) ? child.material : [child.material]

				materials.forEach((material) => {
					if (material.color) {
						const hexColor = material.color.getHexString()
						const vertexCount = child.geometry ? child.geometry.attributes.position?.count || 0 : 0

						if (colorStats.has(hexColor)) {
							const stats = colorStats.get(hexColor)
							stats.count += 1
							stats.vertices += vertexCount
						} else {
							colorStats.set(hexColor, {
								count: 1,
								vertices: vertexCount
							})
						}
					}
				})
			}
		})

		if (colorStats.size === 0) return '#888888'

		// 按顶点数判断（更精确）
		let maxVertices = 0
		let dominantColor = '#888888'

		for (const [color, stats] of colorStats) {
			if (stats.vertices > maxVertices) {
				maxVertices = stats.vertices
				dominantColor = color
			}
		}

		// 如果顶点数都是0，则按mesh数量判断
		if (maxVertices === 0) {
			let maxCount = 0
			for (const [color, stats] of colorStats) {
				if (stats.count > maxCount) {
					maxCount = stats.count
					dominantColor = color
				}
			}
		}

		return `#${dominantColor}`
	}

	// 获取模型项样式类
	const getModelItemClass = (status) => {
		return {
			'status-loading': status === 'loading',
			'status-success': status === 'success',
			'status-error': status === 'error',
			'status-pending': status === 'pending'
		}
	}

	// 导入方式改变处理
	const onImportTypeChange = (type) => {
		clearCurrentModels()
		deselectModel()
		if (type === 'local') {
			clearLocalFolderData()
		}
	}

	// 选择本地文件夹
	const selectLocalFolder = () => {
		folderInputRef.value?.click()
	}

	// 从列表中选择模型
	const selectModelFromList = (model) => {
		selectModel(model)
	}

	// 选择模型
	const selectModel = (model) => {
		// 如果点击的是已选中的模型，不做任何操作
		if (selectedModel.value === model) {
			return
		}

		// 先清除之前的选中状态
		if (selectedModel.value) {
			restoreModelMaterial(selectedModel.value)
		}

		selectedModel.value = model

		// 应用选中效果
		applySelectedEffect(model)

		// 更新选中模型的颜色
		selectedModelColor.value = getModelDisplayColor(model)

		// 读取实际位置
		updateSelectedModelPosition(model)
	}

	// 取消选择模型
	const deselectModel = () => {
		if (selectedModel.value) {
			restoreModelMaterial(selectedModel.value)
			selectedModel.value = null
		}
		selectedModelPosition.value = { x: 0, y: 0, z: 0 }
	}

	// 应用选中效果
	const applySelectedEffect = (model) => {
		if (!model.object) return

		model.object.traverse((child) => {
			if (child.isMesh && child.material) {
				// 保存原始材质
				if (!originalMaterials.has(child.uuid)) {
					const originalMat = Array.isArray(child.material)
						? child.material.map((mat) => mat.clone())
						: child.material.clone()
					originalMaterials.set(child.uuid, originalMat)
				}

				// 获取基础材质
				let baseMaterial
				if (customColorMaterials.has(model.name)) {
					baseMaterial = customColorMaterials.get(model.name)
				} else {
					const originalMat = originalMaterials.get(child.uuid)
					baseMaterial = Array.isArray(originalMat) ? originalMat[0] : originalMat
				}

				// 创建选中效果材质
				const selectedMaterial = baseMaterial.clone()
				if (selectedMaterial.color) {
					// 方法1: 颜色变亮 + 发光
					// selectedMaterial.color.multiplyScalar(1.4) // 变亮40%
					// selectedMaterial.emissive.setRGB(
					// 	baseMaterial.color.r * 0.2,
					// 	baseMaterial.color.g * 0.2,
					// 	baseMaterial.color.b * 0.2
					// )

					// 方法2: 如果效果不明显，可以尝试这个更强烈的效果
					// selectedMaterial.color.lerp(new THREE.Color(0xffffff), 0.3) // 向白色混合
					selectedMaterial.emissive.setRGB(0.1, 0.1, 0.1) // 整体发光
				}
				child.material = selectedMaterial
			}
		})
	}

	// 应用选中 + 悬停效果
	const applySelectedHoverEffect = (model) => {
		if (!model.object) return

		model.object.traverse((child) => {
			if (child.isMesh && child.material) {
				// 获取基础材质
				let baseMaterial
				if (customColorMaterials.has(model.name)) {
					baseMaterial = customColorMaterials.get(model.name)
				} else {
					const originalMat = originalMaterials.get(child.uuid)
					baseMaterial = Array.isArray(originalMat) ? originalMat[0] : originalMat
				}

				// 创建选中+悬停效果材质（最强高亮）
				const selectedHoverMaterial = baseMaterial.clone()
				if (selectedHoverMaterial.color) {
					selectedHoverMaterial.color.multiplyScalar(1.2) // 变亮20%
					selectedHoverMaterial.emissive.setRGB(
						baseMaterial.color.r * 0.3,
						baseMaterial.color.g * 0.3,
						baseMaterial.color.b * 0.3
					)
				}

				child.material = selectedHoverMaterial
			}
		})
	}

	// 应用悬停效果
	const applyHoverEffect = (model) => {
		if (!model.object) return

		model.object.traverse((child) => {
			if (child.isMesh) {
				// 保存原始材质
				if (!originalMaterials.has(child.uuid)) {
					const originalMat = Array.isArray(child.material)
						? child.material.map((mat) => mat.clone())
						: child.material.clone()
					originalMaterials.set(child.uuid, originalMat)
				}

				// 应用高亮材质
				child.material = highlightMaterial
			}
		})
	}

	// 恢复模型材质
	const restoreModelMaterial = (model) => {
		if (!model.object) return

		model.object.traverse((child) => {
			if (child.isMesh) {
				// 优先使用自定义颜色材质
				if (customColorMaterials.has(model.name)) {
					child.material = customColorMaterials.get(model.name).clone()
				} else if (originalMaterials.has(child.uuid)) {
					// 否则恢复原始材质
					const originalMat = originalMaterials.get(child.uuid)
					if (Array.isArray(originalMat)) {
						child.material = originalMat.map((mat) => mat.clone())
					} else {
						child.material = originalMat.clone()
					}
				}
			}
		})
	}

	// 鼠标按下处理
	const onMouseDown = (event) => {
		if (!containerRef.value) return

		const rect = containerRef.value.getBoundingClientRect()
		mouseDownPos.value = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		}
		isDragging.value = false
	}

	// 鼠标移动处理
	const onMouseMove = (event) => {
		if (!containerRef.value) return

		const rect = containerRef.value.getBoundingClientRect()
		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

		raycaster.setFromCamera(mouse, camera)
		const intersects = raycaster.intersectObjects(modelGroup.children, true)

		// 清除之前的悬停效果
		if (hoveredModel.value) {
			if (hoveredModel.value === selectedModel.value) {
				// 如果悬停的是选中模型，恢复到选中状态
				applySelectedEffect(hoveredModel.value)
			} else {
				// 如果悬停的是非选中模型，恢复到正常状态
				restoreModelMaterial(hoveredModel.value)
			}
			hoveredModel.value = null
		}

		if (intersects.length > 0) {
			// 找到对应的模型
			const intersectedObject = intersects[0].object
			let targetModel = null

			for (const model of loadedModels.value) {
				if (model.object && (model.object === intersectedObject || model.object.children.includes(intersectedObject))) {
					targetModel = model
					break
				}

				let found = false
				model.object?.traverse((child) => {
					if (child === intersectedObject) {
						targetModel = model
						found = true
					}
				})
				if (found) break
			}

			if (targetModel) {
				hoveredModel.value = targetModel

				// if (targetModel === selectedModel.value) {
				// 	// 选中模型的悬停效果：在选中效果基础上再加高亮
				// 	applySelectedHoverEffect(targetModel)
				// } else {
				// 	// 非选中模型的悬停效果
				// 	applyHoverEffect(targetModel)
				// }

				applyHoverEffect(targetModel)

				containerRef.value.style.cursor = 'pointer'
			}
		} else {
			containerRef.value.style.cursor = 'grab'
		}
	}

	// 鼠标点击处理
	const onMouseClick = (event) => {
		if (!containerRef.value) return

		const rect = containerRef.value.getBoundingClientRect()
		const currentPos = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		}

		// 计算鼠标移动距离
		const deltaX = Math.abs(currentPos.x - mouseDownPos.value.x)
		const deltaY = Math.abs(currentPos.y - mouseDownPos.value.y)
		const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

		// 如果移动距离大于5像素，认为是拖拽，不处理点击
		if (moveDistance > 5) {
			return
		}

		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

		raycaster.setFromCamera(mouse, camera)
		const intersects = raycaster.intersectObjects(modelGroup.children, true)

		if (intersects.length > 0) {
			const intersectedObject = intersects[0].object
			let targetModel = null

			for (const model of loadedModels.value) {
				if (model.object && (model.object === intersectedObject || model.object.children.includes(intersectedObject))) {
					targetModel = model
					break
				}

				let found = false
				model.object?.traverse((child) => {
					if (child === intersectedObject) {
						targetModel = model
						found = true
					}
				})
				if (found) break
			}

			if (targetModel) {
				selectModel(targetModel)
			}
		} else {
			deselectModel()
		}
	}

	// 切换选中模型可见性
	const toggleSelectedModelVisibility = () => {
		if (selectedModel.value) {
			selectedModel.value.object.visible = selectedModel.value.visible
		}
	}

	// 模型颜色改变
	const onModelColorChange = (color) => {
		if (!selectedModel.value || !color) return

		// 创建新的简单材质，忽略MTL复杂属性
		const newColor = new THREE.Color(color)
		const customMaterial = new THREE.MeshPhongMaterial({
			color: newColor,
			shininess: 30,
			specular: 0x222222,
			transparent: false,
			opacity: 1
		})

		// 保存自定义材质
		customColorMaterials.set(selectedModel.value.name, customMaterial)

		// 应用新材质到模型的所有网格
		selectedModel.value.object.traverse((child) => {
			if (child.isMesh) {
				// 如果还没有保存原始材质，先保存
				if (!originalMaterials.has(child.uuid)) {
					const originalMat = Array.isArray(child.material)
						? child.material.map((mat) => mat.clone())
						: child.material.clone()
					originalMaterials.set(child.uuid, originalMat)
				}

				// 应用新的颜色材质
				child.material = customMaterial.clone()
			}
		})

		// 重新应用选中效果
		// setTimeout(() => {
		// 	applySelectedEffect(selectedModel.value)
		// }, 10)
	}

	// 重置模型颜色
	const resetModelColor = () => {
		if (!selectedModel.value) return

		// 清除自定义颜色材质
		customColorMaterials.delete(selectedModel.value.name)

		// 恢复原始材质
		restoreModelMaterial(selectedModel.value)

		// 重新应用选中效果
		setTimeout(() => {
			applySelectedEffect(selectedModel.value)
			selectedModelColor.value = getModelDisplayColor(selectedModel.value)
		}, 10)
	}

	// 聚焦到模型
	const focusOnModel = () => {
		if (!selectedModel.value?.object) return

		const box = new THREE.Box3().setFromObject(selectedModel.value.object)
		const center = box.getCenter(new THREE.Vector3())
		const size = box.getSize(new THREE.Vector3())

		const maxDim = Math.max(size.x, size.y, size.z)
		const fov = camera.fov * (Math.PI / 180)
		let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2))
		cameraDistance *= 2

		camera.position.set(center.x + cameraDistance, center.y + cameraDistance, center.z + cameraDistance)
		camera.lookAt(center.x, center.y, center.z)
		controls.target.set(center.x, center.y, center.z)
		controls.update()
	}

	// 删除模型
	const deleteModel = async () => {
		if (!selectedModel.value) return

		try {
			await ElMessageBox.confirm(`确定要删除模型 "${selectedModel.value.name}" 吗？`, '确认删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})

			const modelName = selectedModel.value.name

			// 从场景中移除
			if (selectedModel.value.object) {
				// 确保从正确的父对象中移除
				if (selectedModel.value.object.parent) {
					selectedModel.value.object.parent.remove(selectedModel.value.object)
				} else {
					modelGroup.remove(selectedModel.value.object)
				}

				// 清理资源
				selectedModel.value.object.traverse((child) => {
					if (child.geometry) child.geometry.dispose()
					if (child.material) {
						if (Array.isArray(child.material)) {
							child.material.forEach((mat) => mat.dispose())
						} else {
							child.material.dispose()
						}
					}
					// 清理原始材质缓存
					if (originalMaterials.has(child.uuid)) {
						originalMaterials.delete(child.uuid)
					}
				})
			}

			// 清理自定义颜色材质
			if (customColorMaterials.has(modelName)) {
				customColorMaterials.delete(modelName)
			}

			// 从加载的模型列表中移除
			const index = loadedModels.value.findIndex((m) => m === selectedModel.value)
			if (index > -1) {
				loadedModels.value.splice(index, 1)
			}

			ElMessage.success(`模型 "${modelName}" 已删除`)
			selectedModel.value = null
		} catch (error) {
			// 用户取消删除
		}
	}

	// 本地文件夹选择处理
	const onLocalFolderSelect = (event) => {
		const files = Array.from(event.target.files)
		if (files.length === 0) return

		clearFileUrls()

		const folderName = files[0].webkitRelativePath.split('/')[0]
		const objFiles = files.filter((file) => file.name.toLowerCase().endsWith('.obj'))
		const mtlFiles = files.filter((file) => file.name.toLowerCase().endsWith('.mtl'))
		const textureFiles = files.filter((file) => {
			const ext = file.name.toLowerCase()
			return (
				ext.endsWith('.png') ||
				ext.endsWith('.jpg') ||
				ext.endsWith('.jpeg') ||
				ext.endsWith('.bmp') ||
				ext.endsWith('.tga')
			)
		})

		console.log(`找到 ${objFiles.length} 个OBJ文件, ${mtlFiles.length} 个MTL文件, ${textureFiles.length} 个纹理文件`)

		const urlMap = new Map()
		files.forEach((file) => {
			const url = URL.createObjectURL(file)
			urlMap.set(file.webkitRelativePath, {
				file: file,
				url: url,
				name: file.name
			})
		})

		const modelConfigs = []
		objFiles.forEach((objFile) => {
			const baseName = objFile.name.replace('.obj', '')
			const objPath = objFile.webkitRelativePath

			const correspondingMtl = mtlFiles.find((mtlFile) => mtlFile.name.replace('.mtl', '') === baseName)

			modelConfigs.push({
				name: baseName,
				objFile: objFile,
				mtlFile: correspondingMtl || null,
				objPath: objPath,
				mtlPath: correspondingMtl ? correspondingMtl.webkitRelativePath : null,
				status: 'pending'
			})
		})

		selectedLocalFolder.value = {
			name: folderName,
			files: files,
			urlMap: urlMap
		}
		localModelFiles.value = modelConfigs
		fileUrlMap.value = urlMap

		console.log('本地文件夹分析完成:', {
			folderName,
			modelCount: modelConfigs.length,
			models: modelConfigs.map((m) => m.name)
		})

		ElMessage.success(`文件夹分析完成，找到 ${modelConfigs.length} 个模型`)
	}

	// 清理文件URL
	const clearFileUrls = () => {
		fileUrlMap.value.forEach((fileData) => {
			URL.revokeObjectURL(fileData.url)
		})
		fileUrlMap.value.clear()
	}

	// 清理本地文件夹数据
	const clearLocalFolderData = () => {
		clearFileUrls()
		selectedLocalFolder.value = null
		localModelFiles.value = []
	}

	// 从预设文件夹获取所有模型文件
	const getModelsFromFolder = async (globPattern) => {
		const models = []

		try {
			const objGlob = import.meta.glob('./models/**/*.obj', { query: '?url', import: 'default' })
			const mtlGlob = import.meta.glob('./models/**/*.mtl', { query: '?url', import: 'default' })

			const folderPath = globPattern.replace('/*', '/')
			const objFiles = Object.keys(objGlob).filter((path) => path.startsWith(folderPath))
			const mtlFiles = Object.keys(mtlGlob).filter((path) => path.startsWith(folderPath))

			for (const objPath of objFiles) {
				const fileName = objPath.split('/').pop().replace('.obj', '')
				const correspondingMtl = mtlFiles.find((mtlPath) => mtlPath.split('/').pop().replace('.mtl', '') === fileName)

				const objUrl = await objGlob[objPath]()
				const mtlUrl = correspondingMtl ? await mtlGlob[correspondingMtl]() : null

				models.push({
					name: fileName,
					obj: objUrl,
					mtl: mtlUrl,
					status: 'pending'
				})
			}

			return models
		} catch (error) {
			console.error('获取预设文件夹文件失败:', error)
			return []
		}
	}

	// 文件夹改变时的处理
	const onFolderChange = (folderValue) => {
		clearCurrentModels()
		deselectModel()
	}

	// 清空当前模型
	const clearCurrentModels = () => {
		modelConfigs.value = []
		loadedModels.value = []
		deselectModel()
		originalMaterials.clear()
		customColorMaterials.clear()

		if (modelGroup) {
			while (modelGroup.children.length > 0) {
				const child = modelGroup.children[0]
				modelGroup.remove(child)

				if (child.geometry) child.geometry.dispose()

				if (child.material) {
					if (Array.isArray(child.material)) {
						child.material.forEach((mat) => mat.dispose())
					} else {
						child.material.dispose()
					}
				}
			}

			modelGroup.position.set(0, 0, 0)
			modelGroup.scale.set(1, 1, 1)
			modelGroup.rotation.set(0, 0, 0)
		}

		modelCenter.set(0, 0, 0)
	}

	// 加载预设文件夹下的所有模型
	const loadFolderModels = async () => {
		const selectedFolderConfig = availableFolders.value.find((f) => f.value === selectedFolder.value)
		if (!selectedFolderConfig) {
			ElMessage.error('请选择一个有效的预设文件夹')
			return
		}

		loading.value = true
		loadingText.value = '正在扫描预设文件夹...'
		loadingProgress.value = 10

		try {
			const models = await getModelsFromFolder(selectedFolderConfig.globPattern)

			if (models.length === 0) {
				ElMessage.warning('在选择的预设文件夹中没有找到任何OBJ模型文件')
				loading.value = false
				return
			}

			modelConfigs.value = models
			loadingProgress.value = 30
			loadingText.value = `发现 ${models.length} 个预设模型，开始加载...`

			await loadAllModels('preset')
		} catch (error) {
			console.error('扫描预设文件夹失败:', error)
			ElMessage.error('扫描预设文件夹失败')
			loading.value = false
		}
	}

	// 加载本地文件夹下的所有模型
	const loadLocalFolderModels = async () => {
		if (!selectedLocalFolder.value || localModelFiles.value.length === 0) {
			ElMessage.error('请先选择包含OBJ文件的本地文件夹')
			return
		}

		loading.value = true
		loadingText.value = '开始加载本地模型...'
		loadingProgress.value = 10

		try {
			modelConfigs.value = localModelFiles.value.map((model) => ({
				...model,
				status: 'pending'
			}))

			loadingProgress.value = 30
			loadingText.value = `开始加载 ${localModelFiles.value.length} 个本地模型...`

			await loadAllModels('local')
		} catch (error) {
			console.error('加载本地文件夹失败:', error)
			ElMessage.error('加载本地文件夹失败')
			loading.value = false
		}
	}

	// 模型批量加载器类
	class ModelBatchLoader {
		constructor(loadType = 'preset') {
			this.loadType = loadType
		}

		async loadModel(config) {
			try {
				config.status = 'loading'

				const mtlLoader = new MTLLoader()
				const objLoader = new OBJLoader()
				let materials = null
				let object = null

				if (this.loadType === 'preset') {
					if (config.mtl) {
						try {
							materials = await this.loadMTLFromUrl(mtlLoader, config.mtl)
						} catch (mtlError) {
							console.warn(`${config.name} 预设MTL 加载失败，使用默认材质:`, mtlError)
						}
					}

					if (materials) {
						objLoader.setMaterials(materials)
					}

					object = await this.loadOBJFromUrl(objLoader, config.obj)
				} else {
					// 本地文件加载逻辑
					if (config.mtlFile) {
						try {
							materials = await this.loadMTLFromFile(mtlLoader, config.mtlFile, selectedLocalFolder.value.urlMap)
						} catch (mtlError) {
							console.warn(`${config.name} 本地MTL 加载失败，使用默认材质:`, mtlError)
						}
					}

					if (materials) {
						objLoader.setMaterials(materials)
					}

					object = await this.loadOBJFromFile(objLoader, config.objFile)
				}

				this.recenterObject(object)

				if (!materials) {
					this.applyDefaultMaterials(object)
				}

				this.enhanceModel(object)
				config.status = 'success'

				return {
					name: config.name,
					object: markRaw(object), // 🔥 使用 markRaw 防止对象被代理
					visible: true,
					config: config
				}
			} catch (error) {
				config.status = 'error'
				console.error(`加载模型失败: ${config.name}`, error)
				throw error
			}
		}

		// 重置模型的几何中心，将烘焙在顶点数据中的位置提取到对象的 .position 属性上
		recenterObject(object) {
			// 1. 计算出它的几何中心点 (这就是它被烘焙的"假"位置)
			const box = new THREE.Box3().setFromObject(object)
			const center = box.getCenter(new THREE.Vector3())

			// 如果中心点几乎为0，说明模型本身就在原点，无需处理
			if (center.lengthSq() < 0.000001) {
				return
			}

			// 2. 将模型的几何体本身移回世界原点
			object.traverse((child) => {
				if (child.isMesh) {
					child.geometry.translate(-center.x, -center.y, -center.z)
				}
			})

			// 3. 将计算出的中心点赋值给对象的 .position 属性
			// 现在，.position 成为了位置的唯一真实来源
			object.position.copy(center)
		}

		loadMTLFromUrl(mtlLoader, path) {
			return new Promise((resolve, reject) => {
				const basePath = path.substring(0, path.lastIndexOf('/') + 1)
				mtlLoader.setResourcePath(basePath)
				mtlLoader.load(
					path,
					(materials) => {
						materials.preload()
						resolve(materials)
					},
					undefined,
					reject
				)
			})
		}

		loadOBJFromUrl(objLoader, path) {
			return new Promise((resolve, reject) => {
				objLoader.load(path, resolve, undefined, reject)
			})
		}

		loadMTLFromFile(mtlLoader, mtlFile, urlMap) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader()
				reader.onload = (event) => {
					try {
						const mtlContent = event.target.result

						const basePath = mtlFile.webkitRelativePath.substring(0, mtlFile.webkitRelativePath.lastIndexOf('/') + 1)

						const originalSetPath = mtlLoader.setResourcePath.bind(mtlLoader)
						mtlLoader.setResourcePath = (path) => {
							originalSetPath(path)

							const originalLoadTexture = mtlLoader.loadTexture.bind(mtlLoader)
							mtlLoader.loadTexture = (url, mapping, onLoad, onProgress, onError) => {
								const fullPath = basePath + url
								const fileData = urlMap.get(fullPath)

								if (fileData) {
									console.log(`找到本地纹理文件: ${url} -> ${fileData.url}`)
									return originalLoadTexture(fileData.url, mapping, onLoad, onProgress, onError)
								} else {
									console.warn(`未找到纹理文件: ${url}, 完整路径: ${fullPath}`)
									if (onError) onError(new Error(`Texture not found: ${url}`))
									return null
								}
							}
						}

						const materials = mtlLoader.parse(mtlContent)
						materials.preload()
						resolve(materials)
					} catch (error) {
						reject(error)
					}
				}
				reader.onerror = reject
				reader.readAsText(mtlFile)
			})
		}

		loadOBJFromFile(objLoader, objFile) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader()
				reader.onload = (event) => {
					try {
						const objContent = event.target.result
						const object = objLoader.parse(objContent)
						resolve(object)
					} catch (error) {
						reject(error)
					}
				}
				reader.onerror = reject
				reader.readAsText(objFile)
			})
		}

		applyDefaultMaterials(object) {
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

		enhanceModel(object) {
			object.traverse((child) => {
				if (child.isMesh && child.material) {
					const material = child.material
					if (Array.isArray(material)) {
						material.forEach((mat) => this.enhanceMaterial(mat))
					} else {
						this.enhanceMaterial(material)
					}
				}
			})
		}

		enhanceMaterial(material) {
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
	}

	// 初始化Three.js场景
	const initThreeJS = () => {
		scene = new THREE.Scene()
		scene.background = new THREE.Color('#f0f0f0')
		const groundGeometry = new THREE.BoxGeometry(400, 400, 4)
		const groundMaterial = new THREE.MeshBasicMaterial({
			color: '#333333',
			transparent: true,
			opacity: 0.4
		})

		const ground = new THREE.Mesh(groundGeometry, groundMaterial)
		ground.position.z = -2
		scene.add(ground)

		const grid = new THREE.GridHelper(400, 20, '#ffffff', '#ffffff')
		grid.material.opacity = 0.6
		grid.material.depthWrite = false
		grid.material.transparent = true
		// 将网格从XZ平面旋转到XY平面
		grid.rotateX(Math.PI / 2)
		scene.add(grid)

		modelGroup = new THREE.Group()
		scene.add(modelGroup)

		// const axesHelper = new THREE.AxesHelper(100)
		// scene.add(axesHelper)

		const aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
		camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
		camera.position.set(8, -8, 6)
		camera.up.set(0, 0, 1)
		camera.lookAt(0, 0, 0)

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

		gizmo = new ViewportGizmo(camera, renderer, { className: 'viewport-gizmo' })
		gizmo.attachControls(controls)

		// 添加鼠标事件监听
		containerRef.value.addEventListener('mousemove', onMouseMove)
		containerRef.value.addEventListener('click', onMouseClick)

		setupLights()
		animate()

		// 添加鼠标事件监听
		containerRef.value.addEventListener('mousedown', onMouseDown)
		containerRef.value.addEventListener('mousemove', onMouseMove)
		containerRef.value.addEventListener('click', onMouseClick)
	}

	// 设置光照系统
	const setupLights = () => {
		lights.forEach((light) => scene.remove(light))
		lights = []

		const ambientLight = new THREE.AmbientLight(0x404040, lightIntensity.value * 0.8)
		scene.add(ambientLight)
		lights.push(ambientLight)

		const lightDistance = 100
		const directionalLight1 = new THREE.DirectionalLight(0xffffff, lightIntensity.value)
		directionalLight1.position.set(
			modelCenter.x + lightDistance,
			modelCenter.y + lightDistance,
			modelCenter.z + lightDistance / 2
		)
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
			light.position.set(modelCenter.x + pos[0], modelCenter.y + pos[1], modelCenter.z + pos[2])
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

	// 批量加载所有模型
	const loadAllModels = async (loadType = 'preset') => {
		if (modelConfigs.value.length === 0) {
			ElMessage.warning('没有发现任何模型文件')
			loading.value = false
			return
		}

		loading.value = true
		loadingProgress.value = 30
		loadingText.value = '开始加载模型...'

		modelConfigs.value.forEach((config) => (config.status = 'pending'))
		loadedModels.value = []
		deselectModel()
		originalMaterials.clear()
		customColorMaterials.clear()

		if (modelGroup) {
			while (modelGroup.children.length > 0) {
				const child = modelGroup.children[0]
				modelGroup.remove(child)
				if (child.geometry) child.geometry.dispose()
				if (child.material) {
					if (Array.isArray(child.material)) {
						child.material.forEach((mat) => mat.dispose())
					} else {
						child.material.dispose()
					}
				}
			}
		}

		const loader = new ModelBatchLoader(loadType)
		const totalModels = modelConfigs.value.length
		let completedModels = 0
		let successfulModels = 0

		try {
			// scene.background = new THREE.Color('#f0f0f0')
			// const groundGeometry = new THREE.BoxGeometry(400, 400, 4)
			// const groundMaterial = new THREE.MeshBasicMaterial({
			// 	color: '#333333',
			// 	transparent: true,
			// 	opacity: 0.4,
			// })

			// const ground = new THREE.Mesh(groundGeometry, groundMaterial)
			// ground.position.z = -2
			// scene.add(ground)

			// const grid = new THREE.GridHelper(400, 20, '#ffffff', '#ffffff')
			// grid.material.opacity = 0.6
			// grid.material.depthWrite = false
			// grid.material.transparent = true
			// // 将网格从XZ平面旋转到XY平面
			// grid.rotateX(Math.PI / 2)
			// scene.add(grid)

			for (const config of modelConfigs.value) {
				try {
					loadingText.value = `正在加载： ${config.name}`
					const modelData = await loader.loadModel(config)
					modelGroup.add(modelData.object)
					loadedModels.value.push(modelData)
					successfulModels++
				} catch (error) {
					console.error(`${config.name} 加载失败:`, error)
					ElMessage.warning(`模型 "${config.name}" 加载失败`)
				}

				completedModels++
				loadingProgress.value = Math.round(30 + (completedModels / totalModels) * 70)
			}

			if (modelGroup.children.length > 0) {
				const box = new THREE.Box3().setFromObject(modelGroup)
				const center = box.getCenter(new THREE.Vector3())
				const size = box.getSize(new THREE.Vector3())

				modelCenter.copy(center)

				const maxDim = Math.max(size.x, size.y, size.z)

				if (maxDim > 100) {
					const scale = 85 / maxDim
					modelGroup.scale.multiplyScalar(scale)
					console.log(`模型太大，统一缩放: ${scale.toFixed(3)}`)

					box.setFromObject(modelGroup)
					center.copy(box.getCenter(new THREE.Vector3()))
					size.copy(box.getSize(new THREE.Vector3()))
					modelCenter.copy(center)
				}

				// 保持CAD视角方向，只调整距离
				const fov = camera.fov * (Math.PI / 180)
				const maxDimAfterScale = Math.max(size.x, size.y, size.z)
				let cameraDistance = Math.abs(maxDimAfterScale / 2 / Math.tan(fov / 2))
				cameraDistance *= 1.8

				// 保持固定的CAD视角方向 (8, -8, 6)
				const direction = new THREE.Vector3(8, -8, 6).normalize()

				// 设置新位置：模型中心 + 方向 * 距离
				camera.position.copy(center).add(direction.multiplyScalar(cameraDistance))

				// 关键：保持CAD设置
				camera.up.set(0, 0, 1)
				camera.lookAt(center.x, center.y, center.z)

				controls.target.copy(center)
				controls.update()

				setupLights()
			}

			loadingText.value = `加载完成！成功加载 ${successfulModels} / ${totalModels} 个模型`

			setTimeout(() => {
				loading.value = false
			}, 1000)

			if (successfulModels > 0) {
				ElMessage.success(`批量加载完成，共加载 ${successfulModels} 个模型`)
			} else {
				ElMessage.error('所有模型加载失败，请检查文件格式')
			}
		} catch (error) {
			console.error('批量加载失败:', error)
			ElMessage.error('批量加载失败')
			loading.value = false
		}
	}

	// 切换模型可见性
	const toggleModelVisibility = (model) => {
		model.object.visible = model.visible
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

	// 模型空间位置控制
	const updateSelectedModelPosition = (model) => {
		if (model && model.object) {
			selectedModelPosition.value = {
				x: parseFloat(model.object.position.x.toFixed(2)),
				y: parseFloat(model.object.position.y.toFixed(2)),
				z: parseFloat(model.object.position.z.toFixed(2))
			}
		}
	}

	const onModelPositionChange = () => {
		if (!selectedModel.value || !selectedModel.value.object) return

		selectedModel.value.object.position.set(
			selectedModelPosition.value.x,
			selectedModelPosition.value.y,
			selectedModelPosition.value.z
		)
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

		// 移除事件监听
		if (containerRef.value) {
			containerRef.value.removeEventListener('mousemove', onMouseMove)
			containerRef.value.removeEventListener('click', onMouseClick)
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
		clearFileUrls()
		originalMaterials.clear()
		customColorMaterials.clear()

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

		// 移除事件监听
		if (containerRef.value) {
			containerRef.value.removeEventListener('mousedown', onMouseDown)
			containerRef.value.removeEventListener('mousemove', onMouseMove)
			containerRef.value.removeEventListener('click', onMouseClick)
		}
	}

	// 组件挂载
	onMounted(async () => {
		await nextTick()
		if (containerRef.value) {
			initThreeJS()
			window.addEventListener('resize', handleResize)
		}
	})

	// 组件卸载
	onUnmounted(() => {
		window.removeEventListener('resize', handleResize)
		cleanup()
	})

	// UI状态
	const robotLoading = ref(false)
	const hasRobot = ref(false)

	// 动画变量
	let robotAnimationId = null
	let isAnimating = false
	let jointDefinitions = null // 存储关节定义
	let modelJointMap = null // 模型到关节的映射

	const makeRobotMovable = async () => {
		// 检查必要的模型
		const requiredModels = ['Base', 'J1', 'J2', 'J3']
		const foundModels = {}

		for (const modelName of requiredModels) {
			const model = loadedModels.value.find(
				(m) => m.name.toLowerCase().includes(modelName.toLowerCase()) || m.name === modelName
			)
			if (!model) {
				ElMessage.error(`缺少必要模型: ${modelName}`)
				return
			}
			foundModels[modelName.toLowerCase()] = toRaw(model.object)
		}

		robotLoading.value = true

		try {
			const loader = new URDFLoader()

			// 跳过mesh加载
			loader.loadMeshCb = (path, manager, onComplete) => {
				onComplete(new THREE.Group())
			}

			loader.load(
				`/robot-skeleton.urdf?t=${Date.now()}`,
				(urdfRobot) => {
					console.log('URDF加载成功，提取关节信息...')

					// 只提取关节信息，不改变现有模型结构
					jointDefinitions = {}
					modelJointMap = {}

					urdfRobot.traverse((child) => {
						if (child.isURDFJoint && child.jointType === 'revolute') {
							jointDefinitions[child.name] = {
								axis: child.axis.clone(),
								limit: child.limit,
								origin: child.origin ? child.origin.clone() : new THREE.Vector3()
							}
							console.log(`找到关节: ${child.name}`)
						}
					})

					// 建立模型到关节的映射（根据你的URDF结构调整）
					modelJointMap = {
						joint_2: foundModels.j2, // J2模型对应joint_2
						joint_3: foundModels.j3 // J3模型对应joint_3
					}

					robotLoading.value = false
					hasRobot.value = true

					ElMessage.success('关节信息提取完成！开始动画')

					startDirectAnimation()
				},
				undefined,
				(error) => {
					console.error('URDF加载失败:', error)
					ElMessage.error(`URDF加载失败: ${error.message || error}`)
					robotLoading.value = false
				}
			)
		} catch (error) {
			console.error('处理失败:', error)
			ElMessage.error('处理失败')
			robotLoading.value = false
		}
	}

	const startDirectAnimation = () => {
		if (isAnimating || !modelJointMap) return

		isAnimating = true
		console.log('开始直接动画...')

		// 记录每个模型的初始旋转，用于恢复
		const initialRotations = new Map()
		Object.values(modelJointMap).forEach((model) => {
			if (model) {
				initialRotations.set(model, {
					x: model.rotation.x,
					y: model.rotation.y,
					z: model.rotation.z
				})
			}
		})

		const animate = () => {
			if (!isAnimating) return

			const time = Date.now() * 0.001

			try {
				// 直接旋转J2模型（joint_2）
				const j2Model = modelJointMap['joint_2']
				if (j2Model) {
					const j2Angle = Math.sin(time) * 1.5
					const initialJ2 = initialRotations.get(j2Model)
					j2Model.rotation.set(
						initialJ2.x,
						initialJ2.y,
						initialJ2.z + j2Angle // 假设绕Z轴旋转，根据实际调整
					)
				}

				// 直接旋转J3模型（joint_3）
				const j3Model = modelJointMap['joint_3']
				if (j3Model) {
					const j3Angle = Math.cos(time * 0.8) * 0.8
					const initialJ3 = initialRotations.get(j3Model)
					j3Model.rotation.set(
						initialJ3.x,
						initialJ3.y,
						initialJ3.z + j3Angle // 假设绕Z轴旋转，根据实际调整
					)
				}
			} catch (e) {
				console.warn('动画执行失败:', e)
			}

			robotAnimationId = requestAnimationFrame(animate)
		}

		animate()
	}

	const stopAnimation = () => {
		isAnimating = false
		if (robotAnimationId) {
			cancelAnimationFrame(robotAnimationId)
			robotAnimationId = null
		}
	}

	const clearRobot = () => {
		stopAnimation()

		if (modelJointMap) {
			Object.values(modelJointMap).forEach((model) => {
				if (model) {
					model.rotation.set(0, 0, 0)
				}
			})
		}

		// 清理
		jointDefinitions = null
		modelJointMap = null
		hasRobot.value = false

		ElMessage.info('已停止动画，模型保持原位')
	}
</script>

<style lang="scss" scoped>
	@use './styles/index.scss';
</style>

<style lang="scss">
	.viewport-gizmo {
		top: unset !important;
		bottom: 30px;
		background-color: #6d6d6d28;
	}
</style>
