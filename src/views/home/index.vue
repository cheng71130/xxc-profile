<template>
	<div class="portfolio-container dark-theme">
		<!-- 背景效果 - 霓虹风格 -->
		<div class="bg-effect">
			<div class="bg-gradient"></div>
			<div class="bg-grid"></div>
			<div class="bg-glow"></div>
			<div class="neon-circle circle-1"></div>
			<div class="neon-circle circle-2"></div>
		</div>
		<!-- 导航栏 -->
		<header class="navbar fixed top-0 left-0 right-0 z-50" :class="{ 'navbar-scrolled': isScrolled }">
			<div class="container mx-auto px-4 py-4 flex justify-between items-center">
				<div class="logo">
					<span class="text-xl font-bold neon-text">欢迎来到我的主页</span>
				</div>
				<div class="menu hidden md:flex">
					<a
						v-for="(item, index) in navItems"
						:key="index"
						:href="item.link"
						class="mx-3 text-base transition-colors duration-300 hover-glow"
					>
						{{ item.text }}
					</a>
				</div>
				<div class="md:hidden">
					<el-button icon class="neon-btn" @click="mobileMenuVisible = !mobileMenuVisible">
						<el-icon>
							<Menu />
						</el-icon>
					</el-button>
				</div>
			</div>
		</header>
		<!-- 移动端菜单 -->
		<div class="mobile-menu fixed top-0 right-0 bottom-0 z-50 p-4" v-show="mobileMenuVisible" data-aos="fade-left">
			<div class="glass-card h-full w-64 rounded-lg shadow-lg p-6 flex flex-col">
				<div class="flex justify-between items-center mb-8">
					<span class="text-xl font-bold neon-text">菜单</span>
					<el-button icon class="neon-btn" @click="mobileMenuVisible = false">
						<el-icon>
							<Close />
						</el-icon>
					</el-button>
				</div>
				<div class="flex flex-col">
					<a
						v-for="(item, index) in navItems"
						:key="index"
						:href="item.link"
						class="py-3 border-b border-glow hover-glow"
						@click="mobileMenuVisible = false"
					>
						{{ item.text }}
					</a>
				</div>
			</div>
		</div>
		<!-- 英雄区域 -->
		<section class="hero-section relative flex flex-col justify-center" id="home">
			<div class="container mx-auto px-4 z-10">
				<div class="flex flex-col md:flex-row items-center">
					<div class="md:w-1/2 text-center md:text-left mb-8 md:mb-0" data-aos="fade-right">
						<h1 class="greeting">你好，我是<span class="name neon-text-pulse"> 肖学成</span></h1>
						<h2 class="title neon-gradient-text">前端开发工程师</h2>
						<p class="description mt-4">我热衷于创造优秀的用户体验和高性能的网站应用，擅长将设计转化为高质量的代码。</p>
						<div class="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
							<el-button class="neon-btn-primary pulse-glow" size="large" @click="scrollTo('#projects')">
								查看作品
								<el-icon class="ml-2">
									<Picture />
								</el-icon>
							</el-button>
							<el-button class="neon-btn" size="large" @click="scrollTo('#contact')">
								联系我
								<el-icon class="ml-2">
									<Message />
								</el-icon>
							</el-button>
						</div>
					</div>
					<div class="md:w-1/2 flex justify-center" data-aos="fade-left">
						<div class="profile-image">
							<div class="image-glow-wrapper">
								<img src="@/assets/home/xxc.jpg" alt="前端开发者照片" class="rounded-full" />
							</div>
							<div class="tech-icons">
								<div
									class="tech-icon neon-floating"
									v-for="(icon, index) in techIcons"
									:key="index"
									:style="`--delay: ${index * 0.2}s; --glow-color: ${icon.glowColor};`"
								>
									<img :src="icon.url" :alt="icon.name" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="scroll-down pulse-glow" @click="scrollTo('#about')">
				<el-icon class="animate-bounce">
					<ArrowDown />
				</el-icon>
			</div>
		</section>
		<!-- 关于我 -->
		<section class="about-section py-20" id="about">
			<div class="container mx-auto px-4">
				<h2 class="section-title neon-text text-center mb-16" data-aos="fade-up">关于我</h2>
				<div class="flex flex-col md:flex-row items-center">
					<div class="md:w-1/2 mb-10 md:mb-0" data-aos="fade-right">
						<div class="about-image-wrapper">
							<div class="glow-border">
								<img src="@/assets/home/1.jpg" alt="工作照片" class="rounded-lg" />
							</div>
							<div class="experience-badge neon-badge">
								<span class="years">5+</span>
								<span class="text">年经验</span>
							</div>
						</div>
					</div>
					<div class="md:w-1/2 md:pl-12" data-aos="fade-left">
						<h3 class="text-2xl font-bold mb-4 neon-text">专注于创建优秀的用户体验</h3>
						<p class="mb-4">我是一名拥有5年经验的前端开发工程师，专注于构建高性能、响应式和用户友好的web应用。</p>
						<p class="mb-4">我擅长将设计师的创意转化为功能完善的前端代码，并保持代码的可维护性和可扩展性。</p>
						<p class="mb-6">我不断学习最新的技术和工具，以提升自己的技能和保持竞争力。</p>
						<div class="about-info grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="info-item">
								<span class="info-label">姓名:</span>
								<span class="info-value">肖学成</span>
							</div>
							<div class="info-item">
								<span class="info-label">邮箱:</span>
								<span class="info-value">contact@example.com</span>
							</div>
							<div class="info-item">
								<span class="info-label">位置:</span>
								<span class="info-value">上海市</span>
							</div>
							<div class="info-item">
								<span class="info-label">状态:</span>
								<span class="info-value available neon-text-green">可接受项目</span>
							</div>
						</div>
						<el-button class="neon-btn-primary mt-6" @click="downloadResume">
							下载简历
							<el-icon class="ml-2">
								<Download />
							</el-icon>
						</el-button>
					</div>
				</div>
			</div>
		</section>
		<!-- 技能部分 -->
		<section class="skills-section py-20" id="skills">
			<div class="container mx-auto px-4">
				<h2 class="section-title neon-text text-center mb-16" data-aos="fade-up">我的技能</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<div class="skill-category glass-card" data-aos="zoom-in" data-aos-delay="100">
						<div class="category-header">
							<div class="category-icon neon-icon-blue">
								<el-icon>
									<Grid />
								</el-icon>
							</div>
							<h3 class="category-title neon-text-blue">前端开发</h3>
						</div>
						<div class="skill-items">
							<div class="skill-item" v-for="(skill, index) in frontendSkills" :key="index">
								<div class="skill-info flex justify-between mb-2">
									<span class="skill-name">{{ skill.name }}</span>
								</div>
								<el-progress
									:percentage="skill.level"
									:color="skill.color"
									:show-text="true"
									:stroke-width="12"
									class="neon-progress"
									striped
									striped-flow
									:duration="25"
								/>
							</div>
						</div>
					</div>
					<div class="skill-category glass-card" data-aos="zoom-in" data-aos-delay="200">
						<div class="category-header">
							<div class="category-icon neon-icon-purple">
								<el-icon>
									<SetUp />
								</el-icon>
							</div>
							<h3 class="category-title neon-text-purple">框架与库</h3>
						</div>
						<div class="skill-items">
							<div class="skill-item" v-for="(skill, index) in frameworkSkills" :key="index">
								<div class="skill-info flex justify-between mb-2">
									<span class="skill-name">{{ skill.name }}</span>
								</div>
								<el-progress
									:percentage="skill.level"
									:color="skill.color"
									:show-text="true"
									:stroke-width="12"
									class="neon-progress"
									striped
									striped-flow
									:duration="25"
								/>
							</div>
						</div>
					</div>
					<div class="skill-category glass-card" data-aos="zoom-in" data-aos-delay="300">
						<div class="category-header">
							<div class="category-icon neon-icon-pink">
								<el-icon>
									<Tools />
								</el-icon>
							</div>
							<h3 class="category-title neon-text-pink">工具与其他</h3>
						</div>
						<div class="skill-items">
							<div class="skill-item" v-for="(skill, index) in toolSkills" :key="index">
								<div class="skill-info flex justify-between mb-2">
									<span class="skill-name">{{ skill.name }}</span>
								</div>
								<el-progress
									:percentage="skill.level"
									:color="skill.color"
									:show-text="true"
									:stroke-width="12"
									class="neon-progress"
									striped
									striped-flow
									:duration="25"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- 项目展示 -->
		<section class="projects-section py-20" id="projects">
			<div class="container mx-auto px-4">
				<h2 class="section-title neon-text text-center mb-16" data-aos="fade-up">我的项目</h2>
				<div class="project-filters flex flex-wrap justify-center mb-12 gap-2" data-aos="fade-up">
					<el-button
						v-for="filter in projectFilters"
						:key="filter.value"
						:class="[activeFilter === filter.value ? 'neon-btn-active' : 'neon-btn']"
						@click="activeFilter = filter.value"
					>
						{{ filter.label }}
					</el-button>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<div
						class="project-card glass-card"
						v-for="(project, index) in filteredProjects"
						:key="index"
						data-aos="flip-up"
						:data-aos-delay="index * 100"
					>
						<div class="project-image">
							<img :src="project.image" :alt="project.title" class="w-full" />
							<div class="project-overlay">
								<div class="project-links">
									<a :href="project.demoUrl" target="_blank" class="project-link neon-icon-btn">
										<el-icon>
											<View />
										</el-icon>
									</a>
									<a :href="project.codeUrl" target="_blank" class="project-link neon-icon-btn">
										<el-icon>
											<Connection />
										</el-icon>
									</a>
								</div>
							</div>
						</div>
						<div class="project-info">
							<h3 class="project-title neon-text">{{ project.title }}</h3>
							<p class="project-description">{{ project.description }}</p>
							<div class="project-tech">
								<el-tag v-for="(tech, i) in project.technologies" :key="i" size="small" class="neon-tag mr-2 mb-2">
									{{ tech }}
								</el-tag>
							</div>
						</div>
					</div>
				</div>
				<div class="text-center mt-12" data-aos="fade-up">
					<el-button class="neon-btn-primary" size="large" @click="showMoreProjects">
						查看更多项目
						<el-icon class="ml-2">
							<Right />
						</el-icon>
					</el-button>
				</div>
			</div>
		</section>
		<!-- 工作经历 -->
		<section class="experience-section py-20" id="experience">
			<div class="container mx-auto px-4">
				<h2 class="section-title neon-text text-center mb-16" data-aos="fade-up">工作经历</h2>
				<div class="experience-timeline">
					<div class="timeline-line"></div>
					<div
						class="timeline-item"
						v-for="(job, index) in workExperience"
						:key="index"
						:class="{ 'timeline-right': index % 2 === 1 }"
						data-aos="fade-up"
						:data-aos-delay="index * 100"
					>
						<div class="timeline-badge neon-badge-pulse">
							<el-icon>
								<Briefcase />
							</el-icon>
						</div>
						<div class="timeline-content glass-card">
							<div class="timeline-date neon-tag">{{ job.period }}</div>
							<h3 class="timeline-title neon-text">{{ job.title }}</h3>
							<div class="timeline-company">{{ job.company }}</div>
							<div class="timeline-desc">{{ job.description }}</div>
							<div class="timeline-tech mt-3">
								<el-tag v-for="(tech, i) in job.technologies" :key="i" size="small" class="neon-tag mr-2 mb-2">
									{{ tech }}
								</el-tag>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- 联系部分 -->
		<section class="contact-section py-20" id="contact">
			<div class="container mx-auto px-4">
				<h2 class="section-title neon-text text-center mb-16" data-aos="fade-up">联系我</h2>
				<div class="flex flex-col md:flex-row gap-8">
					<div class="md:w-1/2" data-aos="fade-right">
						<div class="contact-info-wrapper glass-card-gradient">
							<h3 class="text-2xl font-bold mb-6">来聊聊您的项目吧</h3>
							<p class="mb-8">
								无论您需要一个完整的网站、一个应用程序或需要技术咨询，我都很乐意听取您的想法并提供帮助。
							</p>
							<div class="contact-info">
								<div class="info-item flex items-start mb-6">
									<div class="info-icon neon-icon-blue">
										<el-icon>
											<Location />
										</el-icon>
									</div>
									<div class="info-content">
										<h4 class="info-title">位置</h4>
										<p class="info-text">上海市浦东新区</p>
									</div>
								</div>
								<div class="info-item flex items-start mb-6">
									<div class="info-icon neon-icon-purple">
										<el-icon>
											<Message />
										</el-icon>
									</div>
									<div class="info-content">
										<h4 class="info-title">邮箱</h4>
										<p class="info-text">contact@example.com</p>
									</div>
								</div>
								<div class="info-item flex items-start mb-6">
									<div class="info-icon neon-icon-pink">
										<el-icon>
											<Phone />
										</el-icon>
									</div>
									<div class="info-content">
										<h4 class="info-title">电话</h4>
										<p class="info-text">+86 138 **** ****</p>
									</div>
								</div>
							</div>
							<div class="social-links flex gap-4 mt-8">
								<a href="#" class="social-link neon-icon-btn" target="_blank">
									<el-icon>
										<Share />
									</el-icon>
								</a>
								<a href="#" class="social-link neon-icon-btn" target="_blank">
									<el-icon>
										<Link />
									</el-icon>
								</a>
								<a href="#" class="social-link neon-icon-btn" target="_blank">
									<el-icon>
										<Message />
									</el-icon>
								</a>
								<a href="#" class="social-link neon-icon-btn" target="_blank">
									<el-icon>
										<Chat />
									</el-icon>
								</a>
							</div>
						</div>
					</div>
					<div class="md:w-1/2" data-aos="fade-left">
						<div class="contact-form-wrapper glass-card">
							<el-form :model="contactForm" ref="contactFormRef" label-position="top">
								<el-form-item
									label="姓名"
									prop="name"
									:rules="[{ required: true, message: '请输入您的姓名', trigger: 'blur' }]"
								>
									<el-input v-model="contactForm.name" placeholder="您的姓名" class="neon-input"></el-input>
								</el-form-item>
								<el-form-item
									label="邮箱"
									prop="email"
									:rules="[
										{ required: true, message: '请输入您的邮箱', trigger: 'blur' },
										{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
									]"
								>
									<el-input v-model="contactForm.email" placeholder="您的邮箱" class="neon-input"></el-input>
								</el-form-item>
								<el-form-item
									label="主题"
									prop="subject"
									:rules="[{ required: true, message: '请输入主题', trigger: 'blur' }]"
								>
									<el-input v-model="contactForm.subject" placeholder="消息主题" class="neon-input"></el-input>
								</el-form-item>
								<el-form-item
									label="消息"
									prop="message"
									:rules="[{ required: true, message: '请输入您的消息', trigger: 'blur' }]"
								>
									<el-input
										type="textarea"
										v-model="contactForm.message"
										placeholder="您的消息"
										:rows="5"
										class="neon-input"
									></el-input>
								</el-form-item>
								<el-form-item>
									<el-button class="neon-btn-primary w-full" @click="submitContactForm" size="large">
										发送消息
										<el-icon class="ml-2">
											<Position />
										</el-icon>
									</el-button>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- 页脚 -->
		<footer class="footer py-8">
			<div class="container mx-auto px-4">
				<div class="text-center">
					<div class="logo mb-4 neon-text-pulse">肖学成</div>
					<div class="footer-links flex justify-center gap-6 mb-4">
						<a v-for="(item, index) in navItems" :key="index" :href="item.link" class="footer-link hover-glow">
							{{ item.text }}
						</a>
					</div>
					<div class="copyright">&copy; {{ new Date().getFullYear() }} 个人前端开发者网站. 保留所有权利.</div>
				</div>
			</div>
			<div class="back-to-top neon-icon-btn pulse-glow" @click="scrollToTop">
				<el-icon>
					<Top />
				</el-icon>
			</div>
		</footer>
	</div>
