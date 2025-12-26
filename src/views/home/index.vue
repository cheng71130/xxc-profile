<template>
    <el-container class="main-container">
        <div class="particles">
            <div class="particle" v-for="i in 30" :key="i" :style="particleStyle(i)"></div>
        </div>

        <div class="neon-grid"></div>

        <el-header class="header">
            <div class="header-content">
                <div class="logo-icon">✨</div>
                <h1 class="title">
                    <span
                        class="title-word"
                        v-for="(word, i) in titleWords"
                        :key="i"
                        :style="`animation-delay: ${i * 0.1}s`"
                    >
                        {{ word }}
                    </span>
                </h1>
                <div class="header-glow"></div>
            </div>
        </el-header>

        <el-main class="main">
            <div class="content">
                <div
                    class="card"
                    v-for="(item, index) in cards"
                    :key="index"
                    @click="toNavigation(item.path)"
                    :style="`animation-delay: ${index * 0.15}s`"
                >
                    <div class="card-shine-effect"></div>
                    <div class="card-glow-pulse"></div>

                    <div class="card-image-wrapper">
                        <img :src="item.img" alt="Card Image" class="card-img" />
                        <div class="image-overlay"></div>

                        <div class="image-hover-overlay">
                            <div class="overlay-content">
                                <div class="icon-circle">
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="overlay-icon"
                                    >
                                        <path d="M5 12h14" />
                                        <path d="M12 5l7 7-7 7" />
                                    </svg>
                                    <div class="icon-ring"></div>
                                    <div class="icon-ring-2"></div>
                                </div>
                                <p class="overlay-text">Click to explore more</p>
                            </div>
                        </div>
                    </div>

                    <div class="card-content">
                        <div class="card-title">
                            <span>{{ item.title }}</span>
                            <div class="title-underline"></div>
                        </div>
                        <p class="card-description">{{ item.description }}</p>
                        <div class="card-footer">
                            <span class="explore-text">Explore</span>
                            <span class="arrow">→</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="show-more-wrapper">
                <button class="show-more-btn" @click="router.push('/gallery')">
                    <span class="btn-text">View Gallery</span>
                    <span class="btn-icon">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </span>
                    <div class="btn-shine"></div>
                </button>
            </div>
        </el-main>

        <el-footer class="footer">
            <p>© 2025 FRONT END. Built with ❤️ by cheng71130</p>
        </el-footer>
    </el-container>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const titleWords = ['It', 'is', 'up', 'to', 'you', 'how', 'far', 'you', 'will', 'go'];

    const toNavigation = (path) => {
        router.push(path);
    };

    const particleStyle = (index) => {
        const tx = Math.floor(Math.random() * 200) - 100;
        const ty = Math.floor(Math.random() * 200) - 100;
        return {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
            '--tx': `${tx}px`,
            '--ty': `${ty}px`,
        };
    };

    const cards = ref([
        {
            title: 'Visualization',
            path: '/visualizationScreen',
            description: 'This is a cool card with some awesome content.',
            img: 'https://picsum.photos/id/30/1600/1200.webp',
        },
        {
            title: 'Mine',
            path: '/mine',
            description: 'This card has even more amazing stuff to show.',
            img: 'https://picsum.photos/id/50/1600/1200.webp',
        },
        {
            title: 'LogicFlow',
            path: '/flowDemo',
            description: 'Check out this card with its fantastic details.',
            img: 'https://picsum.photos/id/90/1600/1200.webp',
        },
    ]);
</script>

<style scoped lang="scss">
    @use './style/index.scss';
</style>
