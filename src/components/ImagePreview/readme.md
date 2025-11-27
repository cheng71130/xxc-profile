# ImagePreview 图片预览组件

一个功能强大的 Vue 3 图片预览组件，支持缩放、旋转、拖拽等功能，可与懒加载组件完美配合使用。

## 特性

-   ✨ **完整的图片操作**：缩放、旋转、拖拽
-   🖼️ **多图预览**：支持图片列表切换
-   📱 **移动端友好**：支持触摸手势（捏合缩放、拖拽）
-   ⌨️ **键盘快捷键**：快速操作
-   🎨 **精美动画**：流畅的过渡效果
-   📥 **图片下载**：一键下载当前图片
-   🔍 **缩略图导航**：底部缩略图快速切换

---

## 安装

将 `ImagePreview.vue` 组件文件复制到项目中：

```
src/
  components/
    ImagePreview.vue
    LazyImage.vue
```

---

## 基础用法

### 1. 单张图片预览

```vue
<template>
    <div>
        <button @click="openPreview">查看图片</button>

        <ImagePreview ref="previewRef" :images="['https://example.com/image.jpg']" />
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import ImagePreview from '@/components/ImagePreview.vue';

    const previewRef = ref();

    const openPreview = () => {
        previewRef.value?.open(0);
    };
</script>
```

### 2. 多张图片预览

```vue
<template>
    <div>
        <div class="image-grid">
            <img
                v-for="(image, index) in images"
                :key="index"
                :src="image"
                @click="openPreview(index)"
                style="cursor: pointer;"
            />
        </div>

        <ImagePreview ref="previewRef" :images="images" :loop="true" />
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import ImagePreview from '@/components/ImagePreview.vue';

    const images = ref([
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
    ]);

    const previewRef = ref();

    const openPreview = (index: number) => {
        previewRef.value?.open(index);
    };
</script>
```

### 3. 配合懒加载组件使用

```vue
<template>
    <div>
        <div class="image-gallery">
            <LazyImage
                v-for="(image, index) in images"
                :key="index"
                :src="image"
                :show-skeleton="true"
                :progressive="true"
                :thumbnail-width="100"
                @click="openPreview(index)"
                style="cursor: pointer;"
            />
        </div>

        <ImagePreview ref="previewRef" :images="images" :show-thumbnails="true" :downloadable="true" />
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import LazyImage from '@/components/LazyImage.vue';
    import ImagePreview from '@/components/ImagePreview.vue';

    const images = ref([
        'https://example.com/photo1.jpg',
        'https://example.com/photo2.jpg',
        'https://example.com/photo3.jpg',
    ]);

    const previewRef = ref();

    const openPreview = (index: number) => {
        previewRef.value?.open(index);
    };
</script>

<style scoped>
    .image-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
    }
</style>
```

### 4. 高级用法 - 带缩略图

```vue
<template>
    <div>
        <ImagePreview ref="previewRef" :images="imageList" :show-thumbnails="true" />
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import ImagePreview, { type PreviewImage } from '@/components/ImagePreview.vue';

    const imageList = ref<PreviewImage[]>([
        {
            src: 'https://example.com/large1.jpg',
            thumb: 'https://example.com/thumb1.jpg',
            alt: '图片描述 1',
        },
        {
            src: 'https://example.com/large2.jpg',
            thumb: 'https://example.com/thumb2.jpg',
            alt: '图片描述 2',
        },
    ]);

    const previewRef = ref();
</script>
```

---

## Props 属性

| 参数             | 类型                           | 默认值   | 说明                                |
| ---------------- | ------------------------------ | -------- | ----------------------------------- |
| `images`         | `string[]` \| `PreviewImage[]` | **必填** | 图片列表，可以是 URL 数组或对象数组 |
| `initialIndex`   | `number`                       | `0`      | 初始显示的图片索引                  |
| `loop`           | `boolean`                      | `true`   | 是否循环切换图片                    |
| `maskClosable`   | `boolean`                      | `true`   | 点击遮罩层是否关闭预览              |
| `downloadable`   | `boolean`                      | `true`   | 是否显示下载按钮                    |
| `showThumbnails` | `boolean`                      | `true`   | 是否显示底部缩略图导航              |
| `zoomRate`       | `number`                       | `0.15`   | 每次缩放的比率                      |
| `minZoom`        | `number`                       | `0.1`    | 最小缩放比例                        |
| `maxZoom`        | `number`                       | `5`      | 最大缩放比例                        |

