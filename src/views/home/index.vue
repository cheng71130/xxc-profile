<template>
    <el-container v-show="loaded" class="main-container animate__animated animate__fadeIn">
        <el-header class="header">
            <h1>Welcome to My Cool Homepage</h1>
        </el-header>
        <el-main class="main">
            <div class="content">
                <div class="card" v-for="(item, index) in cards" :key="index" @click="toNavigation(item.path)">
                    <img
                        :src="item.img"
                        alt="Card Image"
                        class="card-img"
                        @load="onImageLoad(index)"
                        @error="onImageError(index)"
                    />
                    <div class="card-title">{{ item.title }}</div>
                    <p>{{ item.description }}</p>
                </div>
            </div>
            <showMoreBtn @click="router.push('/gallery')" />
        </el-main>
    </el-container>
    <div v-if="!loaded" class="load-container">
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
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { ElMessage } from 'element-plus';
    import showMoreBtn from './components/showMoreBtn.vue';

    const router = useRouter();

    const toNavigation = (path) => {
        router.push(path);
    };

    const cards = ref([
        {
            title: 'Visualization',
            path: '/visualizationScreen',
            description: 'This is a cool card with some awesome content.',
            img: 'https://picsum.photos/1600/1200?random=1',
        },
        {
            title: 'Mine',
            path: '/mine',
            description: 'This card has even more amazing stuff to show.',
            img: 'https://picsum.photos/1600/1200?random=2',
        },
        {
            title: 'LogicFlow',
            path: '/flowDemo',
            description: 'Check out this card with its fantastic details.',
            img: 'https://picsum.photos/1600/1200?random=3',
        },
    ]);

    // 图片加载状态：3张卡片图片 + 1张背景图片 = 4张
    const imagesLoaded = ref([false, false, false, false]);
    const allImagesLoaded = computed(() => imagesLoaded.value.every((loaded) => loaded));
    const loaded = computed(() => allImagesLoaded.value);

    // 卡片图片加载完成回调
    const onImageLoad = (index) => {
        console.log(`卡片图片 ${index + 1} 加载完成`);
        imagesLoaded.value[index] = true;
    };

    // 卡片图片加载失败回调
    const onImageError = (index) => {
        console.warn(`卡片图片 ${index + 1} 加载失败`);
        // 即使加载失败也标记为完成，避免永远loading
        imagesLoaded.value[index] = true;
    };

    // 预加载背景图片
    const preloadBackgroundImage = () => {
        const bgImage = new Image();
        bgImage.src = 'https://picsum.photos/1920/1080?random=4';

        bgImage.onload = () => {
            console.log('背景图片加载完成');
            // 当背景图片加载完成后，动态设置 main-container 的背景图像
            const container = document.querySelector('.main-container');
            if (container) {
                container.style.backgroundImage = `url(${bgImage.src})`;
            }
            imagesLoaded.value[3] = true; // 背景图片索引为3
        };

        bgImage.onerror = () => {
            console.warn('背景图片加载失败');
            // 即使背景图片加载失败也标记为完成
            imagesLoaded.value[3] = true;
        };
    };

    onMounted(() => {
        // 预加载背景图片
        preloadBackgroundImage();

        // 设置超时机制
        setTimeout(() => {
            if (!allImagesLoaded.value) {
                ElMessage({
                    message: '页面加载超时，建议刷新页面重试',
                    type: 'warning',
                });
                // 强制显示页面
                imagesLoaded.value = [true, true, true, true];
            }
        }, 8000);
    });
</script>

<style scoped lang="scss">
    @use './style/loading.scss';

    .main-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
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
        letter-spacing: 2px;
    }

    .main {
        display: flex;
        flex-direction: column;
        .content {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            padding: 2rem;
            gap: 2rem;
            overflow: hidden;
            z-index: 1;
            height: 50%;

            .card {
                background: linear-gradient(to bottom right, rgba(255, 235, 205, 0.9), rgba(245, 222, 179, 0.9));
                border-radius: 12px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                padding: 2rem;
                width: 400px;
                height: 410px;
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

            .card-img {
                width: 95%;
                border-radius: 8px;
                margin-top: 1.3rem;
                margin-bottom: 2rem;
            }

            .card-title {
                font-size: 26px;
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

            .card p {
                color: #666;
                font-size: 16px;
            }
        }
    }
</style>
