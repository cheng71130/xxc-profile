<template>
    <div class="skeleton-showcase">
        <!-- 页面标题 -->
        <div class="showcase-header">
            <h1 class="main-title"><span class="gradient-text">Skeleton</span> Showcase</h1>
            <p class="subtitle">智能骨架屏生成器 - 极致加载体验</p>
        </div>

        <!-- 控制面板 -->
        <div class="control-panel">
            <button @click="toggleAllLoading" class="control-btn primary">
                <svg viewBox="0 0 24 24" fill="none">
                    <path
                        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                    />
                </svg>
                {{ isAllLoading ? '加载完成' : '全部加载' }}
            </button>
        </div>

        <!-- 示例网格 -->
        <div class="showcase-grid">
            <!-- 用户卡片 -->
            <div class="showcase-item">
                <div class="item-header">
                    <h3>用户卡片</h3>
                    <label class="switch">
                        <input type="checkbox" v-model="loading1" />
                        <span class="slider"></span>
                    </label>
                </div>

                <SkeletonWrapper :loading="loading1" :auto="false">
                    <div class="user-card glass-effect">
                        <div class="user-avatar-wrapper">
                            <img class="user-avatar" src="https://i.pravatar.cc/360?img=9" alt="Avatar" />
                            <div class="status-dot"></div>
                        </div>
                        <div class="user-info">
                            <h3 class="user-name">Anya Sharma</h3>
                            <p class="role">Digital Architect</p>
                            <p class="bio">Creating digital experiences that inspire and connect people worldwide.</p>
                            <div class="user-stats">
                                <div class="stat">
                                    <span class="stat-value">2.4K</span>
                                    <span class="stat-label">Followers</span>
                                </div>
                                <div class="stat-divider"></div>
                                <div class="stat">
                                    <span class="stat-value">1.8K</span>
                                    <span class="stat-label">Following</span>
                                </div>
                                <div class="stat-divider"></div>
                                <div class="stat">
                                    <span class="stat-value">342</span>
                                    <span class="stat-label">Posts</span>
                                </div>
                            </div>
                            <button class="follow-btn">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 4v16m-8-8h16"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                    />
                                </svg>
                                Follow
                            </button>
                        </div>
                    </div>

                    <template #skeleton>
                        <SkeletonPresets type="profile" />
                    </template>
                </SkeletonWrapper>
            </div>

            <!-- 文章卡片 -->
            <div class="showcase-item">
                <div class="item-header">
                    <h3>文章卡片</h3>
                    <label class="switch">
                        <input type="checkbox" v-model="loading2" />
                        <span class="slider"></span>
                    </label>
                </div>

                <SkeletonWrapper :loading="loading2" :auto="false">
                    <div class="article-card glass-effect">
                        <div class="article-cover">
                            <img src="https://picsum.photos/1200/600?random=1" alt="Article" />
                            <div class="article-badge">Featured</div>
                        </div>
                        <div class="article-body">
                            <div class="article-meta">
                                <img class="author-avatar" src="https://i.pravatar.cc/120?img=2" alt="Author" />
                                <div class="author-info">
                                    <span class="author-name">Alex Chen</span>
                                    <span class="publish-date">2 days ago</span>
                                </div>
                            </div>
                            <h3 class="article-title">The Future of Web Development</h3>
                            <p class="article-excerpt">
                                Exploring the latest trends and technologies shaping the future of modern web
                                applications.
                            </p>
                            <div class="article-footer">
                                <div class="article-tags">
                                    <span class="tag">Vue.js</span>
                                    <span class="tag">TypeScript</span>
                                </div>
                                <button class="read-more-btn">
                                    Read More
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M5 12h14M12 5l7 7-7 7"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <template #skeleton>
                        <SkeletonPresets type="article" />
                    </template>
                </SkeletonWrapper>
            </div>

            <!-- 评论列表 -->
            <div class="showcase-item wide">
                <div class="item-header">
                    <h3>评论列表</h3>
                    <label class="switch">
                        <input type="checkbox" v-model="loading4" />
                        <span class="slider"></span>
                    </label>
                </div>

                <SkeletonWrapper :loading="loading4" :auto="false">
                    <div class="comments-wrapper">
                        <div v-for="comment in comments" :key="comment.id" class="comment-item glass-effect">
                            <img class="comment-avatar" :src="comment.avatar" alt="User" />
                            <div class="comment-content">
                                <div class="comment-header">
                                    <span class="comment-author">{{ comment.author }}</span>
                                    <span class="comment-time">{{ comment.time }}</span>
                                </div>
                                <p class="comment-text">{{ comment.text }}</p>
                                <div class="comment-actions">
                                    <button class="action-btn">
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        {{ comment.likes }}
                                    </button>
                                    <button class="action-btn">
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <template #skeleton>
                        <SkeletonPresets type="list" :rows="3" />
                    </template>
                </SkeletonWrapper>
            </div>

            <!-- 图片网格 -->
            <div class="showcase-item wide">
                <div class="item-header">
                    <h3>图片画廊</h3>
                    <label class="switch">
                        <input type="checkbox" v-model="loading5" />
                        <span class="slider"></span>
                    </label>
                </div>

                <SkeletonWrapper :loading="loading5" :auto="false">
                    <div class="gallery-grid">
                        <div v-for="(image, index) in galleryImages" :key="index" class="gallery-item glass-effect">
                            <img :src="image.url" :alt="image.title" />
                            <div class="gallery-overlay">
                                <h4>{{ image.title }}</h4>
                                <p>{{ image.category }}</p>
                            </div>
                        </div>
                    </div>

                    <template #skeleton>
                        <SkeletonPresets type="grid" :columns="3" :rows="2" />
                    </template>
                </SkeletonWrapper>
            </div>

            <!-- 产品卡片 -->
            <div class="showcase-item">
                <div class="item-header">
                    <h3>产品卡片</h3>
                    <label class="switch">
                        <input type="checkbox" v-model="loading3" />
                        <span class="slider"></span>
                    </label>
                </div>

                <SkeletonWrapper :loading="loading3" :auto="false">
                    <div class="product-card glass-effect">
                        <div class="product-image-wrapper">
                            <img class="product-image" src="https://picsum.photos/1200/900" alt="Product" />
                            <div class="product-tag">New</div>
                        </div>
                        <div class="product-info">
                            <div class="product-header">
                                <h4 class="product-title">Premium Headphones</h4>
                                <div class="product-rating">
                                    <svg v-for="i in 5" :key="i" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <p class="product-description">
                                Experience crystal-clear audio with active noise cancellation.
                            </p>
                            <div class="product-footer">
                                <div class="price-wrapper">
                                    <span class="price-current">$299</span>
                                    <span class="price-old">$399</span>
                                </div>
                                <button class="add-to-cart-btn">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>

                    <template #skeleton>
                        <SkeletonPresets type="card" />
                    </template>
                </SkeletonWrapper>
            </div>

            <!-- 表单 -->
            <div class="showcase-item">
                <div class="item-header">
                    <h3>联系表单</h3>
                    <label class="switch">
                        <input type="checkbox" v-model="loading6" />
                        <span class="slider"></span>
                    </label>
                </div>

                <SkeletonWrapper :loading="loading6" :auto="false">
                    <form class="contact-form glass-effect" @submit.prevent>
                        <div class="form-group">
                            <label>Your Name</label>
                            <input type="text" placeholder="John Doe" />
                        </div>
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="john@example.com" />
                        </div>
                        <div class="form-group">
                            <label>Subject</label>
                            <input type="text" placeholder="How can we help?" />
                        </div>
                        <div class="form-group">
                            <label>Message</label>
                            <textarea rows="4" placeholder="Tell us more..."></textarea>
                        </div>
                        <button type="submit" class="submit-btn">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            Send Message
                        </button>
                    </form>

                    <template #skeleton>
                        <SkeletonPresets type="form" />
                    </template>
                </SkeletonWrapper>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue';
    import SkeletonWrapper from '@/components/SkeletonWrapper/SkeletonWrapper.vue';
    import SkeletonPresets from '@/components/SkeletonWrapper/SkeletonPresets.vue';

    const loading1 = ref(true);
    const loading2 = ref(true);
    const loading3 = ref(true);
    const loading4 = ref(true);
    const loading5 = ref(true);
    const loading6 = ref(true);

    const isAllLoading = computed(
        () => loading1.value || loading2.value || loading3.value || loading4.value || loading5.value || loading6.value
    );

    const toggleAllLoading = () => {
        const newState = !isAllLoading.value;
        loading1.value = newState;
        loading2.value = newState;
        loading3.value = newState;
        loading4.value = newState;
        loading5.value = newState;
        loading6.value = newState;
    };

    const comments = ref([
        {
            id: 1,
            avatar: 'https://i.pravatar.cc/240?img=12',
            author: 'Sarah Johnson',
            time: '5 minutes ago',
            text: 'This is absolutely amazing! The attention to detail is incredible.',
            likes: 42,
        },
        {
            id: 2,
            avatar: 'https://i.pravatar.cc/240?img=13',
            author: 'Mike Williams',
            time: '1 hour ago',
            text: 'Great work! Looking forward to seeing more content like this.',
            likes: 28,
        },
        {
            id: 3,
            avatar: 'https://i.pravatar.cc/240?img=14',
            author: 'Emma Davis',
            time: '3 hours ago',
            text: 'The design is so clean and modern. Love the color scheme!',
            likes: 35,
        },
    ]);

    const galleryImages = ref([
        { url: 'https://picsum.photos/1200/900?random=3', title: 'Mountain View', category: 'Nature' },
        { url: 'https://picsum.photos/1200/900?random=4', title: 'City Lights', category: 'Urban' },
        { url: 'https://picsum.photos/1200/900?random=5', title: 'Ocean Sunset', category: 'Nature' },
        { url: 'https://picsum.photos/1200/900?random=6', title: 'Architecture', category: 'Design' },
        { url: 'https://picsum.photos/1200/900?random=7', title: 'Forest Path', category: 'Nature' },
        { url: 'https://picsum.photos/1200/900?random=8', title: 'Modern Art', category: 'Art' },
    ]);