</template>
<script setup>
	import { ref, reactive, onMounted, computed } from 'vue'
	import { ElMessage } from 'element-plus'
	import AOS from 'aos'
	import 'aos/dist/aos.css'
	import {
		Menu,
		Close,
		ArrowDown,
		Picture,
		Message,
		Download,
		Grid,
		SetUp,
		Tools,
		View,
		Connection,
		Right,
		Location,
		Phone,
		Position,
		Share,
		Link,
		Briefcase,
		Top
	} from '@element-plus/icons-vue'

	// 导航菜单
	const navItems = [
		{ text: '首页', link: '#home' },
		{ text: '关于', link: '#about' },
		{ text: '技能', link: '#skills' },
		{ text: '项目', link: '#projects' },
		{ text: '经历', link: '#experience' },
		{ text: '联系', link: '#contact' }
	]

	// 移动端菜单
	const mobileMenuVisible = ref(false)

	// 技术图标 - 添加发光颜色
	const techIcons = [
		{
			name: 'HTML5',
			url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
			glowColor: '#E44D26'
		},
		{
			name: 'CSS3',
			url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
			glowColor: '#1572B6'
		},
		{
			name: 'JavaScript',
			url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
			glowColor: '#F7DF1E'
		},
		{
			name: 'Vue.js',
			url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
			glowColor: '#4FC08D'
		},
		{
			name: 'React',
			url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
			glowColor: '#61DAFB'
		},
		{
			name: 'Node.js',
			url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
			glowColor: '#339933'
		}
	]

	// 前端技能 - 使用单色
	const frontendSkills = [
		{ name: 'HTML5/CSS3', level: 95, color: '#ff4b1f' },
		{ name: 'JavaScript', level: 90, color: '#f9d423' },
		{ name: 'TypeScript', level: 85, color: '#0072ff' },
		{ name: 'Sass/Less', level: 90, color: '#fc5c7d' }
	]

	// 框架技能 - 使用单色
	const frameworkSkills = [
		{ name: 'Vue.js', level: 95, color: '#11998e' },
		{ name: 'React', level: 85, color: '#4facfe' },
		{ name: 'Angular', level: 75, color: '#8e2de2' },
		{ name: 'Nuxt.js', level: 80, color: '#1ed7b5' }
	]

	// 工具技能 - 使用单色
	const toolSkills = [
		{ name: 'Webpack/Vite', level: 85, color: '#f83600' },
		{ name: 'Git/GitHub', level: 90, color: '#5433ff' },
		{ name: 'UI/UX', level: 75, color: '#9733ee' },
		{ name: 'Node.js', level: 80, color: '#02aab0' }
	]

	// 项目过滤器
	const projectFilters = [
		{ label: '全部', value: 'all' },
		{ label: 'Web应用', value: 'web' },
		{ label: '移动应用', value: 'mobile' },
		{ label: 'UI/UX', value: 'ui' }
	]

	const activeFilter = ref('all')

	// 项目数据 - 更换为更可靠的图片链接
	const projects = [
		{
			title: '企业管理系统',
			description: '基于Vue 3和Element Plus的企业资源管理系统，包含用户管理、权限控制等功能。',
			image: 'https://picsum.photos/800/600?random=1',
			demoUrl: '#',
			codeUrl: '#',
			technologies: ['Vue 3', 'Vite', 'Element Plus', 'Pinia'],
			category: 'web'
		},
		{
			title: '电商移动应用',
			description: '使用Vue 3和Vant UI构建的移动端电子商务应用，支持商品浏览、购物车、支付等功能。',
			image: 'https://picsum.photos/800/600?random=2',
			demoUrl: '#',
			codeUrl: '#',
			technologies: ['Vue 3', 'Vant UI', 'Unocss', 'VueUse'],
			category: 'mobile'
		},
		{
			title: '个人博客平台',
			description: '使用Nuxt.js和TailwindCSS开发的个人博客系统，支持Markdown编辑和代码高亮。',
			image: 'https://picsum.photos/800/600?random=3',
			demoUrl: '#',
			codeUrl: '#',
			technologies: ['Nuxt.js', 'TailwindCSS', 'Markdown-it'],
			category: 'web'
		},
		{
			title: '数据可视化仪表板',
			description: '使用React和Echarts构建的数据可视化平台，提供多种图表类型和实时数据更新。',
			image: 'https://picsum.photos/800/600?random=4',
			demoUrl: '#',
			codeUrl: '#',
			technologies: ['React', 'Echarts', 'Redux', 'Axios'],
			category: 'web'
		},
		{
			title: 'UI组件库设计',
			description: '从零开始设计和开发的UI组件库，包含常用组件和主题定制能力。',
			image: 'https://picsum.photos/800/600?random=5',
			demoUrl: '#',
			codeUrl: '#',
			technologies: ['Vue 3', 'TypeScript', 'Sass', 'Storybook'],
			category: 'ui'
		},
		{
			title: '健康追踪App',
			description: '帮助用户记录健康数据和健身活动的移动应用，支持数据分析和目标设定。',
			image: 'https://picsum.photos/800/600?random=6',
			demoUrl: '#',
			codeUrl: '#',
			technologies: ['React Native', 'Redux', 'Firebase'],
			category: 'mobile'
		}
	]

	// 过滤项目
	const filteredProjects = computed(() => {
		if (activeFilter.value === 'all') {
			return projects
		}
		return projects.filter((project) => project.category === activeFilter.value)
	})

	// 工作经历
	const workExperience = [
		{
			title: '高级前端开发工程师',
			company: 'ABC科技有限公司',
			period: '2021 - 至今',
			description: '负责企业级应用的前端架构设计和开发，优化前端性能，指导初级开发人员。',
			technologies: ['Vue 3', 'TypeScript', 'Micro Frontend', 'Element Plus']
		},
		{
			title: '前端开发工程师',
			company: 'XYZ互联网公司',
			period: '2018 - 2021',
			description: '参与多个web应用项目的开发，负责UI组件实现和前端逻辑编写。',
			technologies: ['React', 'Redux', 'Ant Design', 'Webpack']
		},
		{
			title: '初级前端开发',
			company: '创新科技工作室',
			period: '2016 - 2018',
			description: '参与网站和小程序的开发，负责页面切图和基础交互实现。',
			technologies: ['jQuery', 'Bootstrap', 'CSS3', 'Mini Program']
		}
	]

	// 联系表单
	const contactFormRef = ref(null)
	const contactForm = reactive({
		name: '',
		email: '',
		subject: '',
		message: ''
	})

	// 滚动检测
	const isScrolled = ref(false)

	// 方法
	const scrollTo = (selector) => {
		const element = document.querySelector(selector)
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' })
		}
	}

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	}

	const downloadResume = () => {
		ElMessage({
			message: '简历下载开始',
			type: 'success'
		})
		// 实际下载逻辑...
	}

	const showMoreProjects = () => {
		ElMessage({
			message: '更多项目即将展示',
			type: 'info'
		})
		// 加载更多项目的逻辑...
	}

	const submitContactForm = async () => {
		if (!contactFormRef.value) return

		await contactFormRef.value.validate((valid) => {
			if (valid) {
				ElMessage({
					message: '消息已发送，我会尽快回复您！',
					type: 'success'
				})
				// 重置表单
				contactForm.name = ''
				contactForm.email = ''
				contactForm.subject = ''
				contactForm.message = ''
			}
		})
	}

	// 监听滚动事件
	const handleScroll = () => {
		isScrolled.value = window.scrollY > 50
	}

	onMounted(() => {
		// 初始化AOS动画
		AOS.init({
			duration: 1000,
			easing: 'ease-in-out',
			once: true,
			offset: 100
		})

		// 添加滚动监听
		window.addEventListener('scroll', handleScroll)
		handleScroll() // 初始检查
	})
