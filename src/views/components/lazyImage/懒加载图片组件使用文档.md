
# LazyImage 组件使用文档

一个功能完整、性能优秀的 Vue 3 图片懒加载组件，支持骨架屏、渐进式加载、错误重试等特性。

## ✨ 功能特性

- 🚀 **懒加载** - 基于 IntersectionObserver 的高性能懒加载
- 💀 **骨架屏** - 优雅的加载占位效果
- 🎨 **渐进式加载** - 先显示模糊缩略图，后加载高清图
- 🔄 **自动重试** - 支持加载失败后手动/自动重试
- ⏱️ **超时控制** - 可配置加载超时时间
- 🖼️ **WebP 降级** - 自动检测 WebP 支持并降级到 JPG
- 🎭 **自定义插槽** - 支持自定义占位符、错误提示、遮罩层等
- 📱 **响应式** - 完全响应式设计，支持移动端
- 🎯 **TypeScript** - 完整的 TypeScript 类型支持

---

## 📦 安装引入

```vue
<script setup lang="ts">
import LazyImage from '@/components/LazyImage.vue';
</script>
```

---

## 📋 Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | `string` | - | **必填**，图片地址 |
| `fallbackSrc` | `string` | - | 备用图片地址，主图加载失败时显示 |
| `alt` | `string` | `''` | 图片描述 |
| `width` | `string \| number` | - | 容器宽度 |
| `height` | `string \| number` | - | 容器高度 |
| `aspectRatio` | `string \| number` | - | 宽高比（如 `16/9` 或 `'1.5'`） |
| `fit` | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` | 图片填充模式 |
| `showSkeleton` | `boolean` | `true` | 是否显示骨架屏 |
| `showMask` | `boolean` | `false` | 鼠标悬停时是否显示遮罩层 |
| `lazy` | `boolean` | `true` | 是否启用懒加载 |
| `threshold` | `number` | `100` | 懒加载触发距离（像素） |
| `showRetry` | `boolean` | `true` | 加载失败时是否显示重试按钮 |
| `webpFallback` | `boolean` | `true` | 是否启用 WebP 降级 |
| `errorMessage` | `string` | `'图片加载失败'` | 错误提示文本 |
| `timeout` | `number` | `30000` | 加载超时时间（毫秒），`0` 表示不限制 |
| `progressive` | `boolean` | `false` | 是否启用渐进式加载 |
| `thumbnailWidth` | `number` | `100` | 缩略图宽度（渐进式加载时使用） |
| `imageWidth` | `number` | - | 主图片宽度（用于 CDN 参数拼接） |

---

## 🎪 事件

### `@load`
图片加载成功时触发

```vue
<LazyImage 
    src="xxx.jpg" 
    @load="handleLoad" 
/>
```

**回调参数：**
```typescript
(e: Event) => void
```

### `@error`
图片加载失败或超时时触发

```vue
<LazyImage 
    src="xxx.jpg" 
    @error="handleError" 
/>
```

**回调参数：**
```typescript
interface ImageError extends Error {
    type: 'timeout' | 'error';  // 错误类型
    src: string;                 // 失败的图片地址
    event: Event;                // 原始事件对象
}
```

**示例：**
```typescript
const handleError = (error: ImageError) => {
    if (error.type === 'timeout') {
        console.log('加载超时:', error.src);
    } else {
        console.log('加载失败:', error.src);
    }
};
```

---

## 🎨 插槽

### `placeholder`
自定义加载占位符（当 `showSkeleton=false` 时显示）

```vue
<LazyImage src="xxx.jpg" :show-skeleton="false">
    <template #placeholder>
        <div class="custom-loading">加载中...</div>
    </template>
</LazyImage>
```

### `error`
自定义错误提示

```vue
<LazyImage src="xxx.jpg">
    <template #error="{ retry }">
        <div class="custom-error">
            <p>图片加载失败</p>
            <button @click="retry">点击重试</button>
        </div>
    </template>
