<template>
    <div class="portfolio-container" ref="containerRef">
        <!-- 鼠标跟随光晕 -->
        <div class="cursor-glow" ref="cursorGlow"></div>

        <!-- 动态背景 -->
        <div class="bg-scene">
            <div class="bg-base"></div>
            <div class="grid-lines"></div>
            <div class="spotlight"></div>
        </div>

        <!-- 顶部固定导航 -->
        <header class="fixed-header">
            <div class="header-inner">
                <div class="nav-brand">XXC<span class="dot">.</span>DEV</div>
                <nav class="nav-links">
                    <a
                        v-for="item in navItems"
                        :key="item.link"
                        @click.prevent="scrollTo(item.link)"
                        :class="{ active: activeSection === item.link }"
                    >
                        {{ item.text }}
                    </a>
                </nav>
            </div>
        </header>

        <!-- Hero 区域 -->
        <section class="hero-section" id="home">
            <div class="hero-container">
                <!-- 左侧：文字 -->
                <div class="hero-text-wrapper">
                    <h1 class="hero-title">
                        <div class="line-mask"><span class="word-reveal">DIGITAL</span></div>
                        <div class="line-mask highlight-mask">
                            <span class="word-reveal accent-text">ARCHITECT</span>
                        </div>
                        <div class="line-mask"><span class="word-reveal">& CREATOR</span></div>
                    </h1>
                    <div class="hero-sub-wrapper">
                        <p class="hero-desc">
                            我是 <span class="neon-highlight">肖学成</span>。
                            <br />
                            以代码为笔，构建极致交互的数字体验。
                            <br />
                            <span class="sub-gray">专注 Vue生态 / 3D交互 / 性能优化</span>
                        </p>
                    </div>
                </div>

                <!-- 右侧：个人形象 -->
                <div class="hero-visual">
                    <div class="visual-inner">
                        <div class="orbit-ring ring-1"></div>
                        <div class="orbit-ring ring-2"></div>
                        <div class="photo-frame">
                            <img src="@/assets/mine/xxc.jpg" alt="肖学成" class="hero-img" />
                            <div class="glitch-overlay"></div>
                        </div>
                        <div class="float-card code-snippet">
                            <span>&lt;Code /&gt;</span>
                        </div>
                        <div class="float-card exp-badge">
                            <span>5+ Years</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="scroll-indicator">
                <span>SCROLL TO EXPLORE</span>
                <div class="line"></div>
            </div>
        </section>

        <!-- About -->
        <section class="section-container about-section" id="about">
            <div class="section-label">01 / IDENTITY</div>

            <div class="about-content-single">
                <h3 class="section-heading">Logic crafted <br />into Intuition.</h3>
                <p class="bio-text">
                    在混乱的代码丛林中构建秩序。
                    <br /><br />
                    我追求技术架构的极致理性与用户感知的极致感性。不只是交付功能，更是在虚拟与现实的边界，雕琢毫秒级的流畅体验与像素级的视觉精度。从底层逻辑到交互表层，皆为作品。
                </p>
                <div class="tech-stack-row">
                    <span class="tech-pill">Architecture</span>
                    <span class="tech-pill">Creative Coding</span>
                    <span class="tech-pill">Performance</span>
                    <span class="tech-pill">WebGL</span>
                </div>
            </div>
        </section>

        <!-- Projects -->
        <section class="section-container projects-section" id="projects">
            <div class="section-header">
                <div class="section-label">02 / OPUS</div>
                <h2 class="big-heading">DIGITAL<br />CRAFTSMANSHIP</h2>
            </div>

            <div class="project-list">
                <div class="project-row" v-for="(project, index) in projects" :key="index">
                    <div class="project-content">
                        <span class="project-id">0{{ index + 1 }}</span>
                        <h3 class="project-title">{{ project.title }}</h3>
                        <p class="project-desc">{{ project.description }}</p>
                        <div class="project-meta">
                            <span v-for="t in project.technologies" :key="t">{{ t }}</span>
                        </div>
                    </div>
                    <div class="project-thumbnail">
                        <div class="thumb-inner" :style="{ backgroundImage: `url(${project.image})` }"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Experience -->
        <section class="section-container experience-section" id="experience">
            <div class="section-label">03 / TRAJECTORY</div>

            <div class="clean-timeline">
                <div class="timeline-row" v-for="(job, index) in workExperience" :key="index">
                    <div class="timeline-date">
                        {{ job.period }}
                    </div>
                    <div class="timeline-divider">
                        <div class="dot"></div>
                    </div>
                    <div class="timeline-content">
                        <div class="job-header">
                            <h3 class="role">{{ job.title }}</h3>
                            <span class="company">@ {{ job.company }}</span>
                        </div>
                        <p class="desc">{{ job.description }}</p>
                        <div class="tags">
                            <span v-for="tag in job.technologies" :key="tag">{{ tag }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact -->
        <section class="section-container contact-section" id="contact">
            <div class="contact-content">
                <h2 class="contact-cta">
                    LET'S TALK <br />
                    <span class="highlight">CODE & ART.</span>
                </h2>

                <div class="footer-grid">
                    <div class="footer-col">
                        <h4>联系方式</h4>
                        <a href="mailto:cheng71130@gmail.com" class="footer-link email">cheng71130@gmail.com</a>
                        <p class="phone">+86 189 0902 8186</p>
                    </div>
                    <div class="footer-col">
                        <h4>专业领域</h4>
                        <ul class="service-list">
                            <li>Web 应用程序开发</li>
                            <li>复杂系统架构设计</li>
                            <li>创意交互与动效</li>
                            <li>3D 数据可视化</li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>社交媒体</h4>
                        <div class="social-links">
                            <a href="#" class="social-link">GitHub</a>
                            <a href="#" class="social-link">JueJin</a>
                            <a href="#" class="social-link">WeChat</a>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <span>© 2025 XXC.DEV</span>
                    <span class="scroll-top" @click="scrollTo('#home')">BACK TO TOP</span>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';

    gsap.registerPlugin(ScrollTrigger);

    const cursorGlow = ref(null);
    const activeSection = ref('#home');

    const navItems = [
        { text: 'Home', link: '#home' },
        { text: 'Identity', link: '#about' },
        { text: 'Opus', link: '#projects' },
        { text: 'Trajectory', link: '#experience' },
        { text: 'Contact', link: '#contact' },
    ];

    const projects = [
        {
            title: '企业级 ERP 管理系统',
            description:
                '重构千万级数据流转逻辑。引入动态微内核架构，将复杂业务解耦，实现亚秒级响应与动态权限的原子化控制。',
            technologies: ['System Architecture', 'Vue 3', 'TypeScript'],
            image: 'https://picsum.photos/600/400?random=1',
        },
        {
            title: '沉浸式 3D 电商展示',
            description:
                '突破 Web 渲染边界。基于 PBR 材质流与光线追踪模拟，在移动端实现电影级的产品交互展示，重塑数字零售体验。',
            technologies: ['WebGL', 'GLSL', 'Three.js'],
            image: 'https://picsum.photos/600/400?random=2',
        },
        {
            title: '智慧城市可视化大屏',
            description: '赋予枯燥数据以生命。利用 GPGPU 加速渲染海量地理信息，将城市脉搏转化为可感知的视觉语言。',
            technologies: ['Data Art', 'D3.js', 'Canvas'],
            image: 'https://picsum.photos/600/400?random=3',
        },
    ];

    const workExperience = [
        {
            title: '高级前端开发工程师',
            company: '四川万网鑫成',
            period: '2025 - PRESENT',
            description:
                '定义技术标准。主导核心架构演进，推行微前端方案拆解巨石应用，建立工程化体系以支撑团队高效产出。',
            technologies: ['Tech Lead', 'Micro-Frontend', 'DevOps'],
        },
        {
            title: '前端开发工程师',
            company: '上海数设科技',
            period: '2021 - 2025',
            description: '性能炼金术师。重构遗留系统，将首屏渲染效率提升 40%。主导通用组件库建设，统一产品设计语言。',
            technologies: ['Refactor', 'Vue 3', 'Performance'],
        },
        {
            title: '初级开发工程师',
            company: '苏州帝泰克',
            period: '2020 - 2021',
            description: '多端交互实现。负责响应式布局与小程序生态开发，确保设计愿景在不同终端的无损还原。',
            technologies: ['Cross-Platform', 'CSS3', 'Uni-app'],
        },
    ];

    const scrollTo = (selector: string) => {
        activeSection.value = selector;
        document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
    };

    const moveCursor = (e: MouseEvent) => {
        if (cursorGlow.value) {
            gsap.to(cursorGlow.value, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: 'power2.out',
            });
        }
    };

    onMounted(() => {
        window.addEventListener('mousemove', moveCursor);

        const tl = gsap.timeline();
        tl.from('.word-reveal', { y: 120, duration: 1, stagger: 0.15, ease: 'power4.out' })
            .from('.hero-sub-wrapper', { opacity: 0, y: 20, duration: 1 }, '-=0.5')
            .from('.fixed-header', { y: -100, duration: 1 }, '-=0.8');

        gsap.from('.hero-visual', {
            opacity: 0,
            x: 50,
            duration: 1.5,
            delay: 0.5,
            ease: 'power3.out',
        });

        gsap.to('.float-card', {
            y: 15,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: 1,
        });

        const sections = ['.about-content-single', '.project-row', '.timeline-row'];
        sections.forEach((sel) => {
            gsap.utils.toArray(sel).forEach((el: any) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 85%' },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                });
            });
        });

        gsap.from('.contact-cta', {
            scrollTrigger: { trigger: '.contact-section', start: 'top 75%' },
            y: 50,
            opacity: 0,
            duration: 1,
        });
    });

    onUnmounted(() => {
        window.removeEventListener('mousemove', moveCursor);
        ScrollTrigger.getAll().forEach((t) => t.kill());
    });
</script>

<style scoped lang="scss">
    @use './styles/dark.scss';
    // @use './styles/light.scss';
</style>