### PreviewImage 接口

```typescript
interface PreviewImage {
    src: string; // 大图 URL（必填）
    alt?: string; // 图片描述
    thumb?: string; // 缩略图 URL（可选，不传则使用 src）
}
```

---

## Events 事件

| 事件名   | 参数                              | 说明                                 |
| -------- | --------------------------------- | ------------------------------------ |
| `close`  | `()`                              | 预览关闭时触发                       |
| `change` | `(index: number)`                 | 切换图片时触发，返回当前索引         |
| `switch` | `(prev: number, current: number)` | 切换图片时触发，返回上一张和当前索引 |

### 事件使用示例

```vue
<template>
    <ImagePreview
        ref="previewRef"
        :images="images"
        @close="handleClose"
        @change="handleChange"
        @switch="handleSwitch"
    />
</template>

<script setup lang="ts">
    const handleClose = () => {
        console.log('预览已关闭');
    };

    const handleChange = (index: number) => {
        console.log('当前图片索引:', index);
    };

    const handleSwitch = (prev: number, current: number) => {
        console.log(`从第 ${prev + 1} 张切换到第 ${current + 1} 张`);
    };
</script>
```

---

## Methods 方法

通过 `ref` 访问组件实例，可以调用以下方法：

| 方法名        | 参数               | 说明                     |
| ------------- | ------------------ | ------------------------ |
| `open`        | `(index?: number)` | 打开预览，可指定初始索引 |
| `close`       | `()`               | 关闭预览                 |
| `next`        | `()`               | 切换到下一张             |
| `prev`        | `()`               | 切换到上一张             |
| `zoomIn`      | `()`               | 放大                     |
| `zoomOut`     | `()`               | 缩小                     |
| `resetZoom`   | `()`               | 重置缩放（1:1）          |
| `rotateLeft`  | `()`               | 向左旋转 90°             |
| `rotateRight` | `()`               | 向右旋转 90°             |

### 方法使用示例

```vue
<template>
    <div>
        <button @click="previewRef?.open(0)">打开预览</button>
        <button @click="previewRef?.zoomIn()">放大</button>
        <button @click="previewRef?.rotateRight()">旋转</button>

        <ImagePreview ref="previewRef" :images="images" />
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const previewRef = ref();
    const images = ref(['image1.jpg', 'image2.jpg']);
</script>
```

---

## 键盘快捷键

| 按键      | 功能            |
| --------- | --------------- |
| `ESC`     | 关闭预览        |
| `←` / `→` | 上一张 / 下一张 |
| `+` / `=` | 放大            |
| `-` / `_` | 缩小            |
| `0`       | 重置缩放（1:1） |

---

## 交互操作

### 🖱️ 鼠标操作

-   **滚轮**: 上滚放大，下滚缩小
-   **拖拽**: 放大后可拖拽查看图片细节
-   **双击**: 双击放大到 2 倍，再次双击重置

### 📱 触摸操作

-   **捏合**: 双指捏合缩放
-   **拖拽**: 单指拖拽（放大后）
-   **双击**: 双击放大/重置

---

## 自定义样式

组件使用 scoped 样式，如需自定义可通过 CSS 变量或深度选择器：

```vue
<style>
    /* 修改工具栏背景 */
    .image-preview-modal .preview-toolbar {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
    }

    /* 修改按钮颜色 */
    .image-preview-modal .toolbar-btn:hover {
        background: rgba(102, 126, 234, 0.3);
    }

    /* 修改缩略图尺寸 */
    .image-preview-modal .thumbnail-item {
        width: 100px;
        height: 75px;
    }
</style>
```

---

## 完整示例

