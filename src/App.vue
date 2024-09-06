<template>
	<el-container v-if="showNav" class="main-container">
		<el-header class="header">
			<h1>Welcome to My Cool Homepage</h1>
		</el-header>
		<el-main class="content">
			<div class="card" v-for="(item, index) in cards" :key="index">
				<router-link :to="item.path">
					<h1>{{ item.title }}</h1>
				</router-link>
				<p>{{ item.description }}</p>
			</div>
		</el-main>
	</el-container>
	<router-view></router-view>
</template>

<script setup>
	const route = useRoute()
	const showNav = computed(() => {
		// 仅在根路径显示导航栏
		return route.path === '/'
	})

	const cards = ref([
		{
			title: 'Visualization',
			path: '/visualizationScreen',
			description: 'This is a cool card with some awesome content.'
		},
		{ title: 'China-map', path: '/map-cn', description: 'This card has even more amazing stuff to show.' },
		{ title: 'LogicFlow', path: '/flowDemo', description: 'Check out this card with its fantastic details.' }
	])
</script>

<style scoped lang="scss">
	.main-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-image: linear-gradient(
			109.6deg,
			rgba(112, 246, 255, 0.33) 11.2%,
			rgba(221, 108, 241, 0.26) 42%,
			rgba(229, 106, 253, 0.71) 71.5%,
			rgba(123, 183, 253, 1) 100.2%
		);
	}

	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #3a3f44;
		color: white;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.content {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
		padding: 2rem;
		gap: 2rem;
		overflow: hidden;
	}

	.card {
		background-color: antiquewhite;
		border-radius: 12px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		padding: 1.5rem;
		width: 400px;
		height: 350px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.card:hover {
		transform: translateY(-10px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
	}

	.card h2 {
		margin: 0 0 1rem;
		color: #333;
	}

	.card p {
		color: #666;
		font-size: 16px;
	}
</style>
