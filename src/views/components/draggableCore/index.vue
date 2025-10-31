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

            <el-button type="primary" @click="resetData" :icon="RefreshRight"> 重置数据 </el-button>
        </div>

        <!-- 列表排序 -->
        <div v-if="currentDemo === 'list'" class="demo-section">
            <div class="section-header">
                <h3>📋 任务列表拖拽排序</h3>
                <el-tag type="info">{{ listData.length }} 项</el-tag>
            </div>

            <DraggableCore
                v-model="listData"
                :removable="true"
                animation="flip-list"
                :style="{ '--list-gap': '12px' }"
                @change="handleListChange"
                @remove="handleListRemove"
            >
                <template #default="{ item }">
                    <div class="task-item">
                        <el-checkbox
                            :model-value="item.completed"
                            @update:model-value="(val:any) => handleTaskToggle(item, val)"
                        />
                        <div class="task-content">
                            <div class="task-title" :class="{ completed: item.completed }">{{ item.title }}</div>
                            <div class="task-meta">
                                <el-tag :type="getPriorityType(item.priority)" size="small">
                                    {{ item.priority }}
                                </el-tag>
                                <span class="task-time">
                                    <el-icon><Clock /></el-icon>
                                    {{ item.dueDate }}
                                </span>
                                <span class="task-assignee">
                                    <el-icon><User /></el-icon>
                                    {{ item.assignee }}
                                </span>
                            </div>
                        </div>
                        <div class="task-actions">
                            <el-button text :icon="Edit" size="small" @click.stop />
                        </div>
                    </div>
                </template>
            </DraggableCore>
        </div>

        <!-- 网格布局 -->
        <div v-if="currentDemo === 'grid'" class="demo-section">
            <div class="section-header">
                <h3>🎨 图片画廊拖拽</h3>
                <div class="header-actions">
                    <el-input-number v-model="gridColumns" :min="2" :max="8" size="small" />
                    <span style="margin-left: 8px; color: rgba(255, 255, 255, 0.6)">列</span>
                </div>
            </div>

            <DraggableCore
                v-model="gridData"
                layout="grid"
                :columns="gridColumns"
                :gap="16"
                :removable="true"
                :style="{ '--grid-columns': gridColumns, '--grid-gap': '16px' }"
                @change="handleGridChange"
                @remove="handleGridRemove"
            >
                <template #default="{ item }">
                    <div class="image-card">
                        <div class="image-wrapper">
                            <img :src="item.url" :alt="item.title" />
                            <div class="image-overlay">
                                <el-icon class="overlay-icon"><ZoomIn /></el-icon>
                            </div>
                        </div>
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
                    </div>
                </template>
            </DraggableCore>
        </div>

        <!-- 拖拽手柄 -->
        <div v-if="currentDemo === 'handle'" class="demo-section">
            <div class="section-header">
                <h3>✋ 手柄拖拽模式</h3>
                <el-tag type="warning">只能通过手柄拖拽</el-tag>
            </div>

            <DraggableCore
                v-model="handleData"
                :handle="true"
                :removable="true"
                :style="{ '--list-gap': '12px' }"
                @change="handleHandleChange"
                @remove="handleHandleRemove"
            >
                <template #default="{ item }">
                    <div class="handle-item">
                        <el-avatar :src="item.avatar" :size="48" />
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
                    </div>
                </template>
            </DraggableCore>
        </div>

        <!-- 多容器拖拽 -->
        <div v-if="currentDemo === 'multi'" class="demo-section">
            <div class="section-header">
                <h3>🔄 跨容器拖拽</h3>
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
                        :removable="true"
                        empty-text="拖拽任务到这里"
                        class="drag-container"
                        :style="{ '--list-gap': '8px' }"
                        @add="handleTodoAdd"
                    >
                        <template #default="{ item }">
                            <div class="multi-item" :style="{ borderLeftColor: item.color }">
                                <div class="multi-title">{{ item.title }}</div>
                                <div class="multi-tag">{{ item.tag }}</div>
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
                        :removable="true"
                        empty-text="拖拽任务到这里"
                        class="drag-container"
                        :style="{ '--list-gap': '8px' }"
                        @add="handleDoingAdd"
                    >
                        <template #default="{ item }">
                            <div class="multi-item" :style="{ borderLeftColor: item.color }">
                                <div class="multi-title">{{ item.title }}</div>
                                <div class="multi-tag">{{ item.tag }}</div>
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
                        :removable="true"
                        empty-text="拖拽任务到这里"
                        class="drag-container"
                        :style="{ '--list-gap': '8px' }"
                        @add="handleDoneAdd"
                    >
                        <template #default="{ item }">
                            <div class="multi-item" :style="{ borderLeftColor: item.color }">
                                <div class="multi-title">{{ item.title }}</div>
                                <div class="multi-tag">{{ item.tag }}</div>
                            </div>
                        </template>
                    </DraggableCore>
                </div>
            </div>
        </div>

        <!-- 看板系统 -->
        <div v-if="currentDemo === 'kanban'" class="demo-section">
            <div class="section-header">
                <h3>📊 项目看板系统</h3>
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
                                    <el-dropdown trigger="click">
                                        <el-icon class="card-more"><MoreFilled /></el-icon>
                                        <template #dropdown>
                                            <el-dropdown-menu>
                                                <el-dropdown-item :icon="Edit">编辑</el-dropdown-item>
                                                <el-dropdown-item :icon="CopyDocument">复制</el-dropdown-item>
                                                <el-dropdown-item :icon="Delete" divided>删除</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </template>
                                    </el-dropdown>
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
                                        <el-avatar v-for="avatar in item.assignees" :key="avatar" :src="avatar" />
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
    import { ref } from 'vue';
    import DraggableCore from './DraggableCore.vue';
    import {
        RefreshRight,
        Clock,
        User,
        Edit,
        ZoomIn,
        View,
        Star,
        Box,
        Loading,
        CircleCheck,
        Plus,
        Filter,
        MoreFilled,
        CopyDocument,
        Delete,
        Paperclip,
        ChatDotRound,
        Warning,
        Clock as ClockIcon,
        CircleCheckFilled,
    } from '@element-plus/icons-vue';
    import { ElMessage } from 'element-plus';
    import type { Component } from 'vue';

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
    const gridColumns = ref<number>(5);

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

    // 网格数据 - 800x600 图片
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
        {
            id: 9,
            url: 'https://picsum.photos/800/600?random=9',
            title: '雪山之巅',
            views: '3.9k',
            likes: 356,
        },
        {
            id: 10,
            url: 'https://picsum.photos/800/600?random=10',
            title: '沙漠绿洲',
            views: '2.5k',
            likes: 198,
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

    const kanbanColumns = ref<KanbanColumn[]>(JSON.parse(JSON.stringify(initialKanbanColumns)));

    const getPriorityType = (priority: string): '' | 'danger' | 'warning' | 'info' => {
        const map: Record<string, '' | 'danger' | 'warning' | 'info'> = {
            高: 'danger',
            中: 'warning',
            低: 'info',
        };
        return map[priority] || 'info';
    };

    // 列表事件处理
    const handleListChange = (event: any) => {
        ElMessage.success('从位置 ' + (event.oldIndex + 1) + ' 移动到 ' + (event.newIndex + 1));
    };

    const handleListRemove = (event: any) => {
        ElMessage.warning('移除了任务: ' + event.item.title);
    };

    // 网格事件处理
    const handleGridChange = (event: any) => {
        console.log('Grid changed:', event);
        ElMessage.success('图片位置已更新');
    };

    const handleGridRemove = (event: any) => {
        ElMessage.warning('移除了图片: ' + event.item.title);
    };

    // 手柄事件处理
    const handleHandleChange = (event: any) => {
        ElMessage.success(event.item.name + ' 位置已更新');
    };

    const handleHandleRemove = (event: any) => {
        ElMessage.warning('移除了成员: ' + event.item.name);
    };

    // 多容器事件处理
    const handleTodoAdd = (event: any) => {
        ElMessage.success('"' + event.item.title + '" 已添加到待处理');
    };

    const handleDoingAdd = (event: any) => {
        ElMessage.success('"' + event.item.title + '" 已添加到进行中');
    };

    const handleDoneAdd = (event: any) => {
        ElMessage.success('"' + event.item.title + '" 已添加到已完成');
    };

    // 看板事件处理
    const handleKanbanAdd = (columnTitle: string, event: any) => {
        ElMessage.success('任务 "' + event.item.title + '" 移动到 ' + columnTitle);
    };

    const handleTaskToggle = (task: TaskItem, value: boolean) => {
        task.completed = value;
        ElMessage.success(value ? '任务已完成 ✅' : '任务已重新开启');
    };

    const resetData = () => {
        listData.value = JSON.parse(JSON.stringify(initialListData));
        gridData.value = [...initialGridData];
        handleData.value = [...initialHandleData];
        todoItems.value = [...initialTodoItems];
        doingItems.value = [...initialDoingItems];
        doneItems.value = [...initialDoneItems];
        kanbanColumns.value = JSON.parse(JSON.stringify(initialKanbanColumns));
        currentDemo.value = 'list';
        ElMessage.info('数据已重置');
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
        padding: 20px 24px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
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
    }

    .demo-section {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 16px;
        padding: 24px;
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);

        h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: #ffffff;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }

    // 任务列表样式
    .task-item {
        display: flex;
        align-items: center;
        gap: 16px;
        width: 100%;

        .task-content {
            flex: 1;
            min-width: 0;

            .task-title {
                font-size: 15px;
                font-weight: 500;
                color: #ffffff;
                margin-bottom: 8px;
                transition: all 0.3s;

                &.completed {
                    color: rgba(255, 255, 255, 0.4);
                    text-decoration: line-through;
                }
            }

            .task-meta {
                display: flex;
                align-items: center;
                gap: 16px;
                font-size: 13px;
                color: rgba(255, 255, 255, 0.5);
                flex-wrap: wrap;

                .task-time,
                .task-assignee {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
            }
        }

        .task-actions {
            flex-shrink: 0;
        }
    }

    // 图片卡片样式
    .image-card {
        overflow: hidden;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);

            .image-overlay {
                opacity: 1;
            }
        }
    }

    .image-wrapper {
        position: relative;
        width: 100%;
        padding-bottom: 75%;
        overflow: hidden;

        img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .image-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.6);
            opacity: 0;
            transition: opacity 0.3s;

            .overlay-icon {
                font-size: 40px;
                color: #ffffff;
            }
        }
    }

    .image-info {
        padding: 12px;

        .image-title {
            font-size: 14px;
            font-weight: 500;
            color: #ffffff;
            margin-bottom: 8px;
        }

        .image-stats {
            display: flex;
            gap: 16px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);

            span {
                display: flex;
                align-items: center;
                gap: 4px;
            }
        }
    }

    // 手柄样式
    .handle-item {
        display: flex;
        align-items: center;
        gap: 16px;
        width: 100%;

        .handle-content {
            flex: 1;
            min-width: 0;

            .handle-title {
                font-size: 15px;
                font-weight: 600;
                color: #ffffff;
                margin-bottom: 4px;
            }

            .handle-desc {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.5);
            }
        }

        .handle-stats {
            display: flex;
            gap: 24px;

            .stat-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;

                .stat-value {
                    font-size: 20px;
                    font-weight: 700;
                    color: #667eea;
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
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        overflow: hidden;

        .container-header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.05);
            font-weight: 600;
            color: #ffffff;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .drag-container {
            min-height: 300px;
            padding: 12px;
        }
    }

    .multi-item {
        padding: 16px;
        border-left: 3px solid;

        .multi-title {
            font-size: 14px;
            font-weight: 500;
            color: #ffffff;
            margin-bottom: 8px;
        }

        .multi-tag {
            display: inline-block;
            padding: 4px 12px;
            background: rgba(102, 126, 234, 0.2);
            border-radius: 6px;
            font-size: 12px;
            color: #667eea;
        }
    }

    // 看板样式
    .kanban-board {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
    }

    .kanban-column {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        overflow: hidden;

        .column-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            color: #ffffff;
            font-weight: 600;

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
        padding: 16px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(102, 126, 234, 0.3);
        }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;

            .card-more {
                cursor: pointer;
                color: rgba(255, 255, 255, 0.4);
                transition: color 0.2s;

                &:hover {
                    color: #667eea;
                }
            }
        }

        .card-title {
            font-size: 15px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 8px;
        }

        .card-desc {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 12px;
            line-height: 1.5;
        }

        .card-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 12px;
        }

        .card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);

            .card-meta {
                display: flex;
                gap: 12px;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.5);

                span {
                    display: flex;
                    align-items: center;
                    gap: 4px;
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
            align-items: stretch;

            :deep(.el-radio-group) {
                width: 100%;
                display: flex;
                flex-direction: column;

                .el-radio-button {
                    width: 100%;
                }
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
