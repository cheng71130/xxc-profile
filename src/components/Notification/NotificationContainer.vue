<template>
    <teleport to="body">
        <transition-group
            :name="getTransitionName(position)"
            tag="div"
            v-for="position in positions"
            :key="position"
            :class="['notification-container', position]"
        >
            <div
                v-for="notification in getNotificationsByPosition(position)"
                :key="notification.id"
                :class="['notification', notification.type]"
                @mouseenter="pauseTimer(notification.id)"
                @mouseleave="resumeTimer(notification.id)"
            >
                <div class="notification-icon">
                    <svg
                        v-if="notification.type === 'success'"
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <svg
                        v-else-if="notification.type === 'error'"
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <svg
                        v-else-if="notification.type === 'warning'"
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                    >
                        <path
                            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                        ></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </div>

                <div class="notification-content">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div v-if="notification.message" class="notification-message">
                        {{ notification.message }}
                    </div>
                </div>

                <button @click="removeNotification(notification.id)" class="notification-close">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div class="notification-progress">
                    <div class="progress-bar" :style="{ animationDuration: `${notification.duration}ms` }"></div>
                </div>
            </div>
        </transition-group>
    </teleport>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import type { Notification, NotificationOptions } from './types';

    const notifications = ref<Notification[]>([]);
    let notificationId = 0;

    const positions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];

    const getNotificationsByPosition = (position: string) => {
        return notifications.value.filter((n) => n.position === position);
    };

    const getTransitionName = (position: string) => {
        if (position.includes('left')) return 'slide-left';
        if (position.includes('right')) return 'slide-right';
        return 'slide-center';
    };

    const addNotification = (options: NotificationOptions) => {
        const id = ++notificationId;
        const notification: Notification = {
            id,
            type: options.type || 'info',
            title: options.title,
            message: options.message || '',
            position: options.position || 'top-right',
            duration: options.duration || 5000,
            startTime: Date.now(),
        };

        notifications.value.push(notification);

        notification.timer = window.setTimeout(() => {
            removeNotification(id);
        }, notification.duration);

        return id;
    };

    const removeNotification = (id: number) => {
        const index = notifications.value.findIndex((n) => n.id === id);
        if (index > -1) {
            const notification = notifications.value[index];
            if (notification.timer) {
                clearTimeout(notification.timer);
            }
            notifications.value.splice(index, 1);
        }
    };

    const pauseTimer = (id: number) => {
        const notification = notifications.value.find((n) => n.id === id);
        if (notification && notification.timer) {
            clearTimeout(notification.timer);
            notification.pausedTime = Date.now();
        }
    };

    const resumeTimer = (id: number) => {
        const notification = notifications.value.find((n) => n.id === id);
        if (notification && notification.pausedTime && notification.startTime) {
            const elapsed = notification.pausedTime - notification.startTime;
            const remaining = notification.duration - elapsed;

            notification.startTime = Date.now() - elapsed;
            notification.timer = window.setTimeout(() => {
                removeNotification(id);
            }, remaining);

            delete notification.pausedTime;
        }
    };

    defineExpose({
        addNotification,
        removeNotification,
    });
</script>

