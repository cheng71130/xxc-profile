# SkeletonWrapper 使用文档

## 📖 简介

SkeletonWrapper 是一个智能骨架屏组件，能够自动识别内容结构生成骨架屏占位符，提供丝滑的加载过渡效果。支持自动模式、手动模式和多种预设样式。

## ✨ 特性

-   🎯 **自动生成**：智能分析 DOM 结构，自动生成匹配的骨架屏
-   🎨 **多种预设**：内置用户卡片、文章、产品、评论、表单等多种预设样式
-   🔄 **零抖动切换**：内容层和骨架屏共享容器，确保宽高完全一致
-   ✨ **闪光动画**：内置优雅的 shimmer 动画效果
-   🎛️ **灵活配置**：支持自动/手动模式切换，可自定义忽略元素
-   📱 **响应式**：自动监听尺寸变化，动态更新骨架屏

## 📦 安装

```bash
# 复制组件文件到项目中
src/components/
├── SkeletonWrapper.vue      # 主组件
└── SkeletonPresets.vue      # 预设样式组件
```

## 🚀 快速开始

### 1. 自动模式（推荐）

组件会自动分析内容结构并生成骨架屏：

```vue
<template>
    <SkeletonWrapper :loading="isLoading">
        <!-- 你的实际内容 -->
        <div class="user-card">
            <img :src="user.avatar" />
            <h3>{{ user.name }}</h3>
            <p>{{ user.bio }}</p>
        </div>
    </SkeletonWrapper>
</template>

<script setup>
    import { ref } from 'vue';
    import SkeletonWrapper from '@/components/SkeletonWrapper.vue';

    const isLoading = ref(true);

    // 模拟数据加载
    setTimeout(() => {
        isLoading.value = false;
    }, 2000);
</script>
```

### 2. 手动模式（精确控制）

使用预设样式或自定义骨架屏：

```vue
<template>
    <SkeletonWrapper :loading="isLoading" :auto="false">
        <!-- 骨架屏插槽 -->
        <template #skeleton>
            <SkeletonPresets type="profile" />
        </template>

        <!-- 实际内容 -->
        <UserProfile :data="userData" />
    </SkeletonWrapper>
</template>

<script setup>
    import SkeletonWrapper from '@/components/SkeletonWrapper.vue';
    import SkeletonPresets from '@/components/SkeletonPresets.vue';
</script>
```

### 3. 自定义骨架屏

```vue
<template>
    <SkeletonWrapper :loading="isLoading" :auto="false">
        <template #skeleton>
            <div class="custom-skeleton">
                <div class="skeleton-avatar"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
            </div>
        </template>

        <YourContent />
    </SkeletonWrapper>
</template>

<style scoped>
    .skeleton-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06);
    }

    .skeleton-line {
        height: 16px;
        background: rgba(255, 255, 255, 0.06);
        border-radius: 6px;
        margin: 12px 0;
    }

    .skeleton-line.short {
        width: 60%;
    }
</style>
```

## 📋 API 文档

### SkeletonWrapper Props

| 属性              | 类型       | 默认值                                            | 说明                     |
| ----------------- | ---------- | ------------------------------------------------- | ------------------------ |
| `loading`         | `boolean`  | `true`                                            | 是否显示骨架屏           |
| `auto`            | `boolean`  | `true`                                            | 是否自动生成骨架屏       |
| `showShimmer`     | `boolean`  | `true`                                            | 是否显示闪光动画         |
| `throttle`        | `number`   | `100`                                             | 骨架屏生成节流时间（ms） |
| `ignoreSelectors` | `string[]` | `['.skeleton-ignore', 'script', 'style', 'link']` | 忽略的元素选择器         |
| `imageMinSize`    | `number`   | `20`                                              | 图片最小尺寸（px）       |
| `textMinHeight`   | `number`   | `10`                                              | 文本最小高度（px）       |

### SkeletonWrapper Slots

| 插槽名     | 说明                                     |
| ---------- | ---------------------------------------- |
| `default`  | 实际内容                                 |
| `skeleton` | 自定义骨架屏（仅在 `auto=false` 时生效） |

### SkeletonWrapper Methods

通过 `ref` 调用组件方法：

```vue
<script setup>
    const skeletonRef = ref();

    // 手动重新生成骨架屏
    const regenerate = () => {
        skeletonRef.value?.regenerate();
    };
</script>

<template>
    <SkeletonWrapper ref="skeletonRef" :loading="isLoading">
        <YourContent />
    </SkeletonWrapper>
</template>
```

### SkeletonPresets Props

| 属性      | 类型     | 默认值   | 可选值                                                                     | 说明          |
| --------- | -------- | -------- | -------------------------------------------------------------------------- | ------------- |
| `type`    | `string` | `'card'` | `'card'` \| `'list'` \| `'article'` \| `'profile'` \| `'grid'` \| `'form'` | 预设类型      |
| `rows`    | `number` | `3`      | -                                                                          | 列表/网格行数 |
| `columns` | `number` | `3`      | -                                                                          | 网格列数      |