</LazyImage>
```

**插槽 Props：**
- `retry: () => void` - 重试函数

### `mask`
自定义遮罩层内容（当 `showMask=true` 时在鼠标悬停显示）

```vue
<LazyImage src="xxx.jpg" :show-mask="true">
    <template #mask>
        <div class="custom-mask">
            <button>预览</button>
            <button>下载</button>
        </div>
    </template>
</LazyImage>
```

### `badge`
图片右上角的徽章标签

```vue
<LazyImage src="xxx.jpg">
    <template #badge>
        <span class="badge">HOT</span>
    </template>
</LazyImage>
```

---

## 🔧 方法

通过 `ref` 调用组件方法：

```vue
<script setup>
import { ref } from 'vue';

const imageRef = ref();

// 手动重试加载
const handleRetry = () => {
    imageRef.value?.retry();
};
</script>

<template>
    <LazyImage ref="imageRef" src="xxx.jpg" />
    <button @click="handleRetry">重新加载</button>
</template>
```

### `retry()`
重新加载图片

---

## 📖 使用示例

### 基础用法

```vue
<LazyImage 
    src="https://example.com/image.jpg" 
    alt="示例图片"
/>
```

### 设置宽高比

```vue
<!-- 16:9 宽高比 -->
<LazyImage 
    src="https://example.com/image.jpg" 
    :aspect-ratio="16/9"
/>

<!-- 固定高度 -->
<LazyImage 
    src="https://example.com/image.jpg" 
    height="400px"
/>
```

### 渐进式加载

```vue
<LazyImage 
    src="https://cdn.example.com/image.jpg" 
    :progressive="true"
    :thumbnail-width="100"
/>
```

### 备用图片

```vue
<LazyImage 
    src="https://example.com/image.jpg" 
    fallback-src="/images/fallback.jpg"
/>
```

### 监听错误

```vue
<script setup lang="ts">
const handleImageError = (error: {
    type: 'timeout' | 'error';
    src: string;
    event: Event;
}) => {
    if (error.type === 'timeout') {
        console.warn('图片加载超时:', error.src);
        // 上报监控数据
    } else {
        console.error('图片加载失败:', error.src);
        // 上报错误日志
    }
};
</script>

<template>
    <LazyImage 
        src="https://example.com/image.jpg"
        :timeout="10000"
        @error="handleImageError"
    />
</template>
```

### 自定义占位符

```vue
<LazyImage 
    src="https://example.com/image.jpg"
    :show-skeleton="false"
>
    <template #placeholder>
        <div class="my-placeholder">
            <svg><!-- 自定义图标 --></svg>
            <p>图片加载中...</p>
        </div>
    </template>
</LazyImage>
```

### 自定义错误提示

```vue
<LazyImage src="https://example.com/image.jpg">
    <template #error="{ retry }">
        <div class="my-error">
            <img src="/icons/error.svg" alt="error" />
            <p>图片加载失败，请重试</p>
            <button @click="retry">重新加载</button>
        </div>
    </template>
</LazyImage>
```

### 悬停遮罩层

```vue
<LazyImage 
    src="https://example.com/product.jpg"
    :show-mask="true"
>
    <template #mask>
        <div class="actions">
            <button @click="preview">👁️ 预览</button>
            <button @click="download">⬇️ 下载</button>
        </div>
    </template>
</LazyImage>
```

### 图片徽章

```vue
<LazyImage src="https://example.com/product.jpg">
    <template #badge>
        <span class="discount-badge">-50%</span>
    </template>
</LazyImage>
```

### 禁用懒加载

```vue
<!-- 首屏重要图片可以禁用懒加载 -->
<LazyImage 
    src="https://example.com/hero.jpg"
    :lazy="false"
/>
```

### 图片列表

```vue
<script setup lang="ts">
const images = ref([
    'https://example.com/1.jpg',
    'https://example.com/2.jpg',
    'https://example.com/3.jpg',
]);
</script>

