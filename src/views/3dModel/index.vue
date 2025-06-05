<template>
	<div class="model-viewer w-full h-screen relative">
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
				</div>
			</div>
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
							<!-- <p class="header-subtitle">{{ selectedModel.name }}</p> -->
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
									show-alpha
								/>
								<el-button @click="resetModelColor" type="info" class="reset-color-btn"> 重置 </el-button>
							</div>
						</div>
					</div>

					<!-- 透明度控制 -->
					<div class="setting-section">
						<div class="setting-label">
							<el-icon class="setting-icon"><MagicStick /></el-icon>
							<span>透明度</span>
						</div>
						<div class="setting-control">
							<el-slider
								v-model="selectedModelOpacity"
								:min="0"
								:max="1"
								:step="0.1"
								@change="onModelOpacityChange"
								:show-tooltip="true"
								:format-tooltip="(val) => `${Math.round(val * 100)}%`"
							/>
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

	// 导入方式和本地文件夹相关
	const importType = ref('preset')
	const selectedLocalFolder = ref(null)
	const localModelFiles = ref([])
	const fileUrlMap = ref(new Map())

	// 模型选择和交互相关
	const selectedModel = ref(null)
	const hoveredModel = ref(null)
	const selectedModelColor = ref('#ffffff')
	const selectedModelOpacity = ref(1)

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

		let color = '#888888'
		model.object.traverse((child) => {
			if (child.isMesh && child.material) {
				const material = Array.isArray(child.material) ? child.material[0] : child.material
				if (material.color) {
					color = `#${material.color.getHexString()}`
					return false // 找到第一个颜色就返回
				}
			}
		})
		return color
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

		// 应用选中效果（颜色加深）
		applySelectedEffect(model)

		// 更新选中模型的颜色和透明度
		selectedModelColor.value = getModelDisplayColor(model)
		selectedModelOpacity.value = getModelOpacity(model)
	}

	// 取消选择模型
	const deselectModel = () => {
		if (selectedModel.value) {
			restoreModelMaterial(selectedModel.value)
			selectedModel.value = null
		}
	}

	// 获取模型透明度
	const getModelOpacity = (model) => {
		if (!model.object) return 1

		let opacity = 1
		model.object.traverse((child) => {
			if (child.isMesh && child.material) {
				const material = Array.isArray(child.material) ? child.material[0] : child.material
				if (material.opacity !== undefined) {
					opacity = material.opacity
					return false
				}
			}
		})
		return opacity
	}

	// 应用选中效果
	const applySelectedEffect = (model) => {
		if (!model.object) return

		model.object.traverse((child) => {
			if (child.isMesh && child.material) {
				// 只在第一次选中时保存原始材质
				if (!originalMaterials.has(child.uuid)) {
					const originalMat = Array.isArray(child.material)
						? child.material.map((mat) => mat.clone())
						: child.material.clone()
					originalMaterials.set(child.uuid, originalMat)
				}

				// 从原始材质创建加深的材质
				const originalMat = originalMaterials.get(child.uuid)
				if (Array.isArray(originalMat)) {
					child.material = originalMat.map((mat) => {
						const newMat = mat.clone()
						if (newMat.color) {
							newMat.color.multiplyScalar(0.7)
						}
						return newMat
					})
				} else {
					const newMat = originalMat.clone()
					if (newMat.color) {
						newMat.color.multiplyScalar(0.7)
					}
					child.material = newMat
				}
			}
		})
	}

	// 应用悬停效果
	const applyHoverEffect = (model) => {
		if (!model.object || model === selectedModel.value) return

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
			if (child.isMesh && originalMaterials.has(child.uuid)) {
				const originalMat = originalMaterials.get(child.uuid)
				if (Array.isArray(originalMat)) {
					child.material = originalMat.map((mat) => mat.clone())
				} else {
					child.material = originalMat.clone()
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
			restoreModelMaterial(hoveredModel.value)
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

				// 递归查找
				let found = false
				model.object?.traverse((child) => {
					if (child === intersectedObject) {
						targetModel = model
						found = true
					}
				})
				if (found) break
			}

			if (targetModel && targetModel !== selectedModel.value) {
				hoveredModel.value = targetModel
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
			// 找到对应的模型的逻辑保持不变...
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

		selectedModel.value.object.traverse((child) => {
			if (child.isMesh && child.material) {
				const materials = Array.isArray(child.material) ? child.material : [child.material]
				materials.forEach((material) => {
					if (material.color) {
						material.color.setHex(color.replace('#', '0x'))
					}
				})
			}
		})
	}

	// 模型透明度改变
	const onModelOpacityChange = (opacity) => {
		if (!selectedModel.value) return

		selectedModel.value.object.traverse((child) => {
			if (child.isMesh && child.material) {
				const materials = Array.isArray(child.material) ? child.material : [child.material]
				materials.forEach((material) => {
					material.transparent = opacity < 1
					material.opacity = opacity
				})
			}
		})
	}

	// 重置模型颜色
	const resetModelColor = () => {
		if (!selectedModel.value) return

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

			// 从加载的模型列表中移除
			const index = loadedModels.value.findIndex((m) => m === selectedModel.value)
			if (index > -1) {
				loadedModels.value.splice(index, 1)
			}
			// 清空选中状态
			selectedModel.value = null

			// 清理原始材质缓存
			selectedModel.value.object?.traverse((child) => {
				if (originalMaterials.has(child.uuid)) {
					originalMaterials.delete(child.uuid)
				}
			})

			ElMessage.success(`模型 "${selectedModel.value.name}" 已删除`)
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

					const object = await this.loadOBJFromUrl(objLoader, config.obj)

					if (!materials) {
						this.applyDefaultMaterials(object)
					}

					this.enhanceModel(object)
					config.status = 'success'

					return {
						name: config.name,
						object: object,
						visible: true,
						config: config
					}
				} else {
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

					const object = await this.loadOBJFromFile(objLoader, config.objFile)

					if (!materials) {
						this.applyDefaultMaterials(object)
					}

					this.enhanceModel(object)
					config.status = 'success'

					return {
						name: config.name,
						object: object,
						visible: true,
						config: config
					}
				}
			} catch (error) {
				config.status = 'error'
				console.error(`加载模型失败: ${config.name}`, error)
				throw error
			}
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
		scene.background = new THREE.Color(0xf0f0f0)

		modelGroup = new THREE.Group()
		scene.add(modelGroup)

		const aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
		camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
		camera.position.set(5, 5, 5)

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
		controls.maxDistance = 100
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

				const fov = camera.fov * (Math.PI / 180)
				const maxDimAfterScale = Math.max(size.x, size.y, size.z)
				let cameraDistance = Math.abs(maxDimAfterScale / 2 / Math.tan(fov / 2))
				cameraDistance *= 1.8

				camera.position.set(center.x + cameraDistance, center.y + cameraDistance, center.z + cameraDistance)
				camera.lookAt(center.x, center.y, center.z)

				controls.target.set(center.x, center.y, center.z)
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
</script>

<style scoped lang="scss">
	.model-viewer {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.loading-overlay {
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(8px);
	}

	.loading-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
	}

	.loading-card {
		background: linear-gradient(145deg, #ffffff, #f8fafc);
		border-radius: 20px;
		padding: 32px;
		min-width: 360px;
		max-width: 480px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);

		.loading-header {
			text-align: center;
			margin-bottom: 24px;

			.loading-icon {
				margin-bottom: 16px;

				.spinner {
					width: 46px;
					height: 46px;
					border: 4px solid #e5e7eb;
					border-top: 4px solid #3b82f6;
					border-radius: 50%;
					animation: spin 1s linear infinite;
					margin: 0 auto;
				}
			}

			.loading-title {
				margin: 0;
				font-size: 20px;
				font-weight: 600;
				color: #1f2937;
				letter-spacing: -0.025em;
			}
		}

		.progress-section {
			margin-bottom: 24px;

			.progress-text {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 12px;

				.progress-percentage {
					font-size: 14px;
					font-weight: 600;
					color: #3b82f6;
				}

				.progress-description {
					font-size: 13px;
					color: #6b7280;
					flex: 1;
					text-align: right;
					margin-left: 16px;
				}
			}
		}

		.model-list {
			.list-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 12px;
				padding-bottom: 8px;
				border-bottom: 1px solid #e5e7eb;

				.list-title {
					font-size: 14px;
					font-weight: 600;
					color: #374151;
				}

				.list-count {
					font-size: 12px;
					color: #6b7280;
					background: #f3f4f6;
					padding: 2px 8px;
					border-radius: 12px;
				}
			}

			.list-content {
				max-height: 200px;
				overflow-y: auto;
				padding-right: 4px;

				&::-webkit-scrollbar {
					width: 4px;
				}

				&::-webkit-scrollbar-thumb {
					background: #d1d5db;
					border-radius: 2px;
				}

				.model-item {
					display: flex;
					align-items: center;
					gap: 8px;
					padding: 6px 0;
					transition: all 0.2s;

					.model-status-icon {
						display: flex;
						align-items: center;
						width: 20px;

						.status-icon {
							width: 16px;
							height: 16px;
						}
					}

					.model-name {
						font-size: 13px;
						color: #4b5563;
						flex: 1;
					}

					&.status-loading {
						.status-icon {
							color: #3b82f6;
							animation: spin 1.5s infinite;
						}
						.model-name {
							color: #3b82f6;
						}
					}

					&.status-success {
						.status-icon {
							color: #10b981;
						}
						.model-name {
							color: #065f46;
						}
					}

					&.status-error {
						.status-icon {
							color: #ef4444;
						}
						.model-name {
							color: #dc2626;
						}
					}

					&.status-pending {
						.status-icon {
							color: #9ca3af;
						}
					}
				}
			}
		}
	}

	.control-panel {
		.control-card {
			background: rgba(255, 255, 255, 0.95);
			backdrop-filter: blur(12px);
			border-radius: 16px;
			padding: 0;
			min-width: 320px;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
			border: 1px solid rgba(255, 255, 255, 0.3);
			overflow: hidden;

			.card-header {
				background: linear-gradient(135deg, #4f46e5, #7c3aed);
				color: white;
				padding: 16px 20px;
				display: flex;
				align-items: center;
				gap: 12px;

				.header-icon {
					display: flex;
					align-items: center;
					font-size: 18px;
				}

				.header-title {
					margin: 0;
					font-size: 16px;
					font-weight: 600;
					letter-spacing: -0.025em;
				}
			}

			.card-content {
				padding: 20px;
				display: flex;
				flex-direction: column;
				gap: 20px;

				.control-section {
					.section-label {
						display: flex;
						align-items: center;
						gap: 8px;
						margin-bottom: 12px;
						font-size: 14px;
						font-weight: 600;
						color: #374151;

						.label-icon {
							font-size: 16px;
							color: #6b7280;
						}
					}

					.import-radio-group {
						width: 100%;

						:deep(.el-radio-button) {
							flex: 1;

							.el-radio-button__inner {
								width: 100%;
								border-radius: 8px !important;
								border: 1px solid #d1d5db;
								transition: all 0.2s;

								&:hover {
									border-color: #4f46e5;
									color: #4f46e5;
								}
							}

							&.is-active .el-radio-button__inner {
								background: #4f46e5;
								border-color: #4f46e5;
								color: white;
							}

							&:first-child .el-radio-button__inner {
								margin-right: 8px;
							}
						}
					}

					.full-width-select {
						width: 100%;
						margin-bottom: 12px;
					}

					.action-button,
					.select-folder-button {
						width: 100%;
						height: 40px;
						border-radius: 8px;
						font-weight: 500;
					}

					.folder-info {
						background: linear-gradient(135deg, #f8fafc, #f1f5f9);
						border: 1px solid #e2e8f0;
						border-radius: 8px;
						padding: 12px;
						margin: 12px 0;

						.info-item {
							display: flex;
							align-items: center;
							gap: 8px;
							margin-bottom: 8px;

							&:last-child {
								margin-bottom: 0;
							}

							.info-icon {
								color: #6b7280;
								font-size: 14px;
							}

							.info-text {
								font-size: 13px;
								color: #4b5563;
							}
						}
					}

					.model-count-tag {
						margin-left: auto;
						background: #e0e7ff;
						color: #4338ca;
						border: none;
					}

					.current-model-list {
						max-height: 300px;
						overflow-y: auto;
						padding-right: 4px;

						&::-webkit-scrollbar {
							width: 4px;
						}

						&::-webkit-scrollbar-thumb {
							background: #d1d5db;
							border-radius: 2px;
						}

						.current-model-item {
							display: flex;
							align-items: center;
							gap: 12px;
							padding: 10px 12px;
							border-radius: 8px;
							cursor: pointer;
							transition: all 0.2s;
							border: 1px solid transparent;

							&:hover {
								background: linear-gradient(135deg, #f8fafc, #f1f5f9);
								border-color: #e2e8f0;
								transform: translateX(2px);
							}

							&.selected {
								background: linear-gradient(135deg, #ddd6fe, #e0e7ff);
								border-color: #4f46e5;
								box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15);
							}

							.model-indicator {
								width: 12px;
								height: 12px;
								border-radius: 50%;
								border: 2px solid white;
								box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
							}

							.model-name {
								font-size: 13px;
								color: #4b5563;
								flex: 1;
								font-weight: 500;
							}

							.model-arrow {
								color: #9ca3af;
								font-size: 14px;
								transition: all 0.2s;
							}

							&:hover .model-arrow {
								color: #4f46e5;
								transform: translateX(2px);
							}

							&.selected .model-arrow {
								color: #4f46e5;
							}
						}
					}
				}
			}
		}
	}

	.settings-panel {
		.settings-card {
			background: rgba(255, 255, 255, 0.95);
			backdrop-filter: blur(12px);
			border-radius: 16px;
			padding: 0;
			min-width: 300px;
			max-width: 320px;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
			border: 1px solid rgba(255, 255, 255, 0.3);
			overflow: hidden;

			.settings-header {
				background: linear-gradient(135deg, #f1b204, #eb971b);
				color: white;
				padding: 16px 20px;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.header-content {
					display: flex;
					align-items: center;
					gap: 12px;

					.header-icon {
						font-size: 18px;
					}

					.header-text {
						.header-title {
							margin: 0;
							font-size: 16px;
							font-weight: 600;
							letter-spacing: -0.025em;
						}

						.header-subtitle {
							margin: 0;
							font-size: 12px;
							opacity: 0.9;
							font-weight: 400;
						}
					}
				}

				.close-button {
					background: rgba(255, 255, 255, 0.2);
					border: none;
					color: white;

					&:hover {
						background: rgba(255, 255, 255, 0.3);
						color: white;
					}
				}
			}

			.settings-content {
				padding: 20px;
				display: flex;
				flex-direction: column;
				gap: 20px;

				.setting-section {
					.setting-label {
						display: flex;
						align-items: center;
						gap: 8px;
						margin-bottom: 12px;
						font-size: 14px;
						font-weight: 600;
						color: #374151;

						.setting-icon {
							font-size: 16px;
							color: #6b7280;
						}
					}

					.setting-control {
						.color-controls {
							display: flex;
							align-items: center;
							gap: 12px;

							.reset-color-btn {
								height: 32px;
								width: 50px;
							}
						}
					}

					.setting-actions {
						display: flex;

						.action-btn {
							width: 100%;
							height: 36px;
							border-radius: 8px;
							font-weight: 500;
						}
					}
				}
			}
		}
	}

	// 动画效果
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	// Canvas样式
	:deep(canvas) {
		cursor: grab;

		&:active {
			cursor: grabbing;
		}
	}

	:deep(.el-progress) {
		.el-progress__text {
			display: none;
		}

		.el-progress-bar__outer {
			background-color: #e5e7eb;
			border-radius: 8px;
		}

		.el-progress-bar__inner {
			border-radius: 8px;
			background: linear-gradient(90deg, #3b82f6, #1d4ed8);
		}
	}

	:deep(.el-select) {
		.el-input__inner {
			border-radius: 8px;
			border: 1px solid #d1d5db;
			transition: all 0.2s;

			&:hover {
				border-color: #4f46e5;
			}

			&:focus {
				border-color: #4f46e5;
				box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
			}
		}
	}

	:deep(.el-button) {
		border-radius: 8px;
		font-weight: 500;
		transition: all 0.2s;

		&.el-button--primary {
			background: linear-gradient(135deg, #4f46e5, #7c3aed);
			border: none;

			&:hover {
				background: linear-gradient(135deg, #4338ca, #6d28d9);
				transform: translateY(-1px);
				box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
			}
		}

		&.el-button--success {
			background: linear-gradient(135deg, #10b981, #059669);
			border: none;

			&:hover {
				background: linear-gradient(135deg, #047857, #065f46);
				transform: translateY(-1px);
				box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
			}
		}

		&.el-button--danger {
			background: linear-gradient(135deg, #ef4444, #dc2626);
			border: none;

			&:hover {
				background: linear-gradient(135deg, #dc2626, #b91c1c);
				transform: translateY(-1px);
				box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
			}
		}
	}

	:deep(.el-slider) {
		.el-slider__runway {
			background-color: #e5e7eb;
			border-radius: 4px;
		}

		.el-slider__bar {
			background: linear-gradient(90deg, #4f46e5, #7c3aed);
			border-radius: 4px;
		}

		.el-slider__button {
			background: white;
			border: 2px solid #4f46e5;
			width: 18px;
			height: 18px;

			&:hover {
				transform: scale(1.1);
			}
		}
	}

	:deep(.el-switch) {
		&.is-checked .el-switch__core {
			background-color: #4f46e5;
		}

		.el-switch__label {
			font-size: 13px;
			font-weight: 500;
		}
	}

	:deep(.el-color-picker) {
		.el-color-picker__trigger {
			border-radius: 6px;
			width: 36px;
			height: 32px;
		}
	}
</style>

<style lang="scss">
	.viewport-gizmo {
		top: unset !important;
		bottom: 30px;
		background-color: #9c9b9b27;
	}
</style>
