<template>
    <div class="draggable-demo animate__animated animate__fadeIn">
        <!-- 顶部操作栏 -->
        <div class="demo-actions">
            <el-radio-group v-model="currentDemo" size="large">
                <el-radio-button value="list">列表排序</el-radio-button>
                <el-radio-button value="grid">网格布局</el-radio-button>
                <el-radio-button value="handle">拖拽手柄</el-radio-button>
                <el-radio-button value="multi">多容器</el-radio-button>
                <el-radio-button value="kanban">看板系统</el-radio-button>
            </el-radio-group>

            <button class="reload-btn" @click="resetData">
                <el-icon><RefreshRight /></el-icon>
                <span>重新加载</span>
            </button>
        </div>

        <!-- 列表排序 -->
        <div v-if="currentDemo === 'list'">
            <div class="section-header">
                <h3>任务列表拖拽排序</h3>
                <el-tag type="info" effect="dark">{{ listData.length }} 项任务</el-tag>
            </div>

            <DraggableCore
                v-model="listData"
                animation="flip-list"
                :style="{ '--list-gap': '12px' }"
                @change="handleListChange"
            >
                <template #default="{ item }">
                    <div class="task-item" :class="{ 'is-completed': item.completed }">
                        <el-checkbox
                            :model-value="item.completed"
                            @update:model-value="(val: any) => handleTaskToggle(item, val)"
                            size="large"
                            class="task-checkbox"
                        />

                        <div class="task-content">
                            <div class="task-title" :class="{ completed: item.completed }">
                                {{ item.title }}
                            </div>
                            <div class="task-meta">
                                <span class="meta-item">
                                    <el-icon><Clock /></el-icon>
                                    {{ item.dueDate }}
                                </span>
                                <span class="meta-item">
                                    <el-icon><User /></el-icon>
                                    {{ item.assignee }}
                                </span>
                                <el-tag
                                    :type="getPriorityType(item.priority)"
                                    size="small"
                                    effect="dark"
                                    class="priority-tag"
                                >
                                    {{ item.priority }}优先级
                                </el-tag>
                            </div>
                        </div>

                        <div class="task-actions">
                            <button class="action-btn edit-btn" @click.stop>
                                <el-icon><Edit /></el-icon>
                            </button>
                            <button class="action-btn delete-btn" @click.stop>
                                <el-icon><Delete /></el-icon>
                            </button>
                        </div>
                    </div>
                </template>
            </DraggableCore>
        </div>

        <!-- 网格布局 -->
        <div v-if="currentDemo === 'grid'">
            <div class="section-header">
                <h3>图片画廊拖拽</h3>
                <div class="header-actions">
                    <el-input-number v-model="gridColumns" :min="2" :max="8" size="small" />
                    <span style="margin-left: 12px; color: rgba(255, 255, 255, 0.6)">列</span>
                </div>
            </div>

            <DraggableCore
                v-model="gridData"
                layout="grid"
                :columns="gridColumns"
                :gap="16"
                :style="{ '--grid-columns': gridColumns, '--grid-gap': '16px' }"
                @change="handleGridChange"
            >
                <template #default="{ item }">
                    <div class="image-card">
                        <LazyImage :src="item.url" aspectRatio="4/3" :alt="item.title" />
                        <div class="image-info">
                            <div class="image-title">{{ item.title }}</div>
                            <div class="image-stats">
                                <span>
                                    <el-icon><View /></el-icon>
                                    {{ item.views }}
                                </span>
                                <span>
                                    <el-icon><Star /></el-icon>
                                    {{ item.likes }}
                                </span>
                            </div>
                        </div>
                        <button class="image-delete-btn" @click.stop>
                            <el-icon><Close /></el-icon>
                        </button>
                    </div>
                </template>
            </DraggableCore>
        </div>

        <!-- 拖拽手柄 -->
        <div v-if="currentDemo === 'handle'">
            <div class="section-header">
                <h3>手柄拖拽模式</h3>
                <el-tag type="warning">只能通过手柄拖拽</el-tag>
            </div>

            <DraggableCore
                v-model="handleData"
                handle=".drag-handle"
                :style="{ '--list-gap': '12px' }"
                @change="handleHandleChange"
            >
                <template #default="{ item }">
                    <div class="handle-item">
                        <div class="drag-handle">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <line x1="8" y1="6" x2="8" y2="6" stroke-linecap="round" />
                                <line x1="8" y1="12" x2="8" y2="12" stroke-linecap="round" />
                                <line x1="8" y1="18" x2="8" y2="18" stroke-linecap="round" />
                                <line x1="16" y1="6" x2="16" y2="6" stroke-linecap="round" />
                                <line x1="16" y1="12" x2="16" y2="12" stroke-linecap="round" />
                                <line x1="16" y1="18" x2="16" y2="18" stroke-linecap="round" />
                                <circle cx="8" cy="6" r="2" fill="currentColor" />
                                <circle cx="8" cy="12" r="2" fill="currentColor" />
                                <circle cx="8" cy="18" r="2" fill="currentColor" />
                                <circle cx="16" cy="6" r="2" fill="currentColor" />
                                <circle cx="16" cy="12" r="2" fill="currentColor" />
                                <circle cx="16" cy="18" r="2" fill="currentColor" />
                            </svg>
                        </div>

                        <el-avatar :src="item.avatar" :size="56" />

                        <div class="handle-content">
                            <div class="handle-title">{{ item.name }}</div>
                            <div class="handle-desc">{{ item.role }} · {{ item.department }}</div>
                        </div>

                        <div class="handle-stats">
                            <div class="stat-item">
                                <span class="stat-value">{{ item.projects }}</span>
                                <span class="stat-label">项目</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">{{ item.tasks }}</span>
                                <span class="stat-label">任务</span>
                            </div>
                        </div>

                        <button class="action-btn delete-btn" @click.stop>
                            <el-icon><Delete /></el-icon>
                        </button>
                    </div>
                </template>
            </DraggableCore>
        </div>

        <!-- 多容器拖拽 -->
        <div v-if="currentDemo === 'multi'">
            <div class="section-header">
                <h3>跨容器拖拽</h3>
                <el-tag type="success">支持容器间拖拽</el-tag>
            </div>

            <div class="multi-containers">
                <div class="container-wrapper">
                    <div class="container-header">
                        <el-icon><Box /></el-icon>
                        <span>待处理</span>
                        <el-badge :value="todoItems.length" type="info" />
                    </div>
                    <DraggableCore
                        v-model="todoItems"
                        group="shared"
                        empty-text="拖拽任务到这里"
                        class="drag-container"
                        :style="{ '--list-gap': '10px' }"
                        @add="handleTodoAdd"
                    >
                        <template #default="{ item }">
                            <div class="multi-item" :style="{ '--item-color': item.color }">
                                <div class="multi-content">
                                    <div class="multi-title">{{ item.title }}</div>
                                    <div class="multi-tag">{{ item.tag }}</div>
                                </div>
                                <button class="action-btn delete-btn mini" @click.stop>
                                    <el-icon><Close /></el-icon>
                                </button>
                            </div>
                        </template>
                    </DraggableCore>
                </div>

                <div class="container-wrapper">
                    <div class="container-header">
                        <el-icon><Loading /></el-icon>
                        <span>进行中</span>
                        <el-badge :value="doingItems.length" type="warning" />
                    </div>
                    <DraggableCore
                        v-model="doingItems"
                        group="shared"
                        empty-text="拖拽任务到这里"
                        class="drag-container"
                        :style="{ '--list-gap': '10px' }"
                        @add="handleDoingAdd"
                    >
                        <template #default="{ item }">
                            <div class="multi-item" :style="{ '--item-color': item.color }">
                                <div class="multi-content">
                                    <div class="multi-title">{{ item.title }}</div>
                                    <div class="multi-tag">{{ item.tag }}</div>
                                </div>
                                <button class="action-btn delete-btn mini" @click.stop>
                                    <el-icon><Close /></el-icon>
                                </button>
                            </div>
                        </template>
                    </DraggableCore>
                </div>

                <div class="container-wrapper">
                    <div class="container-header">
                        <el-icon><CircleCheck /></el-icon>
                        <span>已完成</span>
                        <el-badge :value="doneItems.length" type="success" />
                    </div>
                    <DraggableCore
                        v-model="doneItems"
                        group="shared"
                        empty-text="拖拽任务到这里"
                        class="drag-container"
                        :style="{ '--list-gap': '10px' }"
                        @add="handleDoneAdd"
                    >
                        <template #default="{ item }">
                            <div class="multi-item" :style="{ '--item-color': item.color }">
                                <div class="multi-content">
                                    <div class="multi-title">{{ item.title }}</div>
                                    <div class="multi-tag">{{ item.tag }}</div>
                                </div>
                                <button class="action-btn delete-btn mini" @click.stop>
                                    <el-icon><Close /></el-icon>
                                </button>
                            </div>
                        </template>
                    </DraggableCore>
                </div>
            </div>
        </div>

        <!-- 看板系统 -->
        <div v-if="currentDemo === 'kanban'">
            <div class="section-header">
                <h3>项目看板系统</h3>
                <div class="header-actions">
                    <el-button size="small" :icon="Plus" type="primary">新建任务</el-button>
                    <el-button size="small" :icon="Filter">筛选</el-button>
                </div>
            </div>

            <div class="kanban-board">
                <div v-for="column in kanbanColumns" :key="column.id" class="kanban-column">
                    <div class="column-header" :style="{ background: column.color }">
                        <div class="column-title">
                            <el-icon>
                                <component :is="column.icon" />
                            </el-icon>
                            <span>{{ column.title }}</span>
                        </div>
                        <el-badge :value="column.items.length" />
                    </div>

                    <DraggableCore
                        v-model="column.items"
                        group="kanban"
                        :gap="12"
                        class="column-content"
                        empty-text="暂无任务"
                        :style="{ '--list-gap': '12px' }"
                        @add="(e) => handleKanbanAdd(column.title, e)"
                    >
                        <template #default="{ item }">
                            <div class="kanban-card">
                                <div class="card-header">
                                    <el-tag :type="item.type" size="small">{{ item.label }}</el-tag>
                                    <button class="action-btn delete-btn mini" @click.stop>
                                        <el-icon><Close /></el-icon>
                                    </button>
                                </div>

                                <div class="card-title">{{ item.title }}</div>
                                <div class="card-desc">{{ item.description }}</div>

                                <div class="card-tags">
                                    <el-tag v-for="tag in item.tags" :key="tag" size="small" effect="plain">
                                        {{ tag }}
                                    </el-tag>
                                </div>

                                <div class="card-footer">
                                    <div class="card-meta">
                                        <span>
                                            <el-icon><Paperclip /></el-icon>
                                            {{ item.attachments }}
                                        </span>
                                        <span>
                                            <el-icon><ChatDotRound /></el-icon>
                                            {{ item.comments }}
                                        </span>
                                    </div>
                                    <el-avatar-group :max="3" size="small">
                                        <el-avatar
                                            v-for="avatar in item.assignees"
                                            :key="avatar"
                                            :src="avatar"
                                            style="margin-left: 4px"
                                        />
                                    </el-avatar-group>
                                </div>
                            </div>
                        </template>
                    </DraggableCore>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, type Component } from 'vue';
    import {
        RefreshRight,
        Clock,
        User,
        Edit,
        View,
        Star,
        Box,
        Loading,
        CircleCheck,
        Plus,
        Filter,
        Delete,
        Paperclip,
        ChatDotRound,
        Warning,
        Clock as ClockIcon,
        CircleCheckFilled,
        Close,
    } from '@element-plus/icons-vue';
    import { Notification } from '@/components/Notification';
    import DraggableCore from '@/components/DraggableCore/index.vue';
    import LazyImage from '@/components/LazyImage/index.vue';

    interface TaskItem {
        id: number;
        title: string;
        priority: string;
        dueDate: string;
        assignee: string;
        completed: boolean;
    }

    interface ImageItem {
        id: number;
        url: string;
        title: string;
        views: string;
        likes: number;
    }

    interface PersonItem {
        id: number;
        name: string;
        role: string;
        department: string;
        avatar: string;
        projects: number;
        tasks: number;
    }

    interface MultiItem {
        id: number;
        title: string;
        tag: string;
        color: string;
    }

    interface KanbanItem {
        id: string;
        title: string;
        description: string;
        label: string;
        type: '' | 'primary' | 'success' | 'warning' | 'info' | 'danger';
        tags: string[];
        attachments: number;
        comments: number;
        assignees: string[];
    }

    interface KanbanColumn {
        id: string;
        title: string;
        icon: Component;
        color: string;
        items: KanbanItem[];
    }

    const currentDemo = ref<string>('list');
    const gridColumns = ref<number>(4);

    // 列表数据
    const initialListData: TaskItem[] = [
        {
            id: 1,
            title: '完成项目需求文档',
            priority: '高',
            dueDate: '2024-01-15',
            assignee: '张三',
            completed: false,
        },
        {
            id: 2,
            title: '设计系统架构图',
            priority: '高',
            dueDate: '2024-01-16',
            assignee: '李四',
            completed: false,
        },
        {
            id: 3,
            title: '前端组件开发',
            priority: '中',
            dueDate: '2024-01-18',
            assignee: '王五',
            completed: true,
        },
        {
            id: 4,
            title: 'API 接口联调',
            priority: '中',
            dueDate: '2024-01-20',
            assignee: '赵六',
            completed: false,
        },
        {
            id: 5,
            title: '代码审查与优化',
            priority: '低',
            dueDate: '2024-01-22',
            assignee: '孙七',
            completed: false,
        },
    ];

    const listData = ref<TaskItem[]>([...initialListData]);

    // 网格数据
    const initialGridData: ImageItem[] = [
        {
            id: 1,
            url: 'https://picsum.photos/800/600?random=1',
            title: '日落美景',
            views: '2.3k',
            likes: 156,
        },
        {
            id: 2,
            url: 'https://picsum.photos/800/600?random=2',
            title: '城市夜景',
            views: '3.1k',
            likes: 234,
        },
        {
            id: 3,
            url: 'https://picsum.photos/800/600?random=3',
            title: '自然风光',
            views: '1.8k',
            likes: 189,
        },
        {
            id: 4,
            url: 'https://picsum.photos/800/600?random=4',
            title: '山川河流',
            views: '4.2k',
            likes: 312,
        },
        {
            id: 5,
            url: 'https://picsum.photos/800/600?random=5',
            title: '建筑艺术',
            views: '2.9k',
            likes: 267,
        },
        {
            id: 6,
            url: 'https://picsum.photos/800/600?random=6',
            title: '海滨风情',
            views: '3.5k',
            likes: 298,
        },
        {
            id: 7,
            url: 'https://picsum.photos/800/600?random=7',
            title: '森林深处',
            views: '2.7k',
            likes: 203,
        },
        {
            id: 8,
            url: 'https://picsum.photos/800/600?random=8',
            title: '星空银河',
            views: '5.1k',
            likes: 421,
        },
    ];

    const gridData = ref<ImageItem[]>([...initialGridData]);

    // 手柄数据
    const initialHandleData: PersonItem[] = [
        {
            id: 1,
            name: '张三',
            role: '前端工程师',
            department: '技术部',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
            projects: 12,
            tasks: 45,
        },
        {
            id: 2,
            name: '李四',
            role: '后端工程师',
            department: '技术部',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
            projects: 8,
            tasks: 32,
        },
        {
            id: 3,
            name: '王五',
            role: 'UI设计师',
            department: '设计部',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
            projects: 15,
            tasks: 58,
        },
        {
            id: 4,
            name: '赵六',
            role: '产品经理',
            department: '产品部',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
            projects: 10,
            tasks: 67,
        },
    ];

    const handleData = ref<PersonItem[]>([...initialHandleData]);

    // 多容器数据
    const initialTodoItems: MultiItem[] = [
        { id: 1, title: '需求分析', tag: 'PRD', color: '#409eff' },
        { id: 2, title: '技术调研', tag: 'Tech', color: '#67c23a' },
        { id: 3, title: '原型设计', tag: 'Design', color: '#e6a23c' },
    ];

    const initialDoingItems: MultiItem[] = [
        { id: 4, title: '前端开发', tag: 'Dev', color: '#f56c6c' },
        { id: 5, title: '接口联调', tag: 'API', color: '#909399' },
    ];

    const initialDoneItems: MultiItem[] = [
        { id: 6, title: '单元测试', tag: 'Test', color: '#606266' },
        { id: 7, title: '代码审查', tag: 'Review', color: '#409eff' },
    ];

    const todoItems = ref<MultiItem[]>([...initialTodoItems]);
    const doingItems = ref<MultiItem[]>([...initialDoingItems]);
    const doneItems = ref<MultiItem[]>([...initialDoneItems]);

    // 看板数据
    const initialKanbanColumns: KanbanColumn[] = [
        {
            id: 'backlog',
            title: '待办事项',
            icon: Warning,
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            items: [
                {
                    id: 'task-1',
                    title: '用户认证系统重构',
                    description: '升级到 OAuth 2.0 标准',
                    label: '功能',
                    type: 'primary',
                    tags: ['认证', '安全'],
                    attachments: 3,
                    comments: 5,
                    assignees: [
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=11',
                    ],
                },
                {
                    id: 'task-2',
                    title: '数据库性能优化',
                    description: '优化查询速度，添加索引',
                    label: '优化',
                    type: 'warning',
                    tags: ['性能', '数据库'],
                    attachments: 2,
                    comments: 8,
                    assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=12'],
                },
            ],
        },
        {
            id: 'in-progress',
            title: '进行中',
            icon: ClockIcon,
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            items: [
                {
                    id: 'task-3',
                    title: 'Dashboard 页面开发',
                    description: '包含图表和数据展示',
                    label: '开发',
                    type: 'success',
                    tags: ['前端', 'Vue3'],
                    attachments: 5,
                    comments: 12,
                    assignees: [
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=13',
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=14',
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=15',
                    ],
                },
            ],
        },
        {
            id: 'review',
            title: '待审查',
            icon: Edit,
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            items: [
                {
                    id: 'task-4',
                    title: 'API 文档编写',
                    description: '完善接口说明和示例',
                    label: '文档',
                    type: 'info',
                    tags: ['文档', 'API'],
                    attachments: 1,
                    comments: 3,
                    assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=16'],
                },
            ],
        },
        {
            id: 'done',
            title: '已完成',
            icon: CircleCheckFilled,
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            items: [
                {
                    id: 'task-5',
                    title: '登录页面设计',
                    description: '包含响应式布局',
                    label: '设计',
                    type: 'success',
                    tags: ['UI', '响应式'],
                    attachments: 7,
                    comments: 15,
                    assignees: [
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=17',
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=18',
                    ],
                },
            ],
        },
    ];

    const kanbanColumns = ref<KanbanColumn[]>(
        initialKanbanColumns.map((col) => ({
            ...col,
            items: [...col.items.map((item) => ({ ...item }))],
        }))
    );

    const getPriorityType = (priority: string): '' | 'danger' | 'warning' | 'info' => {
        const map: Record<string, '' | 'danger' | 'warning' | 'info'> = {
            高: 'danger',
            中: 'warning',
            低: 'info',
        };
        return map[priority] || 'info';
    };

    const handleListChange = (event: any) => {
        Notification.success('操作成功', '从位置 ' + (event.oldIndex + 1) + ' 移动到 ' + (event.newIndex + 1));
    };

    const handleGridChange = (event: any) => {
        console.log('Grid changed:', event);
        Notification.success('操作成功', '图片位置已更新');
    };

    const handleHandleChange = (event: any) => {
        Notification.success('操作成功', event.item.name + ' 位置已更新');
    };

    const handleTodoAdd = (event: any) => {
        Notification.success('操作成功', '"' + event.item.title + '" 已添加到待处理');
    };

    const handleDoingAdd = (event: any) => {
        Notification.success('操作成功', '"' + event.item.title + '" 已添加到进行中');
    };

    const handleDoneAdd = (event: any) => {
        Notification.success('操作成功', '"' + event.item.title + '" 已添加到已完成');
    };

    const handleKanbanAdd = (columnTitle: string, event: any) => {
        Notification.success('操作成功', '任务 "' + event.item.title + '" 移动到 ' + columnTitle);
    };

    const handleTaskToggle = (task: TaskItem, value: boolean) => {
        task.completed = value;
        Notification.success('操作成功', value ? '任务已完成 ✅' : '任务已重新开启');
    };

    const resetData = () => {
        listData.value = JSON.parse(JSON.stringify(initialListData));
        gridData.value = [...initialGridData];
        handleData.value = [...initialHandleData];
        todoItems.value = [...initialTodoItems];
        doingItems.value = [...initialDoingItems];
        doneItems.value = [...initialDoneItems];
        kanbanColumns.value = initialKanbanColumns.map((col) => ({
            ...col,
            items: [...col.items.map((item) => ({ ...item }))],
        }));
        currentDemo.value = 'list';
        Notification.info('系统提示', '数据已重置');
    };