<template>
    <div class="image-grid">
        <LazyImage
            v-for="(img, index) in images"
            :key="index"
            :src="img"
            :aspect-ratio="1"
            fit="cover"
        />
    </div>
</template>

<style scoped>
.image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
}
</style>
```

### 手动重试

```vue
<script setup>
import { ref } from 'vue';

const imageRef = ref();
const errorCount = ref(0);

const handleError = () => {
    errorCount.value++;
    
    // 错误超过 3 次后，5 秒后自动重试
    if (errorCount.value >= 3) {
        setTimeout(() => {
            imageRef.value?.retry();
        }, 5000);
    }
};
</script>

<template>
    <LazyImage
        ref="imageRef"
        src="https://example.com/image.jpg"
        @error="handleError"
    />
</template>
```

---

## ⚙️ 高级配置

### CDN 图片宽度优化

如果你的 CDN 支持通过 URL 参数控制图片尺寸：

```vue
<LazyImage 
    src="https://cdn.example.com/image.jpg"
    :image-width="800"
/>
<!-- 实际请求: https://cdn.example.com/image.jpg?w=800 -->
```

### 响应式图片

```vue
<script setup>
import { computed } from 'vue';
import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize();

const imageWidth = computed(() => {
    if (width.value < 768) return 400;
    if (width.value < 1200) return 800;
    return 1200;
});
</script>

<template>
    <LazyImage 
        src="https://cdn.example.com/image.jpg"
        :image-width="imageWidth"
    />
</template>
```

---

## 📱 样式定制

组件提供了 CSS 类名，方便自定义样式：

```scss
// 容器状态类
.lazy-image-container {
    &.is-loading { /* 加载中 */ }
    &.is-error { /* 加载失败 */ }
}

// 覆盖默认样式
.lazy-image-container {
    border-radius: 8px;  // 自定义圆角
    
    .error-retry-btn {
        // 自定义重试按钮样式
    }
}
```

---

## ⚠️ 注意事项

1. **图片地址必须完整**
   ```vue
   <!-- ✅ 正确 -->
   <LazyImage src="https://example.com/image.jpg" />
   
   <!-- ❌ 错误（相对路径可能导致问题） -->
   <LazyImage src="../images/photo.jpg" />
   ```

2. **WebP 降级**
   - 组件会自动检测浏览器是否支持 WebP
   - 不支持时会将 `.webp` 替换为 `.jpg`
   - 需要确保服务器提供对应的 JPG 格式

3. **渐进式加载**
   - 需要 CDN 支持通过 URL 参数控制图片尺寸
   - 建议缩略图宽度设置为 `100-200px`

4. **懒加载阈值**
   - `threshold` 越大，图片越早开始加载
   - 建议根据实际网络情况调整（一般 `100-200`）

5. **超时时间**
   - 默认 30 秒，可根据图片大小调整
   - 设置为 `0` 表示不限制（不推荐）

6. **性能优化**
   - 首屏重要图片建议禁用懒加载 `:lazy="false"`
   - 大量图片时注意分页或虚拟滚动

---

## 🎯 TypeScript 类型

```typescript
// Props 类型
interface LazyImageProps {
    src: string;
    fallbackSrc?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
    aspectRatio?: string | number;
    fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    showSkeleton?: boolean;
    showMask?: boolean;
    lazy?: boolean;
    threshold?: number;
    showRetry?: boolean;
    webpFallback?: boolean;
    errorMessage?: string;
    timeout?: number;
    progressive?: boolean;
    thumbnailWidth?: number;
    imageWidth?: number;
}

// 错误对象类型
interface ImageError extends Error {
    type: 'timeout' | 'error';
    src: string;
    event: Event;
}

// 组件实例方法
interface LazyImageInstance {
    retry: () => void;
}
```

---

## 📄 License

MIT

