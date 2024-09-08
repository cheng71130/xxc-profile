<template>
	<el-container v-if="showNav" class="main-container">
		<el-header class="header">
			<h1>Welcome to My Cool Homepage</h1>
		</el-header>
		<el-main class="content">
			<div class="card" v-for="(item, index) in cards" :key="index" @click="toNavigation(item.path)">
				<img :src="item.img" alt="Card Image" class="card-img" />
				<div class="card-title">{{ item.title }}</div>
				<p>{{ item.description }}</p>
			</div>
		</el-main>
	</el-container>
	<router-view></router-view>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { useRoute } from 'vue-router'

	const route = useRoute()
	const showNav = computed(() => {
		return route.path === '/'
	})

	const cards = ref([
		{
			title: 'Visualization',
			path: '/visualizationScreen',
			description: 'This is a cool card with some awesome content.',
			img: 'https://picsum.photos/400/300?random=1'
		},
		{
			title: 'China-map',
			path: '/map-cn',
			description: 'This card has even more amazing stuff to show.',
			img: 'https://picsum.photos/400/300?random=2'
		},
		{
			title: 'LogicFlow',
			path: '/flowDemo',
			description: 'Check out this card with its fantastic details.',
			img: 'https://picsum.photos/400/300?random=3'
		}
	])

	const router = useRouter()
	const toNavigation = (path) => {
		router.push(path)
	}
</script>

<style scoped lang="scss">
	.loader {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background-color: white;
		color: #555;
		font-size: 24px;
	}

	.main-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-image: url('https://picsum.photos/2560/1440?random=4');
		background-size: cover;
		background-position: center;
		position: relative;
		overflow: hidden;
	}

	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(58, 63, 68, 0.8);
		color: white;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		z-index: 1;
	}

	.content {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
		padding: 2rem;
		gap: 2rem;
		overflow: hidden;
		z-index: 1;
	}

	.card {
		background: linear-gradient(to bottom right, rgba(255, 235, 205, 0.9), rgba(245, 222, 179, 0.9));
		border-radius: 12px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		padding: 1.5rem;
		width: 400px;
		height: 450px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		transition: transform 0.3s ease, box-shadow 0.3s ease, background 2s ease;
		z-index: 1;
		cursor: pointer;
	}

	.card:hover {
		transform: translateY(-10px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
		background: linear-gradient(to bottom right, rgba(245, 222, 179, 0.9), rgba(255, 255, 210, 0.9));
	}

	.card-title {
		font-size: 26px;
		margin: 1rem 0;
		color: #462b79;
		font-weight: bold;
		position: relative;
		transition: color 0.5s ease;
	}

	.card-title::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -5px;
		width: 0;
		height: 2px;
		background-color: #8a2be2;
		transition: width 0.5s ease;
	}

	.card:hover .card-title {
		color: #8a2be2;
	}

	.card:hover .card-title::after {
		width: 100%;
	}

	.card-img {
		width: 100%;
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.card p {
		color: #666;
		font-size: 16px;
	}
</style>