</script>
<style scoped lang="scss">
	// 霓虹灯效果变量
	$neon-blue: #00f7ff;
	$neon-purple: #bd4ce6;
	$neon-pink: #fe53bb;
	$neon-green: #00ff88;
	$neon-yellow: #ffd700;
	$neon-blue-glow: 0 0 10px rgba(0, 247, 255, 0.5), 0 0 20px rgba(0, 247, 255, 0.3), 0 0 30px rgba(0, 247, 255, 0.1);
	$neon-purple-glow: 0 0 10px rgba(189, 76, 230, 0.5), 0 0 20px rgba(189, 76, 230, 0.3),
		0 0 30px rgba(189, 76, 230, 0.1);
	$neon-pink-glow: 0 0 10px rgba(254, 83, 187, 0.5), 0 0 20px rgba(254, 83, 187, 0.3), 0 0 30px rgba(254, 83, 187, 0.1);
	$neon-green-glow: 0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3), 0 0 30px rgba(0, 255, 136, 0.1);
	$neon-yellow-glow: 0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.1);

	// 全局变量
	$dark-bg: #0a0a14;
	$darker-bg: #050510;
	$card-bg: rgba(20, 20, 35, 0.7);
	$text-color: #e0e0e0;
	$text-muted: #a0a0a0;
	$transition-time: 0.3s;
	$box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

	// 深色主题全局样式
	.dark-theme {
		color: $text-color;
		font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, 'Microsoft YaHei', Arial, sans-serif;
		background-color: $dark-bg;
		position: relative;
		overflow-x: hidden;
	}

	// 背景效果 - 霓虹风格
	.bg-effect {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		overflow: hidden;

		.bg-gradient {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: radial-gradient(circle at center, $darker-bg 0%, $dark-bg 50%, $darker-bg 100%);
		}

		.bg-grid {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: linear-gradient(rgba(66, 28, 82, 0.1) 1px, transparent 1px),
				linear-gradient(90deg, rgba(66, 28, 82, 0.1) 1px, transparent 1px);
			background-size: 40px 40px;
			background-position: center center;
		}

		.bg-glow {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: radial-gradient(circle at 20% 30%, rgba(189, 76, 230, 0.15) 0%, transparent 50%),
				radial-gradient(circle at 80% 70%, rgba(0, 247, 255, 0.15) 0%, transparent 50%),
				radial-gradient(circle at 50% 50%, rgba(254, 83, 187, 0.05) 0%, transparent 70%);
		}

		.neon-circle {
			position: absolute;
			border-radius: 50%;
			filter: blur(60px);
			opacity: 0.07;

			&.circle-1 {
				width: 300px;
				height: 300px;
				background-color: $neon-purple;
				top: 20%;
				left: 15%;
				animation: float-slow 15s ease-in-out infinite alternate;
			}

			&.circle-2 {
				width: 400px;
				height: 400px;
				background-color: $neon-blue;
				bottom: 10%;
				right: 10%;
				animation: float-slow 20s ease-in-out infinite alternate-reverse;
			}
		}
	}

	// 霓虹文字效果
	.neon-text {
		color: $neon-blue;
		text-shadow: $neon-blue-glow;
	}

	.neon-text-blue {
		color: $neon-blue;
		text-shadow: $neon-blue-glow;
	}

	.neon-text-purple {
		color: $neon-purple;
		text-shadow: $neon-purple-glow;
	}

	.neon-text-pink {
		color: $neon-pink;
		text-shadow: $neon-pink-glow;
	}

	.neon-text-green {
		color: $neon-green;
		text-shadow: $neon-green-glow;
	}

	// 脉冲霓虹文字
	.neon-text-pulse {
		animation: neon-pulse 2s infinite alternate;
	}

	// 渐变文字
	.neon-gradient-text {
		font-size: 3rem;
		font-weight: 800;
		background: linear-gradient(to right, $neon-purple, $neon-blue);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	}

	// 发光悬停效果
	.hover-glow {
		transition: color 0.3s, text-shadow 0.3s;

		&:hover {
			color: white;
			text-shadow: $neon-blue-glow;
		}
	}

	// 发光边框按钮
	.neon-btn {
		background-color: rgba(20, 20, 40, 0.5);
		border: 1px solid rgba(0, 247, 255, 0.3);
		border-radius: 6px;
		color: $text-color;
		position: relative;
		overflow: hidden;
		transition: all 0.3s;
		box-shadow: 0 0 5px rgba(0, 247, 255, 0.2);

		&:hover {
			background-color: rgba(0, 247, 255, 0.1);
			border-color: $neon-blue;
			color: white;
			box-shadow: $neon-blue-glow;
		}

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			background: linear-gradient(90deg, transparent, rgba(0, 247, 255, 0.2), transparent);
			transition: left 0.5s;
		}

		&:hover::before {
			left: 100%;
		}
	}

	// 发光主要按钮
	.neon-btn-primary {
		background: linear-gradient(135deg, rgba(189, 76, 230, 0.8), rgba(0, 247, 255, 0.8));
		border: none;
		border-radius: 6px;
		color: white;
		position: relative;
		overflow: hidden;
		transition: all 0.3s;
		box-shadow: 0 0 10px rgba(0, 247, 255, 0.3), 0 0 20px rgba(189, 76, 230, 0.1);

		&:hover {
			transform: translateY(-3px);
			box-shadow: 0 0 15px rgba(0, 247, 255, 0.5), 0 0 30px rgba(189, 76, 230, 0.3);
		}
	}

	// 激活按钮状态
	.neon-btn-active {
		background: linear-gradient(135deg, rgba(189, 76, 230, 0.8), rgba(0, 247, 255, 0.8));
		border: none;
		border-radius: 6px;
		color: white;
		box-shadow: $neon-blue-glow;
	}

	// 脉冲发光效果
	.pulse-glow {
		animation: pulse-animation 2s infinite;
	}

	// 玻璃拟态卡片
	.glass-card {
		background: rgba(20, 20, 35, 0.7);
		backdrop-filter: blur(10px);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		transition: transform 0.3s, box-shadow 0.3s;

		&:hover {
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 247, 255, 0.2);
		}
	}

	// 渐变背景卡片
	.glass-card-gradient {
		background: linear-gradient(135deg, rgba(189, 76, 230, 0.2), rgba(0, 247, 255, 0.2));
		backdrop-filter: blur(10px);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		padding: 2rem;
		color: white;
	}

	// 霓虹边框
	.glow-border {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		padding: 2px;
		background: linear-gradient(135deg, $neon-purple, $neon-blue, $neon-pink);
		animation: border-glow 3s infinite alternate;

		img {
			border-radius: 10px;
			display: block;
			width: 100%;
		}
	}

	// 霓虹图标
	.neon-icon-blue {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		background: rgba(0, 247, 255, 0.1);
		border-radius: 10px;
		color: $neon-blue;
		font-size: 1.5rem;
		box-shadow: $neon-blue-glow;
	}

	.neon-icon-purple {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		background: rgba(189, 76, 230, 0.1);
		border-radius: 10px;
		color: $neon-purple;
		font-size: 1.5rem;
		box-shadow: $neon-purple-glow;
	}

	.neon-icon-pink {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		background: rgba(254, 83, 187, 0.1);
		border-radius: 10px;
		color: $neon-pink;
		font-size: 1.5rem;
		box-shadow: $neon-pink-glow;
	}

	// 霓虹图标按钮
	.neon-icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: rgba(30, 30, 50, 0.7);
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: $neon-blue;
		font-size: 1.2rem;
		transition: all 0.3s;

		&:hover {
			background: rgba(0, 247, 255, 0.1);
			color: white;
			box-shadow: $neon-blue-glow;
			transform: translateY(-3px);
		}
	}

	// 霓虹徽章
	.neon-badge {
		background: linear-gradient(135deg, $neon-purple, $neon-blue);
		color: white;
		box-shadow: 0 0 15px rgba(189, 76, 230, 0.5);
	}

	// 霓虹徽章脉冲
	.neon-badge-pulse {
		background: $neon-purple;
		color: white;
		animation: badge-pulse 2s infinite alternate;
	}

	// 霓虹标签
	.neon-tag {
		background: rgba(30, 30, 50, 0.7);
		border: 1px solid rgba(0, 247, 255, 0.3);
		color: $text-color;
		backdrop-filter: blur(5px);

		&:hover {
			background: rgba(0, 247, 255, 0.1);
			color: white;
			box-shadow: $neon-blue-glow;
		}
	}

	// 霓虹进度条
	.neon-progress {
		:deep(.el-progress-bar__outer) {
			background-color: rgba(255, 255, 255, 0.1) !important;
			border-radius: 10px;
		}

		:deep(.el-progress-bar__inner) {
			border-radius: 10px;
			box-shadow: 0 0 10px rgba(0, 247, 255, 0.5);
		}

		:deep(.el-progress__text) {
			color: $text-color !important;
			font-size: 14px !important;
		}
	}

	// 霓虹输入框
	.neon-input {
		:deep(.el-input__wrapper) {
			background-color: rgba(30, 30, 50, 0.7) !important;
			border: 1px solid rgba(0, 247, 255, 0.3) !important;
			box-shadow: none !important;

			&.is-focus {
				border-color: $neon-blue !important;
				box-shadow: $neon-blue-glow !important;
			}
		}

		:deep(.el-input__inner) {
			color: $text-color !important;
		}

		:deep(.el-textarea__inner) {
			background-color: rgba(30, 30, 50, 0.7) !important;
			border: 1px solid rgba(0, 247, 255, 0.3) !important;
			color: $text-color !important;

			&:focus {
				border-color: $neon-blue !important;
				box-shadow: $neon-blue-glow !important;
			}
		}
	}

	// 导航栏
	.navbar {
		transition: all $transition-time;
		backdrop-filter: blur(10px);
		background-color: rgba(10, 10, 20, 0.7);

		&.navbar-scrolled {
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
		}

		a {
			color: $text-color;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				bottom: -4px;
				left: 0;
				width: 0;
				height: 2px;
				background: linear-gradient(to right, $neon-purple, $neon-blue);
				transition: width $transition-time;
			}

			&:hover::after {
				width: 100%;
			}
		}
	}

	// 移动端菜单
	.mobile-menu {
		background-color: rgba(0, 0, 0, 0.7);

		a {
			color: $text-color;
		}

		.border-glow {
			border-color: rgba(0, 247, 255, 0.2);
		}
	}

	// 英雄区域
	.hero-section {
		min-height: 100vh;
		padding: 120px 0 60px;
		position: relative;
		overflow: hidden;

		.greeting {
			font-size: 1.5rem;
			margin-bottom: 0.5rem;
			color: $text-color;
		}

		.name {
			color: $neon-blue;
			font-weight: bold;
		}

		.description {
			font-size: 1.2rem;
			line-height: 1.6;
			max-width: 600px;
			color: $text-muted;
		}

		.profile-image {
			position: relative;

			.image-glow-wrapper {
				position: relative;
				width: 300px;
				height: 300px;
				border-radius: 50%;
				padding: 4px;
				background: linear-gradient(135deg, $neon-purple, $neon-blue);
				animation: border-glow 3s infinite alternate;

				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					object-fit: cover;
				}
			}

			.tech-icons {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				pointer-events: none;

				.tech-icon {
					position: absolute;
					width: 70px;
					height: 70px;
					background-color: rgba(10, 10, 20, 0.7);
					backdrop-filter: blur(5px);
					border-radius: 50%;
					box-shadow: 0 0 15px rgba(var(--glow-color), 0.5);
					display: flex;
					align-items: center;
					justify-content: center;
					animation: float 3s ease-in-out infinite;
					animation-delay: var(--delay);
					border: 2px solid rgba(255, 255, 255, 0.1);

					img {
						width: 40px;
						height: 40px;
					}

					&:nth-child(1) {
						top: 10%;
						left: -20%;
					}

					&:nth-child(2) {
						top: 20%;
						right: -20%;
					}

					&:nth-child(3) {
						bottom: 30%;
						left: -25%;
					}

					&:nth-child(4) {
						bottom: 20%;
						right: -25%;
					}

					&:nth-child(5) {
						top: -15%;
						left: 50%;
						transform: translateX(-50%);
					}

					&:nth-child(6) {
						bottom: -15%;
						left: 50%;
						transform: translateX(-50%);
					}
				}
			}
		}

		.scroll-down {
			position: absolute;
			bottom: 30px;
			left: 50%;
			transform: translateX(-50%);
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background: linear-gradient(135deg, $neon-purple, $neon-blue);
			color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			z-index: 10;
			box-shadow: 0 0 15px rgba(189, 76, 230, 0.5);
		}
	}

	// 关于部分
	.about-section {
		position: relative;

		.about-image-wrapper {
			position: relative;

			.experience-badge {
				position: absolute;
				bottom: -20px;
				right: 20px;
				width: 100px;
				height: 100px;
				border-radius: 50%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				box-shadow: 0 0 20px rgba(189, 76, 230, 0.5);

				.years {
					font-size: 1.8rem;
					font-weight: 700;
					line-height: 1;
				}

				.text {
					font-size: 0.9rem;
				}
			}
		}

		.about-info {
			.info-item {
				margin-bottom: 0.5rem;

				.info-label {
					font-weight: 600;
					margin-right: 0.5rem;
					color: $text-muted;
				}
			}
		}
	}

	// 技能部分
	.skills-section {
		position: relative;

		.skill-category {
			padding: 2rem;
			height: 100%;

			.category-header {
				display: flex;
				align-items: center;
				margin-bottom: 1.5rem;

				.category-title {
					font-size: 1.5rem;
					font-weight: 600;
					margin-left: 1rem;
				}
			}

			.skill-items {
				.skill-item {
					margin-bottom: 1.5rem;

					.skill-info {
						.skill-name {
							font-weight: 500;
							color: $text-color;
						}
					}
				}
			}
		}
	}

	// 项目部分
	.projects-section {
		position: relative;

		.project-card {
			height: 100%;
			border-radius: 12px;
			overflow: hidden;
			transition: transform $transition-time;

			&:hover {
				transform: translateY(-10px);

				.project-overlay {
					opacity: 1;
				}
			}

			.project-image {
				height: 200px;
				position: relative;
				overflow: hidden;

				img {
					height: 100%;
					width: 100%;
					object-fit: cover;
					transition: transform $transition-time;
				}

				.project-overlay {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: linear-gradient(135deg, rgba(189, 76, 230, 0.8), rgba(0, 247, 255, 0.8));
					display: flex;
					align-items: center;
					justify-content: center;
					opacity: 0;
					transition: opacity $transition-time;

					.project-links {
						display: flex;
						gap: 10px;
					}
				}
			}

			.project-info {
				padding: 1.5rem;

				.project-title {
					font-size: 1.2rem;
					font-weight: 600;
					margin-bottom: 0.5rem;
				}

				.project-description {
					color: $text-muted;
					margin-bottom: 1rem;
					line-height: 1.5;
				}
			}
		}
	}

	// 经验部分
	.experience-section {
		position: relative;

		.experience-timeline {
			position: relative;
			max-width: 1000px;
			margin: 0 auto;

			.timeline-line {
				position: absolute;
				top: 0;
				bottom: 0;
				left: 50%;
				width: 2px;
				background: linear-gradient(to bottom, $neon-purple, $neon-blue);
				transform: translateX(-50%);
				box-shadow: $neon-blue-glow;
			}

			.timeline-item {
				position: relative;
				padding: 2rem 0;
				width: 50%;
				padding-right: 40px;
				text-align: right;

				&.timeline-right {
					margin-left: 50%;
					padding-right: 0;
					padding-left: 40px;
					text-align: left;

					.timeline-badge {
						left: -20px;
						right: auto;
					}
				}

				.timeline-badge {
					position: absolute;
					top: 2rem;
					right: -20px;
					width: 40px;
					height: 40px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					z-index: 1;
				}

				.timeline-content {
					padding: 1.5rem;
					border-radius: 12px;

					.timeline-date {
						display: inline-block;
						padding: 0.3rem 0.8rem;
						border-radius: 4px;
						font-size: 0.9rem;
						margin-bottom: 0.5rem;
					}

					.timeline-title {
						font-size: 1.2rem;
						font-weight: 600;
						margin-bottom: 0.3rem;
					}

					.timeline-company {
						color: $text-muted;
						margin-bottom: 1rem;
					}

					.timeline-desc {
						line-height: 1.5;
						color: $text-muted;
					}
				}
			}
		}
	}

	// 联系部分
	.contact-section {
		position: relative;

		.contact-info-wrapper {
			height: 100%;
			color: white;

			h3 {
				font-weight: 700;
			}

			.info-item {
				.info-content {
					.info-title {
						font-weight: 600;
						margin-bottom: 0.3rem;
					}
				}
			}
		}

		.contact-form-wrapper {
			height: 100%;
			padding: 2rem;
		}
	}

	// 页脚
	.footer {
		background-color: $darker-bg;
		color: $text-color;
		position: relative;

		.logo {
			font-size: 1.5rem;
			font-weight: 700;
		}

		.footer-links {
			.footer-link {
				color: rgba(255, 255, 255, 0.7);
				transition: color $transition-time;
			}
		}

		.copyright {
			color: rgba(255, 255, 255, 0.5);
		}

		.back-to-top {
			position: absolute;
			right: 30px;
			bottom: 30px;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: transform $transition-time;

			&:hover {
				transform: translateY(-5px);
			}
		}
	}

	// 霓虹浮动图标
	.neon-floating {
		box-shadow: 0 0 15px rgba(var(--glow-color), 0.5);
		animation: float 3s ease-in-out infinite;
	}

	// 动画定义
	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-15px);
		}
	}

	@keyframes float-slow {
		0%,
		100% {
			transform: translate(0, 0);
		}

		50% {
			transform: translate(30px, 30px);
		}
	}

	@keyframes neon-pulse {
		0%,
		100% {
			opacity: 1;
			text-shadow: $neon-blue-glow;
		}

		50% {
			opacity: 0.8;
			text-shadow: 0 0 20px rgba(0, 247, 255, 0.8), 0 0 40px rgba(0, 247, 255, 0.6), 0 0 60px rgba(0, 247, 255, 0.4);
		}
	}

	@keyframes pulse-animation {
		0%,
		100% {
			box-shadow: 0 0 10px rgba(0, 247, 255, 0.5), 0 0 20px rgba(0, 247, 255, 0.3);
		}

		50% {
			box-shadow: 0 0 20px rgba(0, 247, 255, 0.8), 0 0 40px rgba(0, 247, 255, 0.5);
		}
	}

	@keyframes border-glow {
		0%,
		100% {
			box-shadow: 0 0 15px rgba(189, 76, 230, 0.5), 0 0 30px rgba(0, 247, 255, 0.3);
		}

		50% {
			box-shadow: 0 0 20px rgba(0, 247, 255, 0.7), 0 0 40px rgba(189, 76, 230, 0.4);
		}
	}

	@keyframes badge-pulse {
		0%,
		100% {
			background-color: $neon-purple;
			box-shadow: 0 0 10px rgba(189, 76, 230, 0.5);
		}

		50% {
			background-color: $neon-blue;
			box-shadow: 0 0 20px rgba(0, 247, 255, 0.7);
		}
	}

	// 媒体查询
	@media (max-width: 768px) {
		.experience-timeline {
			.timeline-line {
				left: 20px;
			}

			.timeline-item {
				width: 100%;
				padding-right: 0;
				padding-left: 60px;
				text-align: left;
				margin-left: 0 !important;

				.timeline-badge {
					left: 0 !important;
					right: auto !important;
				}
			}
		}
	}
</style>
