import { RectNode, RectNodeModel, h } from '@logicflow/core';

class ProcessView extends RectNode {
	getLabelShape() {
		const { model } = this.props;
		const { x, y, width, height } = model;
		const style = model.getNodeStyle();
		return h(
			'svg',
			{
				x: x - width / 2 + 15,
				y: y - height / 2 + 5,
				width: 25,
				height: 25,
				viewBox: '0 0 1274 1024',
			},
			[
				h('path', {
					fill: '#ff9500',
					d: 'M170.6496 443.7504v136.4992H307.2V443.7504H170.6496z m-13.6192-68.3008C126.8224 375.4496 102.4 399.9232 102.4 430.08v163.84c0 30.1568 24.4736 54.6304 54.6304 54.6304h163.84c30.1568 0 54.5792-24.4736 54.5792-54.6304V430.08c0-30.208-24.4224-54.6304-54.5792-54.6304h-163.84zM716.8 197.9904v136.4992h136.5504V197.9904H716.8z m-13.6192-68.3008c-30.208 0-54.6304 24.4736-54.6304 54.6304v163.84c0 30.1568 24.4736 54.6304 54.6304 54.6304h163.84C897.1776 402.7904 921.6 378.3168 921.6 348.16V184.32c0-30.208-24.4224-54.6304-54.5792-54.6304h-163.84z',
				}),
				h('path', {
					fill: '#ff9500',
					d: 'M341.3504 512c0-18.8416 15.2576-34.1504 34.1504-34.1504h109.2096a34.1504 34.1504 0 1 1 0 68.3008H375.5008A34.1504 34.1504 0 0 1 341.3504 512zM716.8 689.5104v136.4992h136.5504v-136.4992H716.8z m-13.6192-68.3008c-30.208 0-54.6304 24.4736-54.6304 54.6304v163.84c0 30.208 24.4736 54.6304 54.6304 54.6304h163.84c30.1568 0 54.5792-24.4736 54.5792-54.6304v-163.84c0-30.208-24.4224-54.6304-54.5792-54.6304h-163.84z',
				}),
				h('path', {
					fill: '#ff9500',
					d: 'M539.2896 300.3904a20.48 20.48 0 0 0-20.48 20.48v382.2592c0 11.3152 9.216 20.48 20.48 20.48H675.84a34.1504 34.1504 0 0 1 0 68.3008h-136.5504A88.7296 88.7296 0 0 1 450.56 703.0784V320.8704c0-49.0496 39.7312-88.7808 88.7296-88.7808H675.84a34.1504 34.1504 0 1 1 0 68.3008h-136.5504z',
				}),
			]
		);
	}
	getShape() {
		const { model } = this.props;
		const { x, y, width, height, radius } = model;
		const style = model.getNodeStyle();
		return h('g', {}, [
			h('rect', {
				...style,
				x: x - width / 2,
				y: y - height / 2,
				rx: 4,
				ry: 4,
				width,
				height,
			}),
			this.getLabelShape(),
		]);
	}
}

class ProcessModel extends RectNodeModel {
	setAttributes() {
		this.width = 190;
		this.height = 35;
	}
	getTextStyle() {
		const style = super.getTextStyle();
		style.fontSize = 14;
		const properties = this.properties;
		style.color = '#606266';
		// style.color = properties.disabled ? 'red' : '#606266';
		return style;
	}
	getNodeStyle() {
		const style = super.getNodeStyle();
		const properties = this.properties;
		// 节点四种状态
		style.stroke = '#ff9500';
		if (properties.status == 'running') {
			style.stroke = '#ff9500';
			style.strokeDasharray = '100 5';
			style.strokeDashoffset = 0;
			this.applyDashAnimation(style);
		}
		if (properties.status == 'success') {
			style.stroke = '#53B884';
			style.fill = '#f7ffe6';
			style.strokeDashoffset = 0;
		}
		if (properties.status == 'fail') {
			style.stroke = 'red';
			style.fill = '#ffe7e6';
			style.strokeDashoffset = 0;
		}
		return style;
	}
	getAnchorStyle() {
		const style = super.getAnchorStyle();
		style.stroke = 'rgb(24, 125, 255)';
		style.r = 3;
		style.hover.r = 8;
		style.hover.fill = 'rgb(24, 125, 255)';
		style.hover.stroke = 'rgb(24, 125, 255)';
		return style;
	}
	getAnchorLineStyle() {
		const style = super.getAnchorLineStyle();
		style.stroke = 'rgb(24, 125, 255)';
		return style;
	}
	getOutlineStyle() {
		const style = super.getOutlineStyle();
		style.stroke = 'none';
		style.hover.stroke = 'none';
		return style;
	}
	applyDashAnimation(style) {
		const keyframesStyle = `
			@keyframes dash {
				to {
					stroke-dashoffset: -12000;
				}
			}
		`;

		const dynamicStyle = `
			rect {
				animation: dash 120s linear infinite;
			}
		`;

		// Create a style element
		const styleElement = document.createElement('style');
		styleElement.innerHTML = keyframesStyle + dynamicStyle;
		document.head.appendChild(styleElement);

		// Add animation properties to the style object
		style.animation = 'dash 120s linear infinite';
	}
}

export default {
	type: 'processNode',
	view: ProcessView,
	model: ProcessModel,
};
