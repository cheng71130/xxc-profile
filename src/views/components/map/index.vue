<template>
	<div class="map-container" ref="container"></div>
</template>

<script setup>
	import { ref, onMounted, onBeforeUnmount } from 'vue'
	import * as THREE from 'three'
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
	import { ElLoading } from 'element-plus'
	// 修改导入路径
	import chinaJson from './china.json'

	const container = ref(null)
	let scene, camera, renderer, controls

	const initScene = () => {
		scene = new THREE.Scene()
		scene.background = new THREE.Color(0x001122)

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
		scene.add(ambientLight)

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
		directionalLight.position.set(10, 10, 10)
		scene.add(directionalLight)
	}

	const initCamera = () => {
		camera = new THREE.PerspectiveCamera(45, container.value.clientWidth / container.value.clientHeight, 0.1, 1000)
		// 调整相机位置，拉近距离
		camera.position.set(0, -30, 40)
		camera.lookAt(0, 0, 0)
	}

	const initRenderer = () => {
		renderer = new THREE.WebGLRenderer({ antialias: true })
		renderer.setSize(container.value.clientWidth, container.value.clientHeight)
		container.value.appendChild(renderer.domElement)
	}

	const initControls = () => {
		controls = new OrbitControls(camera, renderer.domElement)
		controls.enableDamping = true
		controls.dampingFactor = 0.05
		// 设置控制器的一些限制，使地图始终在视野内
		controls.minDistance = 20
		controls.maxDistance = 100
		controls.maxPolarAngle = Math.PI / 2
	}

	const isValidCoord = (coord) => {
		return (
			Array.isArray(coord) &&
			coord.length === 2 &&
			!isNaN(coord[0]) &&
			!isNaN(coord[1]) &&
			isFinite(coord[0]) &&
			isFinite(coord[1])
		)
	}

	const processCoord = (coord) => {
		// 调整缩放因子，使地图更大一些
		const scale = 0.1
		return {
			x: coord[0] * scale,
			y: coord[1] * scale
		}
	}

	const createMap = () => {
		const loading = ElLoading.service({
			lock: true,
			text: '正在渲染地图...',
			background: 'rgba(0, 0, 0, 0.7)'
		})

		try {
			const group = new THREE.Group()

			chinaJson.features.forEach((feature, featureIndex) => {
				if (feature.geometry.type === 'MultiPolygon') {
					feature.geometry.coordinates.forEach((polygon, polygonIndex) => {
						polygon.forEach((ring, ringIndex) => {
							const validCoords = ring.filter(isValidCoord)
							if (validCoords.length < 3) return

							const shape = new THREE.Shape()

							validCoords.forEach((coord, index) => {
								const point = processCoord(coord)
								if (index === 0) {
									shape.moveTo(point.x, point.y)
								} else {
									shape.lineTo(point.x, point.y)
								}
							})

							const firstPoint = processCoord(validCoords[0])
							shape.lineTo(firstPoint.x, firstPoint.y)

							try {
								const extrudeSettings = {
									depth: 1, // 增加厚度，使3D效果更明显
									bevelEnabled: false
								}

								const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
								const material = new THREE.MeshPhongMaterial({
									color: 0x1890ff,
									transparent: true,
									opacity: 0.8,
									side: THREE.DoubleSide
								})

								const mesh = new THREE.Mesh(geometry, material)
								group.add(mesh)
							} catch (error) {
								console.warn(`跳过无效的多边形: feature ${featureIndex}, polygon ${polygonIndex}, ring ${ringIndex}`)
							}
						})
					})
				}
			})

			// 计算包围盒
			const box = new THREE.Box3().setFromObject(group)
			const center = box.getCenter(new THREE.Vector3())

			// 计算包围盒的大小
			const size = box.getSize(new THREE.Vector3())
			const maxSize = Math.max(size.x, size.y, size.z)

			// 根据包围盒大小调整组的缩放
			const scale = 50 / maxSize // 将地图缩放到合适大小
			group.scale.set(scale, scale, scale)

			// 将地图居中
			group.position.set(-center.x * scale, -center.y * scale, -center.z * scale)

			// 旋转地图
			group.rotation.x = -Math.PI / 2

			scene.add(group)

			// 调整相机位置以适应地图大小
			camera.position.set(0, -30, 40)
			camera.lookAt(0, 0, 0)
		} catch (error) {
			console.error('渲染地图失败:', error)
			ElMessage.error('渲染地图失败')
		} finally {
			loading.close()
		}
	}

	const animate = () => {
		requestAnimationFrame(animate)
		controls.update()
		renderer.render(scene, camera)
	}

	const handleResize = () => {
		if (!container.value) return

		camera.aspect = container.value.clientWidth / container.value.clientHeight
		camera.updateProjectionMatrix()
		renderer.setSize(container.value.clientWidth, container.value.clientHeight)
	}

	onMounted(() => {
		initScene()
		initCamera()
		initRenderer()
		initControls()
		createMap()
		animate()

		window.addEventListener('resize', handleResize)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('resize', handleResize)
		renderer?.dispose()
		scene?.clear()
	})
</script>

<style scoped>
	.map-container {
		width: 100%;
		height: 100vh;
	}
</style>
