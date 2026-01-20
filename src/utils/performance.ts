import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals'

/**
 * 2026 Web Vitals 性能监控（纯前端版）
 * 
 * 核心指标：
 * - LCP (Largest Contentful Paint)    最大内容绘制  < 2.5s
 * - INP (Interaction to Next Paint)   交互响应时间  < 200ms
 * - CLS (Cumulative Layout Shift)     累积布局偏移  < 0.1
 * - FCP (First Contentful Paint)      首次内容绘制  < 1.8s
 * - TTFB (Time to First Byte)         首字节时间    < 800ms
 */

// ==================== 类型定义 ====================

export interface PerformanceData {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  url: string
}

// ==================== 本地存储 ====================

const STORAGE_KEY = 'web_vitals_data'
const MAX_RECORDS = 50

/**
 * 保存性能数据
 */
function saveToStorage(data: PerformanceData): void {
  try {
    const records = getFromStorage()
    records.push(data)

    // 只保留最近 50 条
    const trimmed = records.slice(-MAX_RECORDS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  }
  catch (e) {
    console.warn('保存性能数据失败:', e)
  }
}

/**
 * 获取存储的数据
 */
export function getFromStorage(): PerformanceData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }
  catch {
    return []
  }
}

/**
 * 清空数据
 */
export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * 获取统计数据
 */
export function getStats(): Record<string, { avg: number; latest: number }> {
  const records = getFromStorage()
  const grouped = new Map<string, number[]>()

  records.forEach((record) => {
    const values = grouped.get(record.name) || []
    values.push(record.value)
    grouped.set(record.name, values)
  })

  const stats: Record<string, any> = {}

  grouped.forEach((values, name) => {
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const latest = values[values.length - 1]
    stats[name] = { avg, latest }
  })

  return stats
}

// ==================== 性能上报 ====================

/**
 * 上报性能数据
 */
function reportMetric(metric: Metric): void {
  const data: PerformanceData = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    timestamp: Date.now(),
    url: window.location.pathname,
  }

  // 保存到本地
  saveToStorage(data)

  // 开发环境：美化输出
  if (import.meta.env.DEV) {
    logMetric(metric)
  }
}

/**
 * 美化日志输出
 */
function logMetric(metric: Metric): void {
  const emoji = {
    good: '✅',
    'needs-improvement': '⚠️',
    poor: '❌',
  }[metric.rating]

  const color = {
    good: '#10b981',
    'needs-improvement': '#f59e0b',
    poor: '#ef4444',
  }[metric.rating]

  const value = metric.name === 'CLS' 
    ? metric.value.toFixed(4) 
    : `${metric.value.toFixed(0)}ms`

  console.log(
    `%c${emoji} ${metric.name}: ${value}`,
    `color: ${color}; font-weight: bold; font-size: 14px;`,
  )
}

// ==================== 自定义性能标记 ====================

/**
 * 自定义性能标记工具
 */
export class PerformanceMarker {
  private marks = new Map<string, number>()

  /**
   * 开始计时
   */
  start(name: string): void {
    this.marks.set(name, performance.now())
    performance.mark(`${name}:start`)
  }

  /**
   * 结束计时
   */
  end(name: string): number | undefined {
    const startTime = this.marks.get(name)
    if (!startTime) {
      console.warn(`⚠️ 找不到性能标记: ${name}`)
      return undefined
    }

    const duration = performance.now() - startTime
    this.marks.delete(name)

    // 创建测量
    performance.mark(`${name}:end`)
    performance.measure(name, `${name}:start`, `${name}:end`)

    // 输出
    if (import.meta.env.DEV) {
      const emoji = duration > 1000 ? '🐌' : '⚡'
      const color = duration > 1000 ? '#ef4444' : '#10b981'
      console.log(
        `%c${emoji} ${name}: ${duration.toFixed(2)}ms`,
        `color: ${color}; font-weight: bold;`,
      )
    }

    return duration
  }

  /**
   * 清空标记
   */
  clear(): void {
    this.marks.clear()
    performance.clearMarks()
    performance.clearMeasures()
  }
}

export const perfMarker = new PerformanceMarker()

// ==================== 初始化 ====================

/**
 * 初始化性能监控
 */
export function initPerformanceMonitor(): void {
  // 监控核心指标
  onLCP(reportMetric)
  onINP(reportMetric)
  onCLS(reportMetric)
  onFCP(reportMetric)
  onTTFB(reportMetric)

  // 开发环境提示
  if (import.meta.env.DEV) {
    console.log(
      '%c🚀 性能监控已启动 (2026)',
      'background: linear-gradient(90deg, #667eea, #764ba2); color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;',
    )
  }
}

/**
 * 使用示例：
 * 
 * // 1. 在 main.ts 初始化
 * import { initPerformanceMonitor } from '@/utils/performance'
 * initPerformanceMonitor()
 * 
 * // 2. 测量自定义操作
 * import { perfMarker } from '@/utils/performance'
 * 
 * perfMarker.start('render-component')
 * // ... 你的代码
 * perfMarker.end('render-component')
 */
