<template>
    <el-container v-show="loaded" class="main-container">
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
                        <img
                            :src="item.img"
                            alt="Card Image"
                            class="card-img"
                            @load="onImageLoad(index)"
                            @error="onImageError(index)"
                        />
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

    <div v-if="!loaded" class="load-container">
        <div class="loader-wrapper">
            <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
                <div class="wheel"></div>
                <div class="hamster">
                    <div class="hamster__body">
                        <div class="hamster__head">
                            <div class="hamster__ear"></div>
                            <div class="hamster__eye"></div>
                            <div class="hamster__nose"></div>
                        </div>
                        <div class="hamster__limb hamster__limb--fr"></div>
                        <div class="hamster__limb hamster__limb--fl"></div>
                        <div class="hamster__limb hamster__limb--br"></div>
                        <div class="hamster__limb hamster__limb--bl"></div>
                        <div class="hamster__tail"></div>
                    </div>
                </div>
                <div class="spoke"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { ElMessage } from 'element-plus';

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

    const imagesLoaded = ref([false, false, false, false]);
    const allImagesLoaded = computed(() => imagesLoaded.value.every((loaded) => loaded));
    const loaded = computed(() => allImagesLoaded.value);

    const onImageLoad = (index) => {
        console.log(`Image ${index + 1} loaded`);
        imagesLoaded.value[index] = true;
    };

    const onImageError = (index) => {
        console.warn(`Image ${index + 1} failed`);
        imagesLoaded.value[index] = true;
    };

    const preloadBackgroundImage = () => {
        const bgImage = new Image();
        bgImage.src = 'https://picsum.photos/id/11/3840/2160.webp';

        bgImage.onload = () => {
            console.log('Background loaded');
            const container = document.querySelector('.main-container');
            if (container) {
                container.style.backgroundImage = `url(${bgImage.src})`;
            }
            imagesLoaded.value[3] = true;
        };

        bgImage.onerror = () => {
            console.warn('Background failed');
            imagesLoaded.value[3] = true;
        };
    };

    onMounted(() => {
        preloadBackgroundImage();
        setTimeout(() => {
            if (!allImagesLoaded.value) {
                ElMessage({
                    message: '页面加载超时，建议刷新页面重试',
                    type: 'warning',
                });
                imagesLoaded.value = [true, true, true, true];
            }
        }, 8000);
    });
</script>

<style scoped lang="scss">
    @use './style/loading.scss';
    @use './style/index.scss';
</style>
