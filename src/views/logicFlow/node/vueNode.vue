<template>
	<div class="xxc">
		<div class="header">
			<h2>{{ title }}</h2>
			<div v-if="status == 'running'" class="loader"></div>
			<div v-else-if="status == 'success'" class="animate__animated animate__backInRight">
				<SvgIcon name="success3" size="22" />
			</div>
			<div v-else-if="status == 'fail'" class="animate__animated animate__rubberBand">
				<SvgIcon name="fail1" size="22" />
			</div>
		</div>
		<el-divider style="margin: 0px" />
		<div style="padding: 10px">
			<el-rate v-model="value" clearable />
			<div class="content">Embrace challenges as opportunities for growth.</div>
		</div>
	</div>
</template>
<script setup>
	import { EventType } from '@logicflow/core'
	import { vueNodesMap } from '@logicflow/vue-node-registry'

	const value = ref(3)
	const title = ref('')
	const status = ref('')

	onMounted(() => {
		// 获取当前node
		const getNode = inject('getNode')
		const node = getNode()
		title.value = node.properties.title

		// 监听数据更新的node
		const getGraph = inject('getGraph')
		const graph = getGraph()
		graph.eventCenter.on(EventType.NODE_PROPERTIES_CHANGE, (eventData) => {
			const keys = eventData.keys
			const content = vueNodesMap[node.type]
			if (content && eventData.id === node.id) {
				status.value = eventData.properties.status
			}
		})
	})
</script>
<style scoped lang="scss">
	.xxc {
		width: 300px;
		height: 150px;
		border-radius: 4px;
		overflow: hidden;
		border: 1px sandybrown solid;
		background-image: radial-gradient(
			circle farthest-corner at 10% 20%,
			rgba(171, 102, 255, 1) 0%,
			rgba(116, 182, 247, 1) 90%
		);
		// background-image: linear-gradient( 68.9deg,  rgba(132,89,223,1) 40.8%, rgba(255,255,255,1) 101.8% );

		.header {
			padding: 10px;
			padding-right: 15px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			h2 {
				color: white;
				letter-spacing: 1px;
				margin: 0;
			}

			.loader {
				position: relative;
				width: 1.5em; /* 调小 */
				height: 1.5em; /* 调小 */
				transform: rotate(165deg);
			}

			.loader:before,
			.loader:after {
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				display: block;
				width: 0.3em; /* 调小 */
				height: 0.3em; /* 调小 */
				border-radius: 0.15em; /* 调小 */
				transform: translate(-50%, -50%);
			}

			.loader:before {
				animation: before8 2s infinite;
			}

			.loader:after {
				animation: after6 2s infinite;
			}

			@keyframes before8 {
				0% {
					width: 0.3em; /* 调小 */
					box-shadow: 0.6em -0.3em rgba(225, 20, 98, 1), /* 调小 */ -0.6em 0.3em rgba(111, 202, 220, 1); /* 调小 */
				}

				35% {
					width: 1.5em; /* 调小 */
					box-shadow: 0 -0.3em rgba(225, 20, 98, 1), 0 0.3em rgba(111, 202, 220, 1);
				}

				70% {
					width: 0.3em; /* 调小 */
					box-shadow: -0.6em -0.3em rgba(225, 20, 98, 1), /* 调小 */ 0.6em 0.3em rgba(111, 202, 220, 1); /* 调小 */
				}

				100% {
					box-shadow: 0.6em -0.3em rgba(225, 20, 98, 1), /* 调小 */ -0.6em 0.3em rgba(111, 202, 220, 1); /* 调小 */
				}
			}

			@keyframes after6 {
				0% {
					height: 0.3em; /* 调小 */
					box-shadow: 0.3em 0.6em rgba(61, 184, 143, 1), /* 调小 */ -0.3em -0.6em rgba(233, 169, 32, 1); /* 调小 */
				}

				35% {
					height: 1.5em; /* 调小 */
					box-shadow: 0.3em 0 rgba(61, 184, 143, 1), -0.3em 0 rgba(233, 169, 32, 1);
				}

				70% {
					height: 0.3em; /* 调小 */
					box-shadow: 0.3em -0.6em rgba(61, 184, 143, 1), /* 调小 */ -0.3em 0.6em rgba(233, 169, 32, 1); /* 调小 */
				}

				100% {
					box-shadow: 0.3em 0.6em rgba(61, 184, 143, 1), /* 调小 */ -0.3em -0.6em rgba(233, 169, 32, 1); /* 调小 */
				}
			}
		}

		.content {
			color: white;
			margin-top: 5px;
			font-size: 15px;
		}
	}
</style>
