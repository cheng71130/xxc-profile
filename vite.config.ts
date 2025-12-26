import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import vueInspector from 'vite-plugin-vue-inspector';
import UnoCSS from 'unocss/vite';
import electron from 'vite-plugin-electron';
import viteCompression from 'vite-plugin-compression'

export default defineConfig(({}) => {
    const alias = {
        '@': resolve(__dirname, 'src'),
    };

    const plugins = [
        vue(),
        AutoImport({
            // 可以自定义文件生成的位置，默认是根目录下，使用ts的建议放src目录下
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

        // Brotli 压缩（压缩率更高，但支持的浏览器不如Gzip多，无需担心，浏览器会根据是否支持自动选择）
        viteCompression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 10240,
            deleteOriginFile: false,
        }),
    ];

    if (process.env.ELECTRON_ENABLE === 'true') {
        plugins.push(
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
            ])
        );
    }

    return {
        resolve: { alias },
        plugins,
        css: {
            preprocessorOptions: {
                scss: {
                    // 修复警告 Deprecation Warning [legacy-js-api]: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
                    api: 'modern',
                },
            },
        },
        server: {
            port: 5173,
            cors: true,
        },
        build: {
            // 代码分割配置
            rollupOptions: {
                output: {
                    manualChunks: {
                        'vue-vendor': ['vue', 'vue-router'],
                        'element-plus': ['element-plus'],
                        datav: ['@kjgl77/datav-vue3'],
                        echarts: ['echarts'],
                        three: ['three', 'urdf-loader'],
                        'logic-flow': ['@logicflow/core', '@logicflow/extension'],
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
        },
    };
});