</script>

<style scoped lang="scss">
    .skeleton-showcase {
        min-height: 100vh;
        max-width: 1400px;
        margin: 0 auto;
    }

    // 页面标题
    .showcase-header {
        text-align: center;
        margin-bottom: 60px;

        .main-title {
            font-size: 56px;
            font-weight: 800;
            margin: 0 0 16px 0;
            color: rgba(255, 255, 255, 0.95);

            .gradient-text {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
        }

        .subtitle {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.7);
            margin: 0;
        }
    }

    // 控制面板
    .control-panel {
        display: flex;
        justify-content: center;
        margin-bottom: 40px;
    }

    .control-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 32px;
        font-size: 16px;
        font-weight: 600;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &.primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
            }

            &:active {
                transform: translateY(0);
            }
        }

        svg {
            width: 20px;
            height: 20px;
            animation: spin 2s linear infinite;
        }
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    // 展示网格
    .showcase-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 32px;

        .showcase-item {
            flex: 0 0 calc(50% - 16px);
            max-width: calc(50% - 16px);

            &.wide {
                flex: 0 0 100%;
                max-width: 100%;
            }
        }
    }

    .showcase-item {
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;

            h3 {
                font-size: 20px;
                font-weight: 700;
                margin: 0;
                color: rgba(255, 255, 255, 0.95);
            }
        }
    }

    // Switch 开关样式
    .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
        cursor: pointer;
        flex-shrink: 0;

        input {
            opacity: 0;
            width: 0;
            height: 0;

            &:checked + .slider {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);

                &::before {
                    transform: translateX(24px);
                }
            }

            &:focus + .slider {
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
            }
        }

        .slider {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 26px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

            &::before {
                content: '';
                position: absolute;
                height: 18px;
                width: 18px;
                left: 4px;
                bottom: 3px;
                background: white;
                border-radius: 50%;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            &:hover {
                background: rgba(255, 255, 255, 0.15);
            }
        }
    }

    // 玻璃效果
    .glass-effect {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    // 用户卡片
    .user-card {
        border-radius: 20px;
        padding: 32px;
        text-align: center;

        .user-avatar-wrapper {
            position: relative;
            display: inline-block;
            margin-bottom: 20px;
        }

        .user-avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 4px solid rgba(102, 126, 234, 0.3);
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
        }

        .status-dot {
            position: absolute;
            bottom: 8px;
            right: 8px;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
            border: 3px solid rgba(0, 0, 0, 0.5);
            border-radius: 50%;
        }

        .user-info {
            .user-name {
                font-size: 24px;
                font-weight: 700;
                margin: 0 0 8px 0;
                color: rgba(255, 255, 255, 0.95);
            }

            .role {
                font-size: 14px;
                color: rgba(102, 126, 234, 1);
                font-weight: 600;
                margin: 0 0 12px 0;
            }

            .bio {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.7);
                line-height: 1.6;
                margin: 0 0 24px 0;
            }
        }

        .user-stats {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-bottom: 24px;
            padding: 20px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .stat-value {
                font-size: 20px;
                font-weight: 700;
                color: rgba(255, 255, 255, 0.95);
            }

            .stat-label {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
            }
        }

        .stat-divider {
            width: 1px;
            height: 32px;
            background: rgba(255, 255, 255, 0.15);
        }

        .follow-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 6px 24px rgba(102, 126, 234, 0.3);

            svg {
                width: 18px;
                height: 18px;
            }

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
            }
        }
    }

    // 文章卡片
    .article-card {
        border-radius: 20px;
        overflow: hidden;

        .article-cover {
            position: relative;
            width: 100%;
            height: 200px;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }

            &:hover img {
                transform: scale(1.05);
            }

            .article-badge {
                position: absolute;
                top: 16px;
                right: 16px;
                padding: 6px 16px;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                color: white;
            }
        }

        .article-body {
            padding: 24px;
        }

        .article-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;

            .author-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 2px solid rgba(102, 126, 234, 0.3);
            }

            .author-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .author-name {
                font-size: 14px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.95);
            }

            .publish-date {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
            }
        }

        .article-title {
            font-size: 20px;
            font-weight: 700;
            margin: 0 0 12px 0;
            line-height: 1.4;
            color: rgba(255, 255, 255, 0.95);
        }

        .article-excerpt {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            margin: 0 0 20px 0;
        }

        .article-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .article-tags {
            display: flex;
            gap: 8px;

            .tag {
                padding: 4px 12px;
                background: rgba(102, 126, 234, 0.15);
                border: 1px solid rgba(102, 126, 234, 0.3);
                border-radius: 12px;
                font-size: 12px;
                color: rgba(102, 126, 234, 1);
                font-weight: 500;
            }
        }

        .read-more-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;

            svg {
                width: 16px;
                height: 16px;
            }

            &:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 255, 255, 0.25);
            }
        }
    }

    // 产品卡片
    .product-card {
        border-radius: 20px;
        overflow: hidden;

        .product-image-wrapper {
            position: relative;
            width: 100%;
            height: 240px;
            overflow: hidden;

            .product-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }

            &:hover .product-image {
                transform: scale(1.05);
            }

            .product-tag {
                position: absolute;
                top: 16px;
                left: 16px;
                padding: 6px 16px;
                background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                color: white;
            }
        }

        .product-info {
            padding: 24px;
        }

        .product-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 12px;

            .product-title {
                font-size: 18px;
                font-weight: 700;
                margin: 0;
                color: rgba(255, 255, 255, 0.95);
            }
        }

        .product-rating {
            display: flex;
            gap: 2px;

            svg {
                width: 16px;
                height: 16px;
                color: #fbbf24;
            }
        }

        .product-description {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            margin: 0 0 20px 0;
        }

        .product-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .price-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .price-current {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .price-old {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.4);
            text-decoration: line-through;
        }

        .add-to-cart-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 10px;
            color: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);

            svg {
                width: 16px;
                height: 16px;
            }

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }
        }
    }

    // 评论列表
    .comments-wrapper {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .comment-item {
        display: flex;
        gap: 16px;
        padding: 20px;
        border-radius: 16px;
        transition: all 0.2s ease;

        &:hover {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
        }

        .comment-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 2px solid rgba(102, 126, 234, 0.3);
            flex-shrink: 0;
        }

        .comment-content {
            flex: 1;
        }

        .comment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .comment-author {
            font-size: 15px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.95);
        }

        .comment-time {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.5);
        }

        .comment-text {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            margin: 0 0 12px 0;
        }

        .comment-actions {
            display: flex;
            gap: 16px;
        }

        .action-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: rgba(255, 255, 255, 0.8);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;

            svg {
                width: 14px;
                height: 14px;
            }

            &:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.2);
                color: rgba(255, 255, 255, 0.95);
            }
        }
    }

    // 图片画廊
    .gallery-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }

    .gallery-item {
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        aspect-ratio: 4 / 3;
        cursor: pointer;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .gallery-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
            opacity: 0;
            transition: opacity 0.3s ease;

            h4 {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 4px 0;
                color: white;
            }

            p {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.9);
                margin: 0;
            }
        }

        &:hover {
            img {
                transform: scale(1.1);
            }

            .gallery-overlay {
                opacity: 1;
            }
        }
    }

    // 联系表单
    .contact-form {
        padding: 28px;
        border-radius: 20px;

        .form-group {
            margin-bottom: 20px;

            label {
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.9);
            }

            input,
            textarea {
                width: 100%;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 10px;
                color: rgba(255, 255, 255, 0.95);
                font-size: 14px;
                transition: all 0.2s ease;
                box-sizing: border-box;

                &::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                &:focus {
                    outline: none;
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(102, 126, 234, 0.5);
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
            }

            textarea {
                resize: vertical;
                min-height: 100px;
                font-family: inherit;
            }
        }

        .submit-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 6px 24px rgba(102, 126, 234, 0.3);

            svg {
                width: 18px;
                height: 18px;
            }

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
            }

            &:active {
                transform: translateY(0);
            }
        }
    }

    // 响应式
    @media (max-width: 1200px) {
        .showcase-grid {
            grid-template-columns: 1fr;

            .showcase-item.wide {
                grid-column: span 1;
            }
        }

        .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .showcase-grid {
            padding: 0 20px 40px;
        }

        .showcase-header {
            .main-title {
                font-size: 36px;
            }

            .subtitle {
                font-size: 16px;
            }
        }

        .gallery-grid {
            grid-template-columns: 1fr;
        }

        .user-card {
            padding: 24px 20px;

            .user-stats {
                flex-direction: column;
                gap: 16px;

                .stat-divider {
                    display: none;
                }
            }
        }
    }
</style>
