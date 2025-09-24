module.exports = {
	// 一行最多 120 字符（保持合理长度，便于阅读）
	printWidth: 120,
	// 使用 4 个空格缩进（符合规范要求：代码每行缩进统一为4空格）
	tabWidth: 4,
	// 使用空格缩进，不使用tab符（符合规范要求）
	useTabs: false,
	// 行尾需要分号（保持代码规范性）
	semi: true,
	// 使用单引号（符合JS规范要求：统一使用反引号或单引号，不使用双引号）
	singleQuote: true,
	// 对象的 key 仅在必要时用引号
	quoteProps: 'as-needed',
	// jsx 使用单引号（与JS保持一致）
	jsxSingleQuote: true,
	// 末尾需要逗号（便于版本控制和扩展）
	trailingComma: 'es5',
	// 大括号内的首尾需要空格
	bracketSpacing: true,
	// jsx 标签的反尖括号需要换行（提高可读性）
	bracketSameLine: false,
	// 箭头函数，只有一个参数的时候，也需要括号（符合规范建议）
	arrowParens: 'always',
	// 根据显示样式决定 html 要不要折行
	htmlWhitespaceSensitivity: 'css',
	// 换行符使用 lf（Linux/Mac 标准）
	endOfLine: 'lf',
	// 缩进Vue文件中的script和style标签（保持一致性）
	vueIndentScriptAndStyle: true,
	// 强制在语句末尾添加分号
	requirePragma: false,
	// 不在文件顶部插入 @format
	insertPragma: false
}