```vue
<template>
    <div class="page">
        <h1>图片画廊</h1>

        <div class="gallery-grid">
            <div v-for="(image, index) in gallery" :key="index" class="gallery-item" @click="openPreview(index)">
                <LazyImage
                    :src="image.src"
                    :alt="image.alt"
                    :show-skeleton="true"
                    :progressive="true"
                    :thumbnail-width="100"
                />
                <div class="image-info">
                    <span class="image-title">{{ image.alt }}</span>
                </div>
            </div>
        </div>

        <ImagePreview
            ref="previewRef"
            :images="gallery"
            :loop="true"
            :downloadable="true"
            :show-thumbnails="true"
            @close="handleClose"
            @change="handleChange"
        />
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import LazyImage from '@/components/LazyImage.vue';
    import ImagePreview, { type PreviewImage } from '@/components/ImagePreview.vue';

    const gallery = ref<PreviewImage[]>([
        {
            src: 'https://picsum.photos/1920/1080?random=1',
            thumb: 'https://picsum.photos/200/150?random=1',
            alt: '风景图片 1',
        },
        {
            src: 'https://picsum.photos/1920/1080?random=2',
            thumb: 'https://picsum.photos/200/150?random=2',
            alt: '风景图片 2',
        },
        {
            src: 'https://picsum.photos/1920/1080?random=3',
            thumb: 'https://picsum.photos/200/150?random=3',
            alt: '风景图片 3',
        },
    ]);

    const previewRef = ref();

    const openPreview = (index: number) => {
        previewRef.value?.open(index);
    };

    const handleClose = () => {
        console.log('预览关闭');
    };

    const handleChange = (index: number) => {
        console.log('当前查看:', gallery.value[index].alt);
    };
</script>

<style scoped lang="scss">
    .page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    h1 {
        font-size: 32px;
        margin-bottom: 32px;
        text-align: center;
    }

    .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 24px;
    }

    .gallery-item {
        position: relative;
        cursor: pointer;
        border-radius: 12px;
        overflow: hidden;
        transition: transform 0.3s ease;

        &:hover {
            transform: translateY(-4px);

            .image-info {
                opacity: 1;
            }
        }
    }

    .image-info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .image-title {
        color: #fff;
        font-size: 14px;
        font-weight: 500;
    }
</style>
```

---

## 常见问题

### 1. 图片无法下载？

**原因**: 跨域问题，图片服务器不允许跨域访问。

**解决方案**:

-   确保图片服务器配置了正确的 CORS 头
-   或使用代理服务器中转

### 2. 在移动端缩放不流畅？

**解决方案**: 确保在预览容器上添加了以下 CSS：

```css
.image-preview-modal {
    touch-action: none;
    -webkit-user-select: none;
    user-select: none;
}
```

### 3. 如何禁用某些功能？

```vue
<ImagePreview
    :images="images"
    :downloadable="false"        <!-- 禁用下载 -->
    :show-thumbnails="false"     <!-- 禁用缩略图 -->
    :mask-closable="false"       <!-- 禁用点击遮罩关闭 -->
/>
```

### 4. 如何自定义缩放范围？

```vue
<ImagePreview
    :images="images"
    :min-zoom="0.5"              <!-- 最小缩放 50% -->
    :max-zoom="10"               <!-- 最大缩放 1000% -->
    :zoom-rate="0.2"             <!-- 每次缩放 20% -->
/>
```

---

## 浏览器兼容性

-   ✅ Chrome / Edge (最新版)
-   ✅ Firefox (最新版)
-   ✅ Safari 14+
-   ✅ iOS Safari 14+
-   ✅ Android Chrome (最新版)

---

## 更新日志

### v1.0.0 (2024-01-04)

-   ✨ 初始版本发布
-   支持图片预览、缩放、旋转
-   支持触摸手势
-   支持键盘快捷键
-   支持缩略图导航
-   支持图片下载

---

## License

MIT License

---

## 相关链接

-   [Vue 3 官方文档](https://cn.vuejs.org/)
-   [TypeScript 文档](https://www.typescriptlang.org/)

---

**祝你使用愉快！** 🎉

如有问题或建议，欢迎提交 Issue。
