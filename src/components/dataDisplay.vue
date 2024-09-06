<template>
	<div>
		<span :style="frontStyle">{{ text.frontText }}</span>
		<!-- <span :style="numStyle">{{ formatter(text.numText) }}</span> -->
		<span :style="numStyle">{{ text.numText }}</span>
		<span :style="unitStyle">{{ text.unitText ? text.unitText : '个' }}</span>
	</div>
</template>
<script setup>
	const props = defineProps(['text', 'color', 'fontSize'])
	const { text, color, fontSize } = props

	const frontStyle = reactive({
		fontSize: fontSize && fontSize.frontSize ? fontSize.frontSize : '16px',
		color: color && color.frontColor ? color.frontColor : '#fff',
		marginRight: '10px'
	})
	const numStyle = reactive({
		fontSize: fontSize && fontSize.numSize ? fontSize.numSize : '30px',
		color: color && color.numColor ? color.numColor : '#3DE7C9'
	})
	const unitStyle = reactive({
		fontSize: fontSize && fontSize.unitSize ? fontSize.unitSize : '16px',
		color: color && color.unitColor ? color.unitColor : '#fff',
		marginLeft: '10px'
	})

	const formatter = (number) => {
		const numbers = number.toString().split('').reverse()
		const segs = []

		while (numbers.length) segs.push(numbers.splice(0, 3).join(''))

		return segs.join(',').split('').reverse().join('')
	}
</script>
<style scoped lang="less">
	// .container {
	//   gap: 10px;
	// }
</style>
