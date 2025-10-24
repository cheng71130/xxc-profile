<template>
    <div class="showcase-container h-screen flex overflow-hidden">
        <!-- 侧边栏 -->
        <div class="sidebar w-96 flex flex-col overflow-hidden">
            <!-- 头部标题 -->
            <div class="sidebar-header p-8 flex-shrink-0">
                <div class="header-content">
                    <div class="title-section">
                        <h1 class="main-title">前端展馆</h1>
                        <h2 class="sub-title">展示台</h2>
                    </div>
                    <div class="header-decoration">
                        <div class="decoration-line"></div>
                        <div class="decoration-dots">
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 搜索 -->
            <div class="search-section px-8 mb-8 flex-shrink-0">
                <div class="search-container">
                    <input v-model="searchQuery" type="text" placeholder="搜索组件" class="search-input" />
                    <div class="search-icon">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- 组件列表 -->
            <div class="components-section flex-1 px-8 pb-8 overflow-y-auto custom-scrollbar">
                <div class="components-list space-y-4">
                    <div
                        v-for="(component, index) in filteredComponents"
                        :key="component.id"
                        @click="selectComponent(component)"
                        :class="['component-item', { active: selectedComponent?.id === component.id }]"
                        :style="{ '--delay': `${index * 0.1}s` }"
                    >
                        <div class="item-background"></div>
                        <div class="item-content">
                            <div class="item-left">
                                <div class="component-icon">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            :d="component.iconPath"
                                        />
                                    </svg>
                                </div>
                                <div class="component-info">
                                    <h3 class="component-name">{{ component.name }}</h3>
                                    <p class="component-description">{{ component.summarize }}</p>
                                </div>
                            </div>
                            <div class="item-right">
                                <div class="status-indicator"></div>
                                <div class="arrow">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 主预览区域 -->
        <div class="main-area flex-1 flex flex-col overflow-hidden">
            <!-- 空状态 -->
            <div v-if="!selectedComponent" class="empty-container">
                <div class="empty-background">
                    <div class="bg-pattern"></div>
                    <div class="bg-gradient"></div>
                </div>
                <div class="empty-content">
                    <div class="empty-icon">
                        <div class="icon-circle">
                            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 class="empty-title">准备探索</h2>
                    <p class="empty-subtitle">从左侧选择一个组件来查看演示效果</p>
                    <div class="empty-stats">
                        <div class="stat">
                            <span class="stat-number">{{ components.length }}</span>
                            <span class="stat-label">个组件</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 组件预览 -->
            <div v-else class="preview-container custom-scrollbar">
                <!-- 预览头部 -->
                <div class="preview-header">
                    <div class="header-background"></div>
                    <div class="header-content">
                        <div class="component-meta">
                            <div class="meta-icon">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        :d="selectedComponent.iconPath"
                                    />
                                </svg>
                            </div>
                            <div class="meta-text">
                                <h1 class="preview-title">{{ selectedComponent.name }}</h1>
                                <p class="preview-description">{{ selectedComponent.description }}</p>
                            </div>
                        </div>
                        <div class="header-actions">
                            <div class="version-badge">v1.0</div>
                            <div class="status-badge">
                                <div class="status-dot"></div>
                                可用
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 预览内容 -->
                <div class="preview-content">
                    <div class="content-background">
                        <div class="grid-pattern"></div>
                    </div>
                    <div class="component-wrapper">
                        <component :is="selectedComponent.component" v-if="selectedComponent.component" />
                        <div v-else class="placeholder-content">
                            <div class="placeholder-icon">
                                <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 class="placeholder-title">{{ selectedComponent.name }}</h3>
                            <p class="placeholder-text">组件将在此处渲染</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import LargeFileUpload from '@/views/components/largeFileUpload/index.vue';
    import VirtualizedTable from '@/views/components/virtualizedTable/index.vue';
    import SimpleLoading from '@/views/components/simpleLoading/index.vue';
    import ConfigurableLoading from '@/views/components/configurableLoading/index.vue';

    // 响应式数据
    const searchQuery = ref('');
    const selectedComponent = ref(null);

    // 组件列表
    const components = ref([
        {
            id: 1,
            name: '文件上传',
            summarize: '普通文件、大文件上传的高级组件',
            description:
                '支持拖拽上传、智能分片（带重试机制）、并发控制、断点续传、进度追踪，web worker采样计算hash实现真正秒传，文件完整性校验待实现（一般不需要），对标阿里云盘，百度云上传等。',
            iconPath:
                'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
            component: LargeFileUpload,
        },
        {
            id: 2,
            name: '自定义loading',
            summarize: '高性能不卡顿的过度动画插件',
            description: '高性能，动画丝滑流畅，减少CPU占用，自定义样式简单，纯CSS实现，0依赖',
            iconPath:
                'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122',
            component: ConfigurableLoading,
        },
        {
            id: 3,
            name: '数据表格',
            summarize: '大数据表格，支持排序、筛选等功能',
            description: '高级数据表格，支持大数据渲染、排序、筛选和分页功能',
            iconPath: 'M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1z',
            component: VirtualizedTable,
        },
        {
            id: 4,
            name: '智能表单',
            summarize: '带有验证和自动完成功能的智能表单组件',
            description: '带有验证和自动完成功能的智能表单组件',
            iconPath:
                'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            component: SimpleLoading,
        },
        {
            id: 5,
            name: '数据卡片',
            summarize: '美观的数据展示卡片，支持图表和指标显示',
            description: '美观的数据展示卡片，支持图表和指标显示',
            iconPath:
                'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
            component: null,
        },
        {
            id: 6,
            name: '分析图表',
            summarize: '交互式图表组件，用于数据可视化展示',
            description: '交互式图表组件，用于数据可视化展示',
            iconPath:
                'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            component: null,
        },
        {
            id: 7,
            name: '通知系统',
            summarize: '现代化通知组件，支持多种类型和位置',
            description: '现代化通知组件，支持多种类型和位置',
            iconPath: 'M15 17h5l-5 5v-5zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            component: null,
        },
        {
            id: 8,
            name: '导航菜单',
            summarize: '响应式导航菜单，支持多级嵌套和折叠',
            description: '响应式导航菜单，支持多级嵌套和折叠',
            iconPath: 'M4 6h16M4 12h16M4 18h16',
            component: null,
        },
    ]);

    // 计算属性
    const filteredComponents = computed(() => {
        if (!searchQuery.value) return components.value;

        const query = searchQuery.value.toLowerCase();
        return components.value.filter(
            (component) =>
                component.name.toLowerCase().includes(query) || component.description.toLowerCase().includes(query)
        );
    });

    // 方法
    const selectComponent = (component) => {
        selectedComponent.value = component;
    };
</script>

<style scoped lang="scss">
    @use './styles/index.scss';
</style>
