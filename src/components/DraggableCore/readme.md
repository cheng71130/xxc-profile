# 拖拽排序组件使用文档

## 📖 简介

一个功能强大的 Vue 3 拖拽排序组件，支持列表内排序、跨容器拖拽、自定义拖拽手柄、网格布局等特性。基于原生 HTML5 Drag API 实现。

## ✨ 特性

-   🎯 **双向绑定** - 使用 `v-model` 轻松管理数据
-   🔄 **列表内排序** - 同一容器内自由拖拽排序
-   🚀 **跨容器拖拽** - 支持多个容器间数据转移
-   🎨 **自定义插槽** - 完全控制项目渲染样式
-   🎪 **动画过渡** - 流畅的拖拽动画效果
-   🎛️ **拖拽手柄** - 指定特定区域作为拖拽触发点
-   📐 **多种布局** - 支持列表和网格布局
-   🔒 **禁用控制** - 整体或单项禁用拖拽
-   🎨 **自定义样式** - 丰富的样式类名支持

## 📦 安装依赖

组件依赖 Element Plus 图标库：

```bash
npm install @element-plus/icons-vue
```

## 🚀 快速开始

### 基础用法

```vue
<template>
    <Draggable v-model="list">
        <template #default="{ item }">
            <div class="item">{{ item.name }}</div>
        </template>
    </Draggable>
</template>

<script setup>
    import { ref } from 'vue';
    import Draggable from './Draggable.vue';

    const list = ref([
        { id: 1, name: '项目 1' },
        { id: 2, name: '项目 2' },
        { id: 3, name: '项目 3' },
    ]);
</script>
```

### 跨容器拖拽

```vue
<template>
    <div class="container">
        <Draggable v-model="list1" group="shared">
            <template #default="{ item }">
                <div class="item">{{ item.name }}</div>
            </template>
        </Draggable>

        <Draggable v-model="list2" group="shared">
            <template #default="{ item }">
                <div class="item">{{ item.name }}</div>
            </template>
        </Draggable>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import Draggable from './Draggable.vue';

    const list1 = ref([
        { id: 1, name: '列表1-项目1' },
        { id: 2, name: '列表1-项目2' },
    ]);

    const list2 = ref([
        { id: 3, name: '列表2-项目1' },
        { id: 4, name: '列表2-项目2' },
    ]);
</script>
```

### 拖拽手柄

```vue
<template>
    <Draggable v-model="list" handle=".drag-handle">
        <template #default="{ item }">
            <div class="item">
                <el-icon class="drag-handle"><Rank /></el-icon>
                <span>{{ item.name }}</span>
            </div>
        </template>
    </Draggable>
</template>

<script setup>
    import { ref } from 'vue';
    import { Rank } from '@element-plus/icons-vue';
    import Draggable from './Draggable.vue';

    const list = ref([
        { id: 1, name: '只能拖动图标' },
        { id: 2, name: '点击文字无效' },
    ]);
</script>

<style scoped>
    .drag-handle {
        cursor: grab;
        color: #667eea;
        font-size: 20px;
    }

    .drag-handle:active {
        cursor: grabbing;
    }
</style>
```

### 网格布局

```vue
<template>
    <Draggable v-model="list" layout="grid" :columns="4" :gap="16">
        <template #default="{ item }">
            <div class="grid-item">
                <img :src="item.image" />
                <p>{{ item.name }}</p>
            </div>
        </template>
    </Draggable>
</template>

<script setup>
    import { ref } from 'vue';
    import Draggable from './Draggable.vue';

    const list = ref([
        { id: 1, name: '图片1', image: '/img1.jpg' },
        { id: 2, name: '图片2', image: '/img2.jpg' },
        { id: 3, name: '图片3', image: '/img3.jpg' },
        { id: 4, name: '图片4', image: '/img4.jpg' },
    ]);
</script>
```

## 📋 Props

| 参数              | 说明                         | 类型                 | 默认值                 |
| ----------------- | ---------------------------- | -------------------- | ---------------------- |
| `modelValue`      | 绑定的数据列表（必填）       | `Array`              | -                      |
| `itemKey`         | 列表项唯一标识字段或函数     | `String \| Function` | `'id'`                 |
| `disabled`        | 是否禁用拖拽                 | `Boolean`            | `false`                |
| `animation`       | 动画名称                     | `String`             | `'flip-list'`          |
| `handle`          | 拖拽手柄的 CSS 选择器        | `String`             | `''`                   |
| `group`           | 分组名称，相同组可跨容器拖拽 | `String`             | `'default'`            |
| `layout`          | 布局方式                     | `'list' \| 'grid'`   | `'list'`               |
| `gap`             | 列表项间距（px）             | `Number`             | `12`                   |
| `columns`         | 网格布局列数                 | `Number`             | `3`                    |
| `emptyText`       | 空状态提示文字               | `String`             | `'暂无数据，拖拽添加'` |
| `showPlaceholder` | 是否显示放置占位指示器       | `Boolean`            | `true`                 |
| `ghostClass`      | 拖拽时的幽灵元素类名         | `String`             | `''`                   |
| `chosenClass`     | 选中项的类名                 | `String`             | `''`                   |
| `dragClass`       | 拖拽中项的类名               | `String`             | `''`                   |