## 🎨 预设样式

### 1. 用户卡片 (`profile`)

```vue
<SkeletonPresets type="profile" />
```

**适用场景**：用户信息卡片、个人资料页

**包含元素**：

-   圆形头像
-   用户名、职位
-   个人简介
-   统计数据（关注者/关注/帖子）
-   操作按钮

### 2. 文章卡片 (`article`)

```vue
<SkeletonPresets type="article" />
```

**适用场景**：博客文章、新闻卡片、内容列表

**包含元素**：

-   封面图
-   标签徽章
-   作者信息
-   标题和摘要
-   标签和操作按钮

### 3. 产品卡片 (`card`)

```vue
<SkeletonPresets type="card" />
```

**适用场景**：电商商品、产品展示

**包含元素**：

-   产品图片
-   标签徽章
-   产品标题
-   评分星级
-   产品描述
-   价格和购买按钮

### 4. 评论列表 (`list`)

```vue
<SkeletonPresets type="list" :rows="5" />
```

**适用场景**：评论区、消息列表、动态流

**包含元素**：

-   用户头像
-   用户名和时间
-   评论内容
-   操作按钮（点赞/回复）

### 5. 图片网格 (`grid`)

```vue
<SkeletonPresets type="grid" :rows="2" :columns="3" />
```

**适用场景**：相册、图片画廊、作品集

**包含元素**：

-   网格布局的图片占位符
-   图片标题和分类

### 6. 表单 (`form`)

```vue
<SkeletonPresets type="form" />
```

**适用场景**：联系表单、注册表单、设置页面

**包含元素**：

-   表单标签
-   输入框占位符
-   文本域占位符
-   提交按钮

## 🎯 使用场景

### 场景 1：数据加载

```vue
<script setup>
    import { ref, onMounted } from 'vue';

    const isLoading = ref(true);
    const userData = ref(null);

    onMounted(async () => {
        try {
            const response = await fetch('/api/user');
            userData.value = await response.json();
        } finally {
            isLoading.value = false;
        }
    });
</script>

<template>
    <SkeletonWrapper :loading="isLoading">
        <UserCard :data="userData" />
    </SkeletonWrapper>
</template>
```

### 场景 2：路由切换

```vue
<script setup>
    import { ref, watch } from 'vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const isLoading = ref(false);

    watch(
        () => route.params.id,
        async (newId) => {
            isLoading.value = true;
            try {
                await loadData(newId);
            } finally {
                isLoading.value = false;
            }
        }
    );
</script>

<template>
    <SkeletonWrapper :loading="isLoading">
        <ArticleDetail />
    </SkeletonWrapper>
</template>
```

### 场景 3：分页加载

```vue
<script setup>
    const isLoading = ref(false);
    const products = ref([]);
    const page = ref(1);

    const loadMore = async () => {
        isLoading.value = true;
        try {
            const newProducts = await fetchProducts(page.value);
            products.value.push(...newProducts);
            page.value++;
        } finally {
            isLoading.value = false;
        }
    };
</script>

<template>
    <div class="product-list">
        <ProductCard v-for="product in products" :key="product.id" :data="product" />

        <SkeletonWrapper :loading="isLoading" :auto="false">
            <template #skeleton>
                <SkeletonPresets type="card" />
            </template>
        </SkeletonWrapper>
    </div>
</template>
```

### 场景 4：条件加载

```vue
<script setup>
    const searchQuery = ref('');
    const isSearching = ref(false);
    const results = ref([]);

    const search = async () => {
        if (!searchQuery.value) return;

        isSearching.value = true;
        try {
            results.value = await searchAPI(searchQuery.value);
        } finally {
            isSearching.value = false;
        }
    };
</script>

<template>
    <div>
        <input v-model="searchQuery" @input="search" />

        <SkeletonWrapper :loading="isSearching" :auto="false">
            <template #skeleton>
                <SkeletonPresets type="list" :rows="5" />
            </template>

            <SearchResults :data="results" />
        </SkeletonWrapper>
    </div>
</template>
```

## ⚙️ 高级配置

### 忽略特定元素

```vue
<SkeletonWrapper :loading="isLoading" :ignore-selectors="['.no-skeleton', '.ad-banner', 'iframe']">
    <div>
        <h1>标题</h1>
        <div class="no-skeleton">这部分不会生成骨架屏</div>
        <p>正常内容</p>
    </div>
</SkeletonWrapper>
```

### 调整动画速度

修改 `SkeletonWrapper.vue` 中的 CSS：

```scss
.skeleton-layer,
.content-layer {
    // 默认：0.4s
    transition: opacity 0.4s ease;

    // 慢速：0.8s
    transition: opacity 0.8s ease;

    // 自定义缓动
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 禁用闪光动画

```vue
<SkeletonWrapper :loading="isLoading" :show-shimmer="false">
    <YourContent />
