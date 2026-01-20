import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import vueInspector from 'vite-plugin-vue-inspector';
import UnoCSS from 'unocss/vite';
import electron from 'vite-plugin-electron';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(() => {
    return {
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
            },
        },
        plugins: [
            vue(),
            AutoImport({
                // 可以自定义文件生成的位置,默认是根目录下,使用ts的建议放src目录下
                dts: 'src/auto-imports.d.ts',
                imports: ['vue', 'vue-router'],
            }),
            vueInspector({
                // toggleComboKey: 'shift',
                toggleButtonVisibility: 'never',
            }),
            UnoCSS(),
            // Gzip 压缩
            viteCompression({
                algorithm: 'gzip',
                ext: '.gz',
                threshold: 10240, // 大于 10KB 才压缩
                deleteOriginFile: false,
            }),
            // Brotli 压缩（优先级高，压缩率更高，但支持的浏览器不如Gzip多，浏览器会根据是否支持自动选择）
            viteCompression({
                algorithm: 'brotliCompress',
                ext: '.br',
                threshold: 10240,
                deleteOriginFile: false,
            }),
            ...(process.env.ELECTRON_ENABLE === 'true'
                ? [
                      electron([
                          {
                              // 主进程入口
                              entry: 'electron/main.ts',
                          },
                          {
                              // 预加载脚本
                              entry: 'electron/preload.ts',
                              vite: {
                                  build: {
                                      outDir: 'dist-electron',
                                      rollupOptions: {
                                          output: {
                                              format: 'cjs', // 确保输出为CommonJS格式
                                          },
                                      },
                                  },
                              },
                          },
                      ]),
                  ]
                : []),
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    // 修复警告 Deprecation Warning [legacy-js-api]: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
                    api: 'modern',
                },
            },
        },
        // 依赖优化
        optimizeDeps: {
            include: ['vue', 'vue-router', 'pinia', 'element-plus'],
        },
        // 服务器配置
        server: {
            port: 5173,
            cors: true,
            // 反向代理（解决开发环境跨域）
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                },
            },
        },
        // 构建优化
        build: {
            target: 'esnext',
            // 代码分割策略（核心优化）
            rollupOptions: {
                output: {
                    // 手动分包
                    manualChunks: (id) => {
                        // 第三方库单独打包
                        if (id.includes('node_modules')) {
                            // Element Plus 单独一个包
                            if (id.includes('element-plus')) {
                                return 'element-plus';
                            }

                            // ECharts 单独一个包（通常很大）
                            if (id.includes('echarts')) {
                                return 'echarts';
                            }

                            // Three.js 单独一个包
                            if (id.includes('three')) {
                                return 'three';
                            }

                            // GSAP 单独一个包
                            if (id.includes('gsap')) {
                                return 'gsap';
                            }

                            // 其他依赖统一打包
                            return 'vendor';
                        }
                    },
                },
            },

            // 压缩配置
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true, // 生产环境移除 console
                    drop_debugger: true,
                },
            },

            // chunk 大小警告阈值（KB）
            chunkSizeWarningLimit: 500,

            // 启用 CSS 代码分割
            cssCodeSplit: true,
        },
    };
});
