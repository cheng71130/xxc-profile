<template>
	<div class="real-time-clock">
		{{ currentDateTime }}
	</div>
</template>

<script setup>
	const currentDateTime = ref('')

	const padZero = (num) => (num < 10 ? '0' + num : num)

	const updateCurrentDateTime = () => {
		const now = new Date()
		const year = now.getFullYear()
		const month = padZero(now.getMonth() + 1) // 月份从0开始
		const day = padZero(now.getDate())
		const hours = padZero(now.getHours())
		const minutes = padZero(now.getMinutes())
		const seconds = padZero(now.getSeconds())

		currentDateTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
	}

	onMounted(() => {
		updateCurrentDateTime()
		const interval = setInterval(updateCurrentDateTime, 1000)
		onUnmounted(() => clearInterval(interval))
	})
</script>

<style scoped>
	.real-time-clock {
		width: 420px;
		color: #fff;
		font-size: 45px;
		position: absolute;
		right: 0px;
		top: 60px;
		font-family: electronicFont;
		font-style: italic;
	}
</style>
