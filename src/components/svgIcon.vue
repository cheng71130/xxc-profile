<template>
	<svg class="svg-icon" :class="[$attrs.class, spin && 'svg-icon-spin']" :style="getStyle" aria-hidden="true">
		<use :xlink:href="symbolId" />
	</svg>
</template>

<script lang="ts">
	import type { CSSProperties } from 'vue'
	import { defineComponent, computed } from 'vue'

	export default defineComponent({
		name: 'SvgIcon',
		props: {
			prefix: {
				type: String,
				default: 'icon'
			},
			name: {
				type: String,
				required: true
			},
			size: {
				type: [Number, String],
				default: 16
			},
			spin: {
				type: Boolean,
				default: false
			}
		},
		setup(props) {
			const symbolId = computed(() => `#${props.prefix}-${props.name}`)

			const getStyle = computed((): CSSProperties => {
				const { size } = props
				let s = `${size}`
				s = `${s.replace('px', '')}px`
				return {
					width: s,
					height: s
				}
			})
			return { symbolId, getStyle }
		}
	})
</script>

<style lang="less" scoped>
	.svg-icon {
		display: inline-block;
		overflow: hidden;
		vertical-align: -0.15em;
		fill: currentcolor;
	}

	.svg-icon-spin {
		animation: loadingCircle 1s infinite linear;
	}

	@keyframes loadingCircle {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