## 🎯 Events

| 事件名              | 说明                       | 回调参数                       |
| ------------------- | -------------------------- | ------------------------------ |
| `update:modelValue` | 数据更新时触发             | `(value: Array)`               |
| `change`            | 同容器内排序变化时触发     | `{ oldIndex, newIndex, item }` |
| `add`               | 从其他容器添加项目时触发   | `{ item, newIndex }`           |
| `remove`            | 项目被移动到其他容器时触发 | `{ item, oldIndex }`           |
| `start`             | 开始拖拽时触发             | `{ item, index }`              |
| `end`               | 拖拽结束时触发             | `{ item, oldIndex, newIndex }` |

## 🎨 Slots

### default

默认插槽，用于自定义列表项内容。

**参数：**

-   `item` - 当前项数据
-   `index` - 当前项索引

```vue
<Draggable v-model="list">
  <template #default="{ item, index }">
    <div class="custom-item">
      <span>{{ index + 1 }}.</span>
      <span>{{ item.name }}</span>
    </div>
  </template>
</Draggable>
```

### empty

空状态插槽，列表为空时显示。

```vue
<Draggable v-model="list">
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
  
  <template #empty>
    <div class="custom-empty">
      <p>暂无内容</p>
      <el-button>添加项目</el-button>
    </div>
  </template>
</Draggable>
```

## 💡 高级用法

### 单项禁用

通过在数据项中添加 `disabled: true` 禁用单个项目的拖拽：

```vue
<script setup>
    const list = ref([
        { id: 1, name: '可拖拽' },
        { id: 2, name: '禁止拖拽', disabled: true },
        { id: 3, name: '可拖拽' },
    ]);
</script>
```

### 自定义项目样式

通过在数据项中添加 `style` 对象自定义样式：

```vue
<script setup>
    const list = ref([
        { id: 1, name: '红色背景', style: { background: '#ffebee' } },
        { id: 2, name: '蓝色背景', style: { background: '#e3f2fd' } },
    ]);
</script>
```

### 监听事件

```vue
<template>
    <Draggable
        v-model="list"
        @change="handleChange"
        @add="handleAdd"
        @remove="handleRemove"
        @start="handleStart"
        @end="handleEnd"
    >
        <template #default="{ item }">
            <div>{{ item.name }}</div>
        </template>
    </Draggable>
</template>

<script setup>
    import { ref } from 'vue'
    import Draggable from './Draggable.vue'

    const list = ref([...])

    const handleChange = ({ oldIndex, newIndex, item }) => {
      console.log(`项目从 ${oldIndex} 移动到 ${newIndex}`, item)
    }

    const handleAdd = ({ item, newIndex }) => {
      console.log('添加项目:', item, '位置:', newIndex)
    }

    const handleRemove = ({ item, oldIndex }) => {
      console.log('移除项目:', item, '原位置:', oldIndex)
    }

    const handleStart = ({ item, index }) => {
      console.log('开始拖拽:', item, '索引:', index)
    }

    const handleEnd = ({ item, oldIndex, newIndex }) => {
      console.log('拖拽结束:', item, `从 ${oldIndex} 到 ${newIndex}`)
    }
</script>
```

### 自定义 Key 函数

当数据项没有固定的 `id` 字段时：

```vue
<template>
    <Draggable v-model="list" :item-key="getItemKey">
        <template #default="{ item }">
            <div>{{ item.title }}</div>
        </template>
    </Draggable>
</template>

<script setup>
    import { ref } from 'vue';
    import Draggable from './Draggable.vue';

    const list = ref([
        { uuid: 'a1b2c3', title: '文章1' },
        { uuid: 'd4e5f6', title: '文章2' },
    ]);

    const getItemKey = (item) => item.uuid;
</script>
```

## 🎯 样式类名

组件在不同状态下会添加以下类名，可用于自定义样式：

-   `.is-dragging` - 正在拖拽的项目
-   `.is-drop-target` - 可放置的目标位置
-   `.is-disabled` - 被禁用的项目
-   `.is-drag-over` - 容器处于拖拽悬停状态

## ⚠️ 注意事项

1. **唯一标识**：确保每个列表项有唯一的 `id` 或通过 `itemKey` 指定唯一标识
2. **组名匹配**：跨容器拖拽时，两个容器的 `group` 属性必须相同
3. **拖拽手柄**：使用 `handle` 时，确保指定的选择器在项目内部存在
4. **禁用状态**：整体 `disabled` 或单项 `disabled` 都会阻止拖拽

## 🔧 故障排除

### 跨容器拖拽不生效

