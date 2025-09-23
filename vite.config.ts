import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import vueInspector from 'vite-plugin-vue-inspector'
import UnoCSS from 'unocss/vite'
import electron from 'vite-plugin-electron'

export default defineConfig(({}) => {
	const alias = {
		'@/': `${resolve(__dirname, 'src')}/`
	}

	const plugins = [
		vue(),
		AutoImport({
			// 可以自定义文件生成的位置，默认是根目录下，使用ts的建议放src目录下
			dts: true,
			imports: ['vue', 'vue-router']
		}),
		vueInspector({
			toggleComboKey: 'shift',
			toggleButtonVisibility: 'never'
		}),
		UnoCSS()
	]

	if (process.env.ELECTRON_ENABLE === 'true') {
		plugins.push(
			electron([
				{
					// 主进程入口
					entry: 'electron/main.ts'
				},
				{
					// 预加载脚本
					entry: 'electron/preload.ts',
					vite: {
						build: {
							outDir: 'dist-electron',
							rollupOptions: {
								output: {
									format: 'cjs' // 确保输出为CommonJS格式
								}
							}
						}
					}
				}
			])
		)
	}

	return {
		resolve: { alias },
		plugins,
		css: {
			preprocessorOptions: {
				scss: {
					// 修复警告 Deprecation Warning [legacy-js-api]: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
					api: 'modern'
				}
			}
		},
		server: {
			port: 5173,
			cors: true
		}
	}
})