</script>

<style scoped lang="scss">
    .draggable-demo {
        display: flex;
        flex-direction: column;
        gap: 24px;
        width: 100%;
    }

    .demo-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(10px);
        flex-wrap: wrap;

        :deep(.el-radio-button__inner) {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            transition: all 0.3s;

            &:hover {
                color: #667eea;
                border-color: rgba(102, 126, 234, 0.5);
            }
        }

        :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: #667eea;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .reload-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 30px;
            color: #ffffff;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

            &:hover {
                background: linear-gradient(135deg, #5568d3 0%, #633d8b 100%);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            &:active {
                background: linear-gradient(135deg, #4a5ac4 0%, #553478 100%);
                transform: translateY(0);
                box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
            }

            .el-icon {
                font-size: 16px;
                transition: transform 0.3s;
            }

            &:hover .el-icon {
                transform: rotate(180deg);
            }
        }
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;

        h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: #ffffff;
        }

        .header-actions {
            display: flex;
            align-items: center;
        }
    }

    // 通用按钮样式
    .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }

        &.edit-btn:hover {
            background: rgba(102, 126, 234, 0.2);
            color: #667eea;
        }

        &.delete-btn:hover {
            background: rgba(245, 108, 108, 0.2);
            color: #f56c6c;
        }

        &.mini {
            width: 24px;
            height: 24px;
            border-radius: 6px;
        }
    }

    // 任务列表样式
    .task-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-left: 4px solid #667eea;
        border-radius: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: grab;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        &:active {
            cursor: grabbing;
        }

        &:hover {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.08) 100%);
            border-color: rgba(102, 126, 234, 0.4);
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
        }

        &.is-completed {
            opacity: 0.65;
            border-left-color: #67c23a;

            .task-title {
                text-decoration: line-through;
            }
        }
    }

    .task-checkbox {
        flex-shrink: 0;

        :deep(.el-checkbox__inner) {
            width: 20px;
            height: 20px;
            border-radius: 6px;
        }
    }

    .task-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .task-title {
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        line-height: 1.4;

        &.completed {
            color: rgba(255, 255, 255, 0.4);
        }
    }

    .task-meta {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;

        .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);

            .el-icon {
                color: rgba(102, 126, 234, 0.8);
            }
        }

        .priority-tag {
            font-weight: 500;
        }
    }

    .task-actions {
        flex-shrink: 0;
        display: flex;
        gap: 8px;
        opacity: 0.7;
        transition: opacity 0.3s;

        .task-item:hover & {
            opacity: 1;
        }
    }

    // 图片卡片样式
    .image-card {
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.05);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: grab;
        border: 1px solid rgba(255, 255, 255, 0.08);

        &:active {
            cursor: grabbing;
        }

        &:hover {
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
            transform: translateY(-4px);
            border-color: rgba(102, 126, 234, 0.3);

            .image-delete-btn {
                opacity: 1;
                transform: translate(0, 0);
            }
        }
    }

    .image-info {
        padding: 16px;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;

        .image-title {
            font-size: 15px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 8px;
        }

        .image-stats {
            display: flex;
            gap: 16px;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.7);

            span {
                display: flex;
                align-items: center;
                gap: 4px;
            }
        }
    }

    .image-delete-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(245, 108, 108, 0.95);
        border: none;
        border-radius: 10px;
        color: white;
        cursor: pointer;
        opacity: 0;
        transform: translate(8px, -8px);
        transition: all 0.3s;
        z-index: 10;
        box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);

        &:hover {
            background: #f56c6c;
            transform: translate(0, 0) scale(1.05);
        }
    }

    // 手柄样式
    .handle-item {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 20px 24px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        &:hover {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%);
            border-color: rgba(102, 126, 234, 0.3);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            transform: translateY(-2px);
        }

        .drag-handle {
            flex-shrink: 0;
            color: rgba(255, 255, 255, 0.3);
            cursor: grab;
            transition: all 0.3s;
            padding: 6px;
            border-radius: 8px;

            &:hover {
                color: #667eea;
                background: rgba(102, 126, 234, 0.1);
            }

            &:active {
                cursor: grabbing;
            }
        }

        .handle-content {
            flex: 1;

            .handle-title {
                font-size: 16px;
                font-weight: 600;
                color: #ffffff;
                margin-bottom: 6px;
            }

            .handle-desc {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.6);
            }
        }

        .handle-stats {
            display: flex;
            gap: 32px;

            .stat-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;

                .stat-value {
                    font-size: 22px;
                    font-weight: 700;
                    color: #667eea;
                    line-height: 1;
                }

                .stat-label {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.5);
                }
            }
        }
    }

    // 多容器样式
    .multi-containers {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }

    .container-wrapper {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        overflow: hidden;

        .container-header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 18px;
            background: rgba(255, 255, 255, 0.06);
            font-weight: 600;
            font-size: 15px;
            color: #ffffff;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .drag-container {
            min-height: 300px;
            padding: 12px;
        }
    }

    .multi-item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
        // border: 1px solid rgba(255, 255, 255, 0.1);
        border-left: 4px solid var(--item-color);
        border-radius: 12px;
        cursor: grab;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:active {
            cursor: grabbing;
        }

        &:hover {
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(4px);
        }

        .multi-content {
            flex: 1;
            min-width: 0;
        }

        .multi-title {
            font-size: 14px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 12px;
        }

        .multi-tag {
            display: inline-block;
            padding: 3px 10px;
            background: color-mix(in srgb, var(--item-color) 20%, transparent);
            border-radius: 6px;
            font-size: 12px;
            color: var(--item-color);
            font-weight: 500;
        }
    }

    // 看板样式
    .kanban-board {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
    }

    .kanban-column {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        overflow: hidden;

        .column-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px;
            color: #ffffff;
            font-weight: 600;
            font-size: 15px;

            .column-title {
                display: flex;
                align-items: center;
                gap: 10px;
            }
        }

        .column-content {
            min-height: 400px;
            padding: 12px;
        }
    }

    .kanban-card {
        position: relative;
        padding: 18px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
        // border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 14px;
        cursor: grab;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        &:active {
            cursor: grabbing;
        }

        &:hover {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 100%);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            transform: translateY(-2px);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
        }

        .card-title {
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 8px;
            line-height: 1.4;
        }

        .card-desc {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 14px;
            line-height: 1.5;
        }

        .card-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 14px;
        }

        .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 14px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);

            .card-meta {
                display: flex;
                gap: 14px;
                font-size: 13px;
                color: rgba(255, 255, 255, 0.6);

                span {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
            }
        }
    }

    @media (max-width: 1400px) {
        .kanban-board {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 1024px) {
        .multi-containers {
            grid-template-columns: 1fr;
        }

        .kanban-board {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .demo-actions {
            flex-direction: column;

            :deep(.el-radio-group) {
                width: 100%;
            }
        }

        .handle-item {
            flex-wrap: wrap;

            .handle-stats {
                width: 100%;
                justify-content: space-around;
                padding-top: 12px;
                border-top: 1px solid rgba(255, 255, 255, 0.06);
            }
        }
    }
</style>
