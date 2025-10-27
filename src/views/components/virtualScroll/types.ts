/**
 * 虚拟滚动组件类型定义
 */

// 组件Props类型
export interface VirtualScrollProps<T = any> {
    /** 数据源 */
    dataSource: T[];
    /** 数据项唯一标识key，默认 'id' */
    itemKey?: string;
    /** 预估item高度（px），默认 80 */
    estimatedItemHeight?: number;
    /** 缓冲区数量（上下额外渲染的item数），默认 5 */
    bufferSize?: number;
    /** 是否启用动态高度，默认 true */
    dynamicHeight?: boolean;
}

// 滚动事件参数
export interface ScrollEvent {
    /** 当前滚动位置 */
    scrollTop: number;
    /** 是否滚动到底部 */
    isBottom: boolean;
}

// 可视区域变化事件参数
export interface VisibleChangeEvent {
    /** 起始索引 */
    startIndex: number;
    /** 结束索引 */
    endIndex: number;
}

// Item位置信息
export interface ItemPosition {
    /** 索引 */
    index: number;
    /** 高度 */
    height: number;
    /** 顶部位置 */
    top: number;
    /** 底部位置 */
    bottom: number;
}

// 组件暴露的方法
export interface VirtualScrollExpose {
    /** 滚动到指定索引 */
    scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
    /** 滚动到顶部 */
    scrollToTop: (behavior?: ScrollBehavior) => void;
    /** 滚动到底部 */
    scrollToBottom: (behavior?: ScrollBehavior) => void;
    /** 获取当前可视范围 */
    getVisibleRange: () => { start: number; end: number };
}
