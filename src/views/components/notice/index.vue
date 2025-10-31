<template>
    <div>
        <div class="control-panel animate__animated animate__fadeIn">
            <div class="panel-header">
                <div class="header-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </div>
                <div>
                    <h2>消息反馈</h2>
                    <p class="subtitle">选择类型和位置来测试通知效果</p>
                </div>
            </div>

            <div class="divider"></div>

            <div class="controls">
                <div class="control-row">
                    <div class="position-selector">
                        <label>显示位置</label>
                        <div class="position-grid">
                            <button
                                v-for="pos in positionOptions"
                                :key="pos.value"
                                :class="['position-btn', { active: demoPosition === pos.value }]"
                                @click="demoPosition = pos.value"
                                :title="pos.label"
                            >
                                <div :class="['position-dot', pos.position]"></div>
                            </button>
                        </div>
                    </div>

                    <div class="type-selector">
                        <label>通知类型</label>
                        <div class="type-buttons">
                            <button
                                v-for="type in types"
                                :key="type.value"
                                :class="['type-btn', type.value, { active: demoType === type.value }]"
                                @click="demoType = type.value"
                            >
                                <svg
                                    v-if="type.value === 'success'"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <svg
                                    v-else-if="type.value === 'error'"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                                <svg
                                    v-else-if="type.value === 'warning'"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
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
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                <span>{{ type.label }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <button @click="showNotification" class="trigger-btn">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>触发通知</span>
                    <div class="btn-glow"></div>
                </button>
            </div>
        </div>

        <!-- 通知容器 -->
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
                        <div v-if="notification.message" class="notification-message">{{ notification.message }}</div>
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
    </div>
</template>

<script setup lang="ts">
    interface Notification {
        id: number;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message?: string;
        duration: number;
        position: string;
        timer?: number;
        pausedTime?: number;
        startTime?: number;
    }

    const notifications = ref<Notification[]>([]);
    let notificationId = 0;

    const positions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];

    const demoType = ref<'success' | 'error' | 'warning' | 'info'>('success');
    const demoPosition = ref('top-right');

    const types = [
        { value: 'success', label: '成功' },
        { value: 'info', label: '信息' },
        { value: 'warning', label: '警告' },
        { value: 'error', label: '错误' },
    ] as const;

    const positionOptions = [
        { value: 'top-left', label: '左上', position: 'tl' },
        { value: 'top-center', label: '顶部居中', position: 'tc' },
        { value: 'top-right', label: '右上', position: 'tr' },
        { value: 'bottom-left', label: '左下', position: 'bl' },
        { value: 'bottom-center', label: '底部居中', position: 'bc' },
        { value: 'bottom-right', label: '右下', position: 'br' },
    ];

    const messages = {
        success: {
            title: '操作成功',
            message: '你的更改已成功保存到系统中',
        },
        error: {
            title: '操作失败',
            message: '抱歉，处理请求时发生了错误',
        },
        warning: {
            title: '注意',
            message: '该操作可能会影响现有数据',
        },
        info: {
            title: '系统提示',
            message: '发现新版本可用，建议及时更新',
        },
    };

    const getNotificationsByPosition = (position: string) => {
        return notifications.value.filter((n) => n.position === position);
    };

    const getTransitionName = (position: string) => {
        if (position.includes('left')) return 'slide-left';
        if (position.includes('right')) return 'slide-right';
        return 'slide-center';
    };

    const showNotification = () => {
        const msg = messages[demoType.value];
        addNotification({
            type: demoType.value,
            title: msg.title,
            message: msg.message,
            position: demoPosition.value,
            duration: 5000,
        });
    };

    const addNotification = (options: {
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message?: string;
        position?: string;
        duration?: number;
    }) => {
        const id = ++notificationId;
        const notification: Notification = {
            id,
            type: options.type,
            title: options.title,
            message: options.message,
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
        success: (title: string, message?: string, options = {}) => {
            return addNotification({ type: 'success', title, message, ...options });
        },
        error: (title: string, message?: string, options = {}) => {
            return addNotification({ type: 'error', title, message, ...options });
        },
        warning: (title: string, message?: string, options = {}) => {
            return addNotification({ type: 'warning', title, message, ...options });
        },
        info: (title: string, message?: string, options = {}) => {
            return addNotification({ type: 'info', title, message, ...options });
        },
        remove: removeNotification,
    });
</script>

