<template>
    <div class="skeleton-preset">
        <!-- 用户卡片骨架屏 - 完全匹配实际结构 -->
        <template v-if="type === 'profile'">
            <div class="user-card glass-effect">
                <div class="user-avatar-wrapper">
                    <div class="user-avatar skeleton-element"></div>
                </div>
                <div class="user-info">
                    <div class="user-name skeleton-element">Anya Sharma</div>
                    <div class="role skeleton-element">Digital Architect</div>
                    <div class="bio skeleton-element">Creating digital experiences</div>
                    <div class="user-stats">
                        <div class="stat">
                            <span class="stat-value skeleton-element">2.4K</span>
                            <span class="stat-label skeleton-element">Followers</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat">
                            <span class="stat-value skeleton-element">1.8K</span>
                            <span class="stat-label skeleton-element">Following</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat">
                            <span class="stat-value skeleton-element">342</span>
                            <span class="stat-label skeleton-element">Posts</span>
                        </div>
                    </div>
                    <button class="follow-btn skeleton-element">Follow</button>
                </div>
            </div>
        </template>

        <!-- 文章卡片骨架屏 -->
        <template v-else-if="type === 'article'">
            <div class="article-card glass-effect">
                <div class="article-cover skeleton-element">
                    <div class="article-badge skeleton-element-small">Featured</div>
                </div>
                <div class="article-body">
                    <div class="article-meta">
                        <div class="author-avatar skeleton-element"></div>
                        <div class="author-info">
                            <span class="author-name skeleton-element">Alex Chen</span>
                            <span class="publish-date skeleton-element">2 days ago</span>
                        </div>
                    </div>
                    <h3 class="article-title skeleton-element">The Future of Web Development</h3>
                    <p class="article-excerpt skeleton-element">
                        Exploring the latest trends and technologies shaping the future.
                    </p>
                    <div class="article-footer">
                        <div class="article-tags">
                            <span class="tag skeleton-element">Vue.js</span>
                            <span class="tag skeleton-element">TypeScript</span>
                        </div>
                        <button class="read-more-btn skeleton-element">Read More</button>
                    </div>
                </div>
            </div>
        </template>

        <!-- 产品卡片骨架屏 -->
        <template v-else-if="type === 'card'">
            <div class="product-card glass-effect">
                <div class="product-image-wrapper">
                    <div class="product-image skeleton-element"></div>
                    <div class="product-tag skeleton-element-small">New</div>
                </div>
                <div class="product-info">
                    <div class="product-header">
                        <h4 class="product-title skeleton-element">Premium Headphones</h4>
                        <div class="product-rating">
                            <svg
                                v-for="i in 5"
                                :key="i"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                class="skeleton-element-icon"
                            >
                                <path
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                />
                            </svg>
                        </div>
                    </div>
                    <p class="product-description skeleton-element">
                        Experience crystal-clear audio with active noise cancellation.
                    </p>
                    <div class="product-footer">
                        <div class="price-wrapper">
                            <span class="price-current skeleton-element">$299</span>
                            <span class="price-old skeleton-element">$399</span>
                        </div>
                        <button class="add-to-cart-btn skeleton-element">Add to Cart</button>
                    </div>
                </div>
            </div>
        </template>

        <!-- 评论列表骨架屏 -->
        <template v-else-if="type === 'list'">
            <div class="comments-wrapper">
                <div v-for="i in rows" :key="i" class="comment-item glass-effect">
                    <div class="comment-avatar skeleton-element"></div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author skeleton-element">Sarah Johnson</span>
                            <span class="comment-time skeleton-element">5 minutes ago</span>
                        </div>
                        <p class="comment-text skeleton-element">
                            This is absolutely amazing! The attention to detail is incredible.
                        </p>
                        <div class="comment-actions">
                            <button class="action-btn skeleton-element">42</button>
                            <button class="action-btn skeleton-element">Reply</button>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 网格骨架屏 -->
        <template v-else-if="type === 'grid'">
            <div class="gallery-grid">
                <div v-for="i in rows * columns" :key="i" class="gallery-item glass-effect">
                    <div class="skeleton-element gallery-image-skeleton"></div>
                    <div class="gallery-overlay">
                        <h4 class="skeleton-element">Mountain View</h4>
                        <p class="skeleton-element">Nature</p>
                    </div>
                </div>
            </div>
        </template>

        <!-- 表单骨架屏 - 使用骨架屏块替代输入框 -->
        <template v-else-if="type === 'form'">
            <div class="contact-form glass-effect">
                <div class="form-group">
                    <div class="form-label skeleton-element"></div>
                    <div class="form-input-skeleton skeleton-element"></div>
                </div>
                <div class="form-group">
                    <div class="form-label skeleton-element"></div>
                    <div class="form-input-skeleton skeleton-element"></div>
                </div>
                <div class="form-group">
                    <div class="form-label skeleton-element"></div>
                    <div class="form-input-skeleton skeleton-element"></div>
                </div>
                <div class="form-group">
                    <div class="form-label skeleton-element"></div>
                    <div class="form-textarea-skeleton skeleton-element"></div>
                </div>
                <div class="form-button-skeleton skeleton-element"></div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
    interface Props {
        type?: 'card' | 'list' | 'article' | 'profile' | 'grid' | 'form';
        rows?: number;
        columns?: number;
    }

    withDefaults(defineProps<Props>(), {
        type: 'card',
        rows: 3,
        columns: 3,
    });