-   检查两个容器的 `group` 属性是否相同
-   确认目标容器没有设置 `disabled`

### 拖拽手柄不工作

-   确认 `handle` 选择器正确（如 `.drag-handle`、`#handle` 等）
-   检查手柄元素是否在拖拽项内部
-   确保手柄元素没有阻止事件传播

### 数据没有更新

-   确保使用了 `v-model` 或监听了 `update:modelValue` 事件
-   检查数据是否为响应式（使用 `ref` 或 `reactive`）

### 动画不流畅

-   减少列表项的复杂度
-   使用 `key` 属性优化渲染
-   检查是否有大量的计算属性或侦听器

## 📝 完整示例

```vue
<template>
    <div class="demo">
        <h2>任务看板</h2>

        <div class="board">
            <div class="column">
                <h3>待办 ({{ todo.length }})</h3>
                <Draggable
                    v-model="todo"
                    group="tasks"
                    handle=".drag-handle"
                    @change="handleChange"
                    @add="handleAdd"
                    @remove="handleRemove"
                >
                    <template #default="{ item }">
                        <div class="task-card" :class="{ 'is-urgent': item.urgent }">
                            <el-icon class="drag-handle"><Rank /></el-icon>
                            <div class="task-content">
                                <h4>{{ item.title }}</h4>
                                <p>{{ item.description }}</p>
                                <div class="task-meta">
                                    <el-tag :type="item.urgent ? 'danger' : 'info'" size="small">
                                        {{ item.urgent ? '紧急' : '普通' }}
                                    </el-tag>
                                </div>
                            </div>
                        </div>
                    </template>
                </Draggable>
            </div>

            <div class="column">
                <h3>进行中 ({{ inProgress.length }})</h3>
                <Draggable v-model="inProgress" group="tasks" handle=".drag-handle">
                    <template #default="{ item }">
                        <div class="task-card">
                            <el-icon class="drag-handle"><Rank /></el-icon>
                            <div class="task-content">
                                <h4>{{ item.title }}</h4>
                                <p>{{ item.description }}</p>
                            </div>
                        </div>
                    </template>
                </Draggable>
            </div>

            <div class="column">
                <h3>已完成 ({{ done.length }})</h3>
                <Draggable v-model="done" group="tasks" handle=".drag-handle">
                    <template #default="{ item }">
                        <div class="task-card completed">
                            <el-icon class="drag-handle"><Rank /></el-icon>
                            <div class="task-content">
                                <h4>{{ item.title }}</h4>
                                <p>{{ item.description }}</p>
                            </div>
                        </div>
                    </template>
                </Draggable>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { Rank } from '@element-plus/icons-vue';
    import Draggable from './Draggable.vue';
    import { ElMessage } from 'element-plus';

    const todo = ref([
        { id: 1, title: '设计数据库', description: '设计用户表和订单表', urgent: true },
        { id: 2, title: '编写API文档', description: '完成接口文档编写', urgent: false },
    ]);

    const inProgress = ref([{ id: 3, title: '开发登录功能', description: '实现用户登录注册', urgent: false }]);

    const done = ref([{ id: 4, title: '项目初始化', description: '搭建项目框架', urgent: false }]);

    const handleChange = ({ oldIndex, newIndex, item }) => {
        console.log('排序变化', { oldIndex, newIndex, item });
    };

    const handleAdd = ({ item, newIndex }) => {
        ElMessage.success(`"${item.title}" 已添加`);
    };

    const handleRemove = ({ item, oldIndex }) => {
        ElMessage.info(`"${item.title}" 已移除`);
    };
</script>

<style scoped>
    .demo {
        padding: 20px;
    }

    .board {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: 20px;
    }

    .column {
        background: #f5f7fa;
        border-radius: 8px;
        padding: 16px;
        min-height: 400px;
    }

    .column h3 {
        margin: 0 0 16px;
        color: #303133;
        font-size: 16px;
    }

    .task-card {
        display: flex;
        gap: 12px;
        background: white;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.2s;
    }

    .task-card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .task-card.is-urgent {
        border-left: 4px solid #f56c6c;
    }

    .task-card.completed {
        opacity: 0.7;
    }

    .task-card.completed h4 {
        text-decoration: line-through;
    }

    .drag-handle {
        flex-shrink: 0;
        font-size: 20px;
        color: #909399;
        cursor: grab;
        transition: color 0.2s;
    }

    .drag-handle:hover {
        color: #667eea;
    }

    .drag-handle:active {
        cursor: grabbing;
    }

    .task-content {
        flex: 1;
    }

    .task-content h4 {
        margin: 0 0 8px;
        font-size: 14px;
        color: #303133;
    }

    .task-content p {
        margin: 0 0 12px;
        font-size: 12px;
        color: #606266;
    }

    .task-meta {
        display: flex;
        gap: 8px;
    }
</style>
```

## 📄 许可

MIT License

---

如有问题或建议，欢迎提 Issue！