<style scoped lang="scss">
    // 控制面板
    .control-panel {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%);
        border-radius: 1.25rem;
        border: 1px solid rgba(148, 163, 184, 0.12);
        backdrop-filter: blur(20px);
        overflow: hidden;
        position: relative;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--el-color-primary, #3b82f6) 50%, transparent);
            opacity: 0.5;
        }
    }

    .panel-header {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        padding: 1.75rem 2rem;

        .header-icon {
            width: 56px;
            height: 56px;
            border-radius: 1rem;
            background: linear-gradient(
                135deg,
                color-mix(in srgb, var(--el-color-primary, #3b82f6) 20%, transparent),
                color-mix(in srgb, var(--el-color-primary, #3b82f6) 15%, transparent)
            );
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--el-color-primary, #3b82f6);
            box-shadow: 0 0 30px color-mix(in srgb, var(--el-color-primary, #3b82f6) 25%, transparent);
        }

        h2 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.5px;
        }

        .subtitle {
            margin: 0.375rem 0 0 0;
            font-size: 0.875rem;
            color: #94a3b8;
        }
    }

    .divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.1), transparent);
    }

    .controls {
        padding: 2rem;
    }

    .control-row {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        margin-bottom: 2rem;
    }

    // 类型选择器
    .type-selector {
        width: 700px;
        label {
            display: block;
            font-size: 0.8125rem;
            font-weight: 600;
            color: #cbd5e1;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 1rem;
        }
    }

    .type-buttons {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }

    .type-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 1.125rem 1.25rem;
        border: 1.5px solid rgba(148, 163, 184, 0.12);
        border-radius: 0.75rem;
        background: rgba(15, 23, 42, 0.4);
        color: #cbd5e1;
        font-size: 0.9375rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        line-height: 1;

        svg {
            flex-shrink: 0;
        }

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0;
            transition: opacity 0.25s;
        }

        &:hover {
            transform: translateY(-2px);
            border-color: rgba(148, 163, 184, 0.25);
        }

        &.active {
            border-color: currentColor;
            color: #fff;

            &::before {
                opacity: 0.1;
            }
        }

        &.success {
            &.active {
                color: #10b981;
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);

                &::before {
                    background: #10b981;
                }
            }
        }

        &.info {
            &.active {
                color: var(--el-color-primary, #3b82f6);
                box-shadow: 0 0 20px color-mix(in srgb, var(--el-color-primary, #3b82f6) 20%, transparent);

                &::before {
                    background: var(--el-color-primary, #3b82f6);
                }
            }
        }

        &.warning {
            &.active {
                color: #f59e0b;
                box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);

                &::before {
                    background: #f59e0b;
                }
            }
        }

        &.error {
            &.active {
                color: #ef4444;
                box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);

                &::before {
                    background: #ef4444;
                }
            }
        }
    }

    // 位置选择器
    .position-selector {
        width: 250px;
        label {
            display: block;
            font-size: 0.8125rem;
            font-weight: 600;
            color: #cbd5e1;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 1rem;
        }
    }

    .position-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
        padding: 1.25rem;
        background: rgba(15, 23, 42, 0.4);
        border-radius: 0.75rem;
        border: 1.5px solid rgba(148, 163, 184, 0.12);
    }

    .position-btn {
        aspect-ratio: 1;
        border: none;
        border-radius: 0.625rem;
        background: rgba(148, 163, 184, 0.05);
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 56px;

        &:hover {
            background: rgba(148, 163, 184, 0.1);
        }

        &.active {
            background: color-mix(in srgb, var(--el-color-primary, #3b82f6) 15%, transparent);
            box-shadow: 0 0 15px color-mix(in srgb, var(--el-color-primary, #3b82f6) 25%, transparent);

            .position-dot {
                background: var(--el-color-primary, #3b82f6);
                box-shadow: 0 0 10px color-mix(in srgb, var(--el-color-primary, #3b82f6) 50%, transparent);
            }
        }
    }

    .position-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #64748b;
        transition: all 0.2s;
        position: absolute;

        &.tl {
            top: 10px;
            left: 10px;
        }
        &.tc {
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
        }
        &.tr {
            top: 10px;
            right: 10px;
        }
        &.bl {
            bottom: 10px;
            left: 10px;
        }
        &.bc {
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
        }
        &.br {
            bottom: 10px;
            right: 10px;
        }
    }

    // 触发按钮
    .trigger-btn {
        width: 100%;
        padding: 1.125rem 1.5rem;
        border: none;
        border-radius: 0.875rem;
        background: linear-gradient(
            135deg,
            var(--el-color-primary, #3b82f6) 0%,
            color-mix(in srgb, var(--el-color-primary, #3b82f6) 85%, #000) 100%
        );
        color: white;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.625rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        .btn-glow {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
            opacity: 0;
            transition: opacity 0.3s;
        }

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px color-mix(in srgb, var(--el-color-primary, #3b82f6) 40%, transparent);

            .btn-glow {
                opacity: 1;
            }
        }

        &:active {
            transform: translateY(-1px);
        }
    }

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
    @media (max-width: 1024px) {
        .control-row {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
    }

    @media (max-width: 768px) {
        .panel-header {
            padding: 1.5rem;
        }

        .controls {
            padding: 1.5rem;
        }

        .type-buttons {
            grid-template-columns: 1fr;
        }

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