</script>

<style scoped lang="scss">
    .skeleton-preset {
        width: 100%;
    }

    // 主骨架屏元素样式 - 添加圆角
    .skeleton-element {
        position: relative;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.06) !important;
        color: transparent !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
        user-select: none;
        pointer-events: none;
        border-radius: 6px !important; // 统一添加圆角

        // 隐藏内部文字和图标
        * {
            opacity: 0 !important;
        }

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%);
            animation: shimmer 2s infinite;
            transform: translateX(-100%);
        }
    }

    // 小元素骨架屏（badge、tag等）- 保持原有圆角
    .skeleton-element-small {
        position: relative;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.08) !important;
        color: transparent !important;
        user-select: none;
        pointer-events: none;

        * {
            opacity: 0 !important;
        }

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%);
            animation: shimmer 2s infinite;
            transform: translateX(-100%);
        }
    }

    // 图标骨架屏样式
    .skeleton-element-icon {
        position: relative;
        overflow: hidden;
        color: rgba(255, 255, 255, 0.08) !important;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
            animation: shimmer 2s infinite;
            transform: translateX(-100%);
        }
    }

    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    // 以下是与实际内容完全相同的样式
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
            border-radius: 50% !important; // 圆形头像保持圆形
            border: 4px solid rgba(102, 126, 234, 0.3);
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
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
                display: block;
            }

            .bio {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.7);
                line-height: 1.6;
                margin: 0 0 24px 0;
                display: block;
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
            border-radius: 12px !important;
            color: white;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 6px 24px rgba(102, 126, 234, 0.3);
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
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.12) 100%);
            border-radius: 0 !important; // 封面图不需要额外圆角

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
                border-radius: 50% !important; // 头像保持圆形
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
                border-radius: 12px !important;
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
            border-radius: 8px !important;
            color: rgba(255, 255, 255, 0.9);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
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
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.12) 100%);
                border-radius: 0 !important; // 封面图不需要额外圆角
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
            border-radius: 10px !important;
            color: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
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

        .comment-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50% !important; // 头像保持圆形
            border: 2px solid rgba(102, 126, 234, 0.3);
            flex-shrink: 0;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.18) 0%, rgba(118, 75, 162, 0.15) 100%);
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
            border-radius: 8px !important;
            color: rgba(255, 255, 255, 0.8);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
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

        .gallery-image-skeleton {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.12) 100%);
            border-radius: 0 !important; // 内部图片不需要额外圆角
        }

        .gallery-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            background: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
            opacity: 0;

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
    }

    // 联系表单 - 使用骨架屏块
    .contact-form {
        padding: 28px;
        border-radius: 20px;

        .form-group {
            margin-bottom: 20px;
        }

        // 表单标签骨架屏
        .form-label {
            display: block;
            height: 16px;
            width: 100px;
            margin-bottom: 8px;
        }

        // 输入框骨架屏
        .form-input-skeleton {
            width: 100%;
            height: 44px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 10px;
        }

        // 文本域骨架屏
        .form-textarea-skeleton {
            width: 100%;
            height: 100px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 10px;
        }

        // 提交按钮骨架屏
        .form-button-skeleton {
            width: 100%;
            height: 48px;
            border-radius: 12px;
            margin-top: 8px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.12) 100%);
        }
    }

    // 响应式
    @media (max-width: 1200px) {
        .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .user-card {
            .user-stats {
                flex-direction: column;
                gap: 16px;

                .stat-divider {
                    display: none;
                }
            }
        }

        .gallery-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
