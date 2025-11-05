<template>
    <el-container v-show="loaded" class="main-container animate__animated animate__fadeIn">
        <div class="particles">
            <div class="particle" v-for="i in 50" :key="i" :style="particleStyle(i)"></div>
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
        bgImage.src = 'https://picsum.photos/3840/2160?random=4';

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
    @keyframes particle-float {
        0%,
        100% {
            transform: translate(0, 0);
            opacity: 0;
        }
        10%,
        90% {
            opacity: 1;
        }
        50% {
            transform: translate(var(--tx), var(--ty));
        }
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }

    @keyframes title-wave {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    @keyframes glow-pulse {
        0%,
        100% {
            opacity: 0.4;
        }
        50% {
            opacity: 0.8;
        }
    }

    @keyframes slide-up {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes neon-glow {
        0%,
        100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2),
                inset 0 0 20px rgba(168, 85, 247, 0.1);
        }
        50% {
            box-shadow: 0 0 30px rgba(236, 72, 153, 0.6), 0 0 60px rgba(236, 72, 153, 0.3),
                inset 0 0 30px rgba(236, 72, 153, 0.2);
        }
    }

    @keyframes shine-flow {
        0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
        }
        100% {
            transform: translateX(200%) translateY(200%) rotate(45deg);
        }
    }

    @keyframes border-flow {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    @keyframes grid-move {
        0% {
            transform: perspective(500px) rotateX(60deg) translateY(0);
        }
        100% {
            transform: perspective(500px) rotateX(60deg) translateY(50px);
        }
    }

    @keyframes btn-shine-flow {
        0% {
            transform: translateX(-200%);
        }
        100% {
            transform: translateX(200%);
        }
    }

    .particles {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;

        .particle {
            position: absolute;
            width: 3px;
            height: 3px;
            background: rgba(168, 85, 247, 0.8);
            border-radius: 50%;
            animation: particle-float infinite ease-in-out;
            box-shadow: 0 0 10px rgba(168, 85, 247, 0.8);
        }
    }

    .neon-grid {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 300px;
        background-image: linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px);
        background-size: 50px 50px;
        transform: perspective(500px) rotateX(60deg);
        transform-origin: center bottom;
        pointer-events: none;
        z-index: 0;
        animation: grid-move 20s linear infinite;
        opacity: 0.3;
    }

    .main-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        overflow: hidden;
        background-color: #0a0a0f;

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at top, rgba(88, 28, 135, 0.4) 0%, transparent 50%),
                radial-gradient(ellipse at bottom, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                linear-gradient(180deg, rgba(10, 10, 15, 0.65) 0%, rgba(20, 15, 35, 0.98) 100%);
            z-index: 0;
        }
    }

    .header {
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(15, 10, 30, 0.6);
        backdrop-filter: blur(10px);
        padding: 2rem 1rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 -1px 0 rgba(168, 85, 247, 0.3);
        border-bottom: 1px solid rgba(168, 85, 247, 0.2);
        z-index: 10;
        position: relative;
        overflow: hidden;

        .header-content {
            position: relative;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            z-index: 2;
        }

        .logo-icon {
            font-size: 2.5rem;
            animation: float 3s ease-in-out infinite;
            filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.8));
            z-index: 2;
        }

        .header-glow {
            position: absolute;
            inset: -100%;
            background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 60%);
            animation: glow-pulse 4s ease-in-out infinite;
            pointer-events: none;
            z-index: 0;
        }

        .title {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f472b6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: rgb(239, 211, 247);
            background-clip: text;
            letter-spacing: 3px;
            text-shadow: 0 0 40px rgba(168, 85, 247, 0.6);
            display: flex;
            gap: 0.5rem;
            position: relative;
            z-index: 2;
            filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.5));

            .title-word {
                display: inline-block;
                animation: title-wave 3s ease-in-out infinite;
            }
        }
    }

    .main {
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 2;

        .content {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            padding: 3rem 2rem 1.5rem;
            gap: 3rem;
            z-index: 2;
            animation: slide-up 0.8s ease-out;

            .card {
                background: rgba(20, 15, 40, 0.7);
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 2.2rem;
                width: 380px;
                min-height: 520px;
                display: flex;
                flex-direction: column;
                position: relative;
                cursor: pointer;
                overflow: hidden;
                border: 1px solid rgba(168, 85, 247, 0.3);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                animation: slide-up 0.6s ease-out backwards, neon-glow 3s ease-in-out infinite;

                &::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    background: linear-gradient(
                        45deg,
                        rgba(168, 85, 247, 0.5),
                        rgba(236, 72, 153, 0.5),
                        rgba(168, 85, 247, 0.5)
                    );
                    background-size: 200% 200%;
                    border-radius: 24px;
                    opacity: 0;
                    z-index: -1;
                    animation: border-flow 3s ease infinite;
                    transition: opacity 0.4s ease;
                }

                &::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 60%);
                    pointer-events: none;
                    z-index: 0;
                }

                .card-shine-effect {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%);
                    animation: shine-flow 8s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 1;
                }

                .card-glow-pulse {
                    position: absolute;
                    inset: -50px;
                    background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 60%);
                    animation: glow-pulse 4s ease-in-out infinite;
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    pointer-events: none;
                    z-index: 0;
                }

                &:hover {
                    transform: translateY(-8px);
                    border-color: rgba(236, 72, 153, 0.6);
                    box-shadow: 0 20px 60px rgba(168, 85, 247, 0.4), 0 0 80px rgba(236, 72, 153, 0.3),
                        inset 0 0 60px rgba(168, 85, 247, 0.1);

                    &::before {
                        opacity: 1;
                    }

                    .card-glow-pulse {
                        opacity: 1;
                    }

                    .card-img {
                        transform: scale(1.05);
                    }

                    .image-overlay {
                        opacity: 0.4;
                    }

                    .card-title {
                        .title-underline {
                            width: 100%;
                        }
                    }

                    .card-footer .arrow {
                        transform: translateX(8px);
                    }
                }

                .card-image-wrapper {
                    position: relative;
                    width: 100%;
                    height: 250px;
                    border-radius: 16px;
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                    z-index: 2;
                }

                .card-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .image-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, transparent 0%, rgba(20, 15, 40, 0.8) 100%);
                    opacity: 0.2;
                    transition: opacity 0.4s ease;
                }

                .card-content {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    gap: 1rem;
                    position: relative;
                    z-index: 2;
                }

                .card-title {
                    font-size: 2rem;
                    font-weight: 800;
                    position: relative;
                    margin-bottom: 0.5rem;

                    span {
                        background: linear-gradient(135deg, #ffffff 0%, #e9d5ff 50%, #fae8ff 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.5));
                        display: inline-block;
                    }

                    .title-underline {
                        position: absolute;
                        left: 0;
                        bottom: -8px;
                        width: 40px;
                        height: 3px;
                        background: linear-gradient(90deg, #a855f7, #ec4899);
                        border-radius: 2px;
                        box-shadow: 0 0 15px rgba(168, 85, 247, 0.8);
                        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                }

                .card-description {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 1.05rem;
                    line-height: 1.7;
                    flex-grow: 1;
                    font-weight: 400;
                }

                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(168, 85, 247, 0.2);
                    margin-top: auto;

                    .explore-text {
                        font-weight: 700;
                        font-size: 1.1rem;
                        background: linear-gradient(135deg, #a855f7, #ec4899);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.5));
                    }

                    .arrow {
                        font-size: 1.5rem;
                        font-weight: bold;
                        color: #ec4899;
                        transition: transform 0.3s ease;
                        filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.6));
                    }
                }
            }
        }

        .show-more-wrapper {
            display: flex;
            justify-content: center;
            margin: 1rem auto 3rem;
            animation: slide-up 1s ease-out backwards;
            animation-delay: 0.5s;
            z-index: 2;

            .show-more-btn {
                position: relative;
                padding: 1rem 3rem;
                font-size: 1.1rem;
                font-weight: 700;
                color: white;
                background: linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(236, 72, 153, 0.8) 100%);
                border: 1px solid rgba(236, 72, 153, 0.5);
                border-radius: 50px;
                cursor: pointer;
                overflow: hidden;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 10px 40px rgba(168, 85, 247, 0.4), 0 0 60px rgba(236, 72, 153, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);

                .btn-text {
                    position: relative;
                    z-index: 1;
                    letter-spacing: 0.5px;
                }

                .btn-icon {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    transition: transform 0.3s ease;
                }

                .btn-shine {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
                    animation: btn-shine-flow 3s ease-in-out infinite;
                }

                &::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    background: linear-gradient(45deg, #a855f7, #ec4899, #a855f7);
                    background-size: 200% 200%;
                    border-radius: 50px;
                    opacity: 0;
                    z-index: -1;
                    animation: border-flow 3s ease infinite;
                    transition: opacity 0.4s ease;
                }

                &:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 20px 60px rgba(168, 85, 247, 0.6), 0 0 80px rgba(236, 72, 153, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3);
                    border-color: rgba(236, 72, 153, 0.8);

                    &::before {
                        opacity: 1;
                    }

                    .btn-icon {
                        transform: translateX(5px);
                    }
                }

                &:active {
                    transform: translateY(-1px);
                }
            }
        }
    }

    .load-container {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #0a0a0f 0%, #1a1028 50%, #0f0a1f 100%);
        z-index: 9999;

        .loader-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
        }

        .wheel-and-hamster {
            --dur: 1s;
            position: relative;
            width: 12em;
            height: 12em;
            font-size: 14px;
            filter: drop-shadow(0 10px 30px rgba(255, 153, 0, 0.5));
        }

        .wheel,
        .hamster,
        .hamster div,
        .spoke {
            position: absolute;
        }

        .wheel,
        .spoke {
            border-radius: 50%;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .wheel {
            background: radial-gradient(100% 100% at center, hsla(0, 0%, 60%, 0) 47.8%, hsl(0, 0%, 60%) 48%);
            z-index: 2;
        }

        .hamster {
            animation: hamster var(--dur) ease-in-out infinite;
            top: 50%;
            left: calc(50% - 3.5em);
            width: 7em;
            height: 3.75em;
            transform: rotate(4deg) translate(-0.8em, 1.85em);
            transform-origin: 50% 0;
            z-index: 1;
        }

        .hamster__head {
            animation: hamsterHead var(--dur) ease-in-out infinite;
            background: hsl(30, 90%, 55%);
            border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
            box-shadow: 0 -0.25em 0 hsl(30, 90%, 80%) inset, 0.75em -1.55em 0 hsl(30, 90%, 90%) inset;
            top: 0;
            left: -2em;
            width: 2.75em;
            height: 2.5em;
            transform-origin: 100% 50%;
        }

        .hamster__ear {
            animation: hamsterEar var(--dur) ease-in-out infinite;
            background: hsl(0, 90%, 85%);
            border-radius: 50%;
            box-shadow: -0.25em 0 hsl(30, 90%, 55%) inset;
            top: -0.25em;
            right: -0.25em;
            width: 0.75em;
            height: 0.75em;
            transform-origin: 50% 75%;
        }

        .hamster__eye {
            animation: hamsterEye var(--dur) linear infinite;
            background-color: hsl(0, 0%, 0%);
            border-radius: 50%;
            top: 0.375em;
            left: 1.25em;
            width: 0.5em;
            height: 0.5em;
        }

        .hamster__nose {
            background: hsl(0, 90%, 75%);
            border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
            top: 0.75em;
            left: 0;
            width: 0.2em;
            height: 0.25em;
        }

        .hamster__body {
            animation: hamsterBody var(--dur) ease-in-out infinite;
            background: hsl(30, 90%, 90%);
            border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
            box-shadow: 0.1em 0.75em 0 hsl(30, 90%, 55%) inset, 0.15em -0.5em 0 hsl(30, 90%, 80%) inset;
            top: 0.25em;
            left: 2em;
            width: 4.5em;
            height: 3em;
            transform-origin: 17% 50%;
            transform-style: preserve-3d;
        }

        .hamster__limb--fr,
        .hamster__limb--fl {
            clip-path: polygon(0 0, 100% 0, 70% 80%, 60% 100%, 0% 100%, 40% 80%);
            top: 2em;
            left: 0.5em;
            width: 1em;
            height: 1.5em;
            transform-origin: 50% 0;
        }

        .hamster__limb--fr {
            animation: hamsterFRLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30, 90%, 80%) 80%, hsl(0, 90%, 75%) 80%);
            transform: rotate(15deg) translateZ(-1px);
        }

        .hamster__limb--fl {
            animation: hamsterFLLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30, 90%, 90%) 80%, hsl(0, 90%, 85%) 80%);
            transform: rotate(15deg);
        }

        .hamster__limb--br,
        .hamster__limb--bl {
            border-radius: 0.75em 0.75em 0 0;
            clip-path: polygon(0 0, 100% 0, 100% 30%, 70% 90%, 70% 100%, 30% 100%, 40% 90%, 0% 30%);
            top: 1em;
            left: 2.8em;
            width: 1.5em;
            height: 2.5em;
            transform-origin: 50% 30%;
        }

        .hamster__limb--br {
            animation: hamsterBRLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30, 90%, 80%) 90%, hsl(0, 90%, 75%) 90%);
            transform: rotate(-25deg) translateZ(-1px);
        }

        .hamster__limb--bl {
            animation: hamsterBLLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30, 90%, 90%) 90%, hsl(0, 90%, 85%) 90%);
            transform: rotate(-25deg);
        }

        .hamster__tail {
            animation: hamsterTail var(--dur) linear infinite;
            background: hsl(0, 90%, 85%);
            border-radius: 0.25em 50% 50% 0.25em;
            box-shadow: 0 -0.2em 0 hsl(0, 90%, 75%) inset;
            top: 1.5em;
            right: -0.5em;
            width: 1em;
            height: 0.5em;
            transform: rotate(30deg) translateZ(-1px);
            transform-origin: 0.25em 0.25em;
        }

        .spoke {
            animation: spoke var(--dur) linear infinite;
            background: radial-gradient(100% 100% at center, hsl(0, 0%, 60%) 4.8%, hsla(0, 0%, 60%, 0) 5%),
                linear-gradient(hsla(0, 0%, 55%, 0) 46.9%, hsl(0, 0%, 65%) 47% 52.9%, hsla(0, 0%, 65%, 0) 53%) 50% 50% /
                    99% 99% no-repeat;
        }

        @keyframes hamster {
            from,
            to {
                transform: rotate(4deg) translate(-0.8em, 1.85em);
            }
            50% {
                transform: rotate(0) translate(-0.8em, 1.85em);
            }
        }

        @keyframes hamsterHead {
            from,
            25%,
            50%,
            75%,
            to {
                transform: rotate(0);
            }
            12.5%,
            37.5%,
            62.5%,
            87.5% {
                transform: rotate(8deg);
            }
        }

        @keyframes hamsterEye {
            from,
            90%,
            to {
                transform: scaleY(1);
            }
            95% {
                transform: scaleY(0);
            }
        }

        @keyframes hamsterEar {
            from,
            25%,
            50%,
            75%,
            to {
                transform: rotate(0);
            }
            12.5%,
            37.5%,
            62.5%,
            87.5% {
                transform: rotate(12deg);
            }
        }

        @keyframes hamsterBody {
            from,
            25%,
            50%,
            75%,
            to {
                transform: rotate(0);
            }
            12.5%,
            37.5%,
            62.5%,
            87.5% {
                transform: rotate(-2deg);
            }
        }

        @keyframes hamsterFRLimb {
            from,
            25%,
            50%,
            75%,
            to {
                transform: rotate(50deg) translateZ(-1px);
            }
            12.5%,
            37.5%,
            62.5%,
            87.5% {
                transform: rotate(-30deg) translateZ(-1px);
            }
        }

        @keyframes hamsterFLLimb {
            from,
            25%,
            50%,
            75%,
            to {
                transform: rotate(-30deg);
            }
            12.5%,
            37.5%,
            62.5%,
            87.5% {
                transform: rotate(50deg);
            }
        }

        @keyframes hamsterBRLimb {
            from,
            25%,
            50%,
            75%,
            to {
                transform: rotate(-60deg) translateZ(-1px);
            }
            12.5%,
            37.5%,
            62.5%,
            87.5% {
                transform: rotate(20deg) translateZ(-1px);
            }
        }

        @keyframes hamsterBLLimb {
            from,
            25%,
            50%,
            75%,
            to {
                transform: rotate(20deg);
            }
            12.5%,
            37.5%,
            62.5%,
            87.5% {
                transform: rotate(-60deg);
            }
        }

        @keyframes hamsterTail {
            from,
            25%,
            50%,
            75%,
            to {
                transform: rotate(30deg) translateZ(-1px);
            }
            12.5%,
            37.5%,
            62.5%,
            87.5% {
                transform: rotate(10deg) translateZ(-1px);
            }
        }

        @keyframes spoke {
            from {
                transform: rotate(0);
            }
            to {
                transform: rotate(-1turn);
            }
        }
    }

    @media (max-width: 1400px) {
        .content .card {
            width: 360px;
            min-height: 500px;
        }
    }

    @media (max-width: 1200px) {
        .content {
            flex-wrap: wrap;
            .card {
                width: 380px;
            }
        }
    }

    @media (max-width: 768px) {
        .header .title {
            font-size: 2rem;
        }

        .content {
            padding: 2rem 1rem 1rem;
            .card {
                width: 100%;
                max-width: 400px;
            }
        }

        .show-more-wrapper {
            margin: 1rem auto 2rem;

            .show-more-btn {
                padding: 0.875rem 2.5rem;
                font-size: 1rem;
            }
        }
    }
</style>