</SkeletonWrapper>
```

### 自定义骨架屏样式

```vue
<style scoped>
    /* 全局调整骨架屏颜色 */
    :deep(.skeleton-element) {
        background: rgba(255, 255, 255, 0.1) !important;
    }

    /* 调整闪光效果 */
    :deep(.skeleton-element::after) {
        background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
    }
</style>
```

## 🎨 主题定制

### 浅色主题

```scss
// 修改 SkeletonPresets.vue
.skeleton-element {
    background: rgba(0, 0, 0, 0.06) !important;

    &::after {
        background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.08) 50%, transparent 100%);
    }
}
```

### 彩色主题

```scss
.skeleton-element {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.08) 100%) !important;
}
```

## 📊 性能优化

### 1. 节流控制

```vue
<SkeletonWrapper
    :loading="isLoading"
    :throttle="200"  // 增加节流时间，减少重新生成频率
>
    <YourContent />
</SkeletonWrapper>
```

### 2. 禁用自动响应

```vue
<script setup>
const skeletonRef = ref();

// 只在需要时手动更新
const updateSkeleton = () => {
    skeletonRef.value?.regenerate();
};
</script>

<template>
    <SkeletonWrapper
        ref="skeletonRef"
        :loading="isLoading"
        :throttle="Infinity"  // 禁用自动更新
    >
        <YourContent />
    </SkeletonWrapper>
</template>
```

### 3. 使用预设样式

对于已知结构的内容，使用预设样式比自动生成性能更好：

```vue
<SkeletonWrapper :loading="isLoading" :auto="false">
    <template #skeleton>
        <SkeletonPresets type="card" />
    </template>
    <ProductCard />
</SkeletonWrapper>
```

## 🐛 常见问题

### Q1: 骨架屏和内容高度不一致导致抖动？

**A**: 确保骨架屏的 DOM 结构和样式与实际内容完全一致：

```vue
<!-- ❌ 错误：结构不一致 -->
<template #skeleton>
    <div class="skeleton-box"></div>
</template>
<div class="content-box">
    <h1>Title</h1>
    <p>Content</p>
</div>

<!-- ✅ 正确：结构一致 -->
<template #skeleton>
    <div class="content-box">
        <h1 class="skeleton-element">Title</h1>
        <p class="skeleton-element">Content</p>
    </div>
</template>
<div class="content-box">
    <h1>Title</h1>
    <p>Content</p>
</div>
```

### Q2: 自动模式生成的骨架屏不理想？

**A**: 可以通过以下方式优化：

1. 使用 `ignoreSelectors` 忽略不需要的元素
2. 调整 `imageMinSize` 和 `textMinHeight` 参数
3. 切换到手动模式使用预设或自定义骨架屏

### Q3: 如何处理动态内容？

**A**: 使用 `watch` 监听数据变化：

```vue
<script setup>
    import { watch } from 'vue';

    const skeletonRef = ref();

    watch(
        () => props.data,
        () => {
            // 数据变化时重新生成骨架屏
            nextTick(() => {
                skeletonRef.value?.regenerate();
            });
        },
        { deep: true }
    );
</script>
```

### Q4: 骨架屏闪烁问题？

**A**: 确保 `loading` 状态稳定，避免频繁切换：

```vue
<script setup>
    // ❌ 错误：频繁切换
    watch(data, () => {
        isLoading.value = !isLoading.value;
    });

    // ✅ 正确：使用防抖
    import { useDebounceFn } from '@vueuse/core';

    const toggleLoading = useDebounceFn(() => {
        isLoading.value = !isLoading.value;
    }, 300);
</script>
```

## 📝 最佳实践

### 1. 选择合适的模式

-   **自动模式**：适用于结构简单、内容动态的场景
-   **手动模式**：适用于结构复杂、样式固定的场景

### 2. 保持结构一致性

骨架屏应该完全模拟真实内容的布局结构，包括：

-   相同的 HTML 标签
-   相同的 CSS 类名
-   相同的 padding/margin/border
-   相同的嵌套层级

### 3. 合理使用预设

项目中有多个相似组件时，优先使用预设样式，提高开发效率和用户体验一致性。

### 4. 性能考虑

-   列表渲染时使用预设而非自动模式
-   避免在骨架屏中使用复杂的动画
-   大型应用中考虑骨架屏的复用

### 5. 用户体验

-   加载时间 < 300ms：考虑不显示骨架屏
-   加载时间 300ms - 3s：显示骨架屏
-   加载时间 > 3s：考虑显示进度指示

```vue
<script setup>
    const showSkeleton = computed(() => {
        return isLoading.value && loadingDuration.value > 300;
    });
</script>

<template>
    <SkeletonWrapper :loading="showSkeleton">
        <YourContent />
    </SkeletonWrapper>
</template>
```

## 🔗 相关资源

-   [Vue 3 官方文档](https://vuejs.org/)
-   [骨架屏设计指南](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a)
-   [Web 性能优化](https://web.dev/performance/)

## 📄 License

MIT License

---

**作者**: Your Name  
**版本**: 1.0.0  
**更新时间**: 2024-01-XX
