import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig(({}) => {
	const alias = {
		'@/': `${resolve(__dirname, 'src')}/`
	}

	return {
		resolve: {
			alias
		},
		plugins: [
			vue(),
			AutoImport({
				// 可以自定义文件生成的位置，默认是根目录下，使用ts的建议放src目录下
				dts: true,
				imports: ['vue', 'vue-router']
			})
		],
	}
})