<style scoped lang="scss">
    // 通知容器定位
    .notification-container {
        position: fixed;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
        pointer-events: none;

        &.top-left {
            top: 1.5rem;
            left: 1.5rem;
        }

        &.top-center {
            top: 1.5rem;
            left: 50%;
            transform: translateX(-50%);
        }

        &.top-right {
            top: 1.5rem;
            right: 1.5rem;
        }

        &.bottom-left {
            bottom: 1.5rem;
            left: 1.5rem;
        }

        &.bottom-center {
            bottom: 1.5rem;
            left: 50%;
            transform: translateX(-50%);
        }

        &.bottom-right {
            bottom: 1.5rem;
            right: 1.5rem;
        }
    }

    // 通知卡片
    .notification {
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        min-width: 360px;
        max-width: 440px;
        padding: 1.25rem 1.5rem;
        border-radius: 1rem;
        backdrop-filter: blur(16px);
        border: 1px solid;
        pointer-events: auto;
        overflow: hidden;
        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100%;
            opacity: 0.05;
            pointer-events: none;
        }

        &.success {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.08) 100%);
            border-color: rgba(16, 185, 129, 0.35);

            &::before {
                background: radial-gradient(circle at top right, #10b981, transparent);
            }

            .notification-icon {
                color: #10b981;
                background: rgba(16, 185, 129, 0.12);
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);
            }

            .progress-bar {
                background: linear-gradient(90deg, #10b981, #059669);
            }
        }

        &.error {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(220, 38, 38, 0.08) 100%);
            border-color: rgba(239, 68, 68, 0.35);

            &::before {
                background: radial-gradient(circle at top right, #ef4444, transparent);
            }

            .notification-icon {
                color: #ef4444;
                background: rgba(239, 68, 68, 0.12);
                box-shadow: 0 0 20px rgba(239, 68, 68, 0.25);
            }

            .progress-bar {
                background: linear-gradient(90deg, #ef4444, #dc2626);
            }
        }

        &.warning {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.08) 100%);
            border-color: rgba(245, 158, 11, 0.35);

            &::before {
                background: radial-gradient(circle at top right, #f59e0b, transparent);
            }

            .notification-icon {
                color: #f59e0b;
                background: rgba(245, 158, 11, 0.12);
                box-shadow: 0 0 20px rgba(245, 158, 11, 0.25);
            }

            .progress-bar {
                background: linear-gradient(90deg, #f59e0b, #d97706);
            }
        }

        &.info {
            background: linear-gradient(
                135deg,
                color-mix(in srgb, var(--el-color-primary, #3b82f6) 12%, transparent) 0%,
                color-mix(in srgb, var(--el-color-primary, #3b82f6) 8%, transparent) 100%
            );
            border-color: color-mix(in srgb, var(--el-color-primary, #3b82f6) 35%, transparent);

            &::before {
                background: radial-gradient(circle at top right, var(--el-color-primary, #3b82f6), transparent);
            }

            .notification-icon {
                color: var(--el-color-primary, #3b82f6);
                background: color-mix(in srgb, var(--el-color-primary, #3b82f6) 12%, transparent);
                box-shadow: 0 0 20px color-mix(in srgb, var(--el-color-primary, #3b82f6) 25%, transparent);
            }

            .progress-bar {
                background: linear-gradient(
                    90deg,
                    var(--el-color-primary, #3b82f6),
                    color-mix(in srgb, var(--el-color-primary, #3b82f6) 85%, #000)
                );
            }
        }
    }

    .notification-icon {
        flex-shrink: 0;
        width: 44px;
        height: 44px;
        border-radius: 0.625rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
    }

    .notification-content {
        flex: 1;
        min-width: 0;
        position: relative;
        z-index: 1;
    }

    .notification-title {
        font-size: 1rem;
        font-weight: 600;
        color: #f8fafc;
        margin-bottom: 0.375rem;
        letter-spacing: -0.25px;
    }

    .notification-message {
        font-size: 0.875rem;
        color: #cbd5e1;
        line-height: 1.6;
    }

    .notification-close {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        border: none;
        background: rgba(148, 163, 184, 0.08);
        border-radius: 0.5rem;
        color: #94a3b8;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        position: relative;
        z-index: 1;

        &:hover {
            background: rgba(148, 163, 184, 0.15);
            color: #f8fafc;
            transform: rotate(90deg);
        }
    }

    .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: rgba(148, 163, 184, 0.08);
        overflow: hidden;
    }

    .progress-bar {
        height: 100%;
        width: 100%;
        transform-origin: left;
        animation: progress linear forwards;
    }

    @keyframes progress {
        from {
            transform: scaleX(1);
        }
        to {
            transform: scaleX(0);
        }
    }

    // 动画效果
    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-center-enter-active,
    .slide-center-leave-active {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .slide-right-enter-from {
        opacity: 0;
        transform: translateX(100%) scale(0.9);
    }

    .slide-right-leave-to {
        opacity: 0;
        transform: translateX(100%) scale(0.9);
    }

    .slide-left-enter-from {
        opacity: 0;
        transform: translateX(-100%) scale(0.9);
    }

    .slide-left-leave-to {
        opacity: 0;
        transform: translateX(-100%) scale(0.9);
    }

    .slide-center-enter-from {
        opacity: 0;
        transform: translateX(-50%) translateY(-30px) scale(0.9);
    }

    .slide-center-leave-to {
        opacity: 0;
        transform: translateX(-50%) translateY(-30px) scale(0.9);
    }

    // 响应式
    @media (max-width: 768px) {
        .notification-container {
            &.top-left,
            &.top-right,
            &.top-center {
                top: 1rem;
                left: 1rem;
                right: 1rem;
                transform: none;
            }

            &.bottom-left,
            &.bottom-right,
            &.bottom-center {
                bottom: 1rem;
                left: 1rem;
                right: 1rem;
                transform: none;
            }
        }

        .notification {
            min-width: auto;
            width: 100%;
        }
    }
</style>
