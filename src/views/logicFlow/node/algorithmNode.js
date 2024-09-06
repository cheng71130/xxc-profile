import { RectNode, RectNodeModel, h } from '@logicflow/core';

class AlgorithmView extends RectNode {
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
					fill: 'blueviolet',
					d: 'M906.26 398 906.26 337.2l-72.1 0.2 0-94.3c0-23.9-12.3-37.3-36.2-37.3l-86.9 0 0-73.8-61.5 0 0 73.8-92.4 0L557.16 132l-61.5 0-0.1 73.8L403.16 205.8l0.2-73.8-61.8 0 0.1 73.8-80.9 0c-29.7 0-41.9 13.4-41.7 44.4l-0.6 87.2-73.4 0L145.06 398l73.4 0 0 84.9-73.4-0.1 0 61.5 73.4 0.2 0 86.2-73.4 0 0 60.4 73.4 0 0 82.4c0 34 13.7 48.1 47.8 48.1l75.4 0-0.1 70.8 61.4 0 0.3-70.8 92.4 0 0 70.8 61.7 0-0.1-70.8 92.4 0-0.2 70.8 61.7 0 0.1-70.8 82.3 0c27.6 0 40.8-24.3 40.8-48.1l0-82.4 72.1 0 0-60.4L834.16 630.7l0-86.2 72.1 0 0-61.4-72.1-0.2L834.16 398 906.26 398zM772.56 760 280.06 760 280.06 267.4l492.6 0L772.66 760zM382.96 682.3l295.8 0c11.8 0 16.1-8.1 16.1-18.8L694.86 367c0-12.6-8.6-19.6-18.8-19.6L379.86 347.4c-15.4 0-19.9 5.7-19.9 21.2l0 290.6C359.96 674.6 367.56 682.3 382.96 682.3z',
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

class AlgorithmModel extends RectNodeModel {
	setAttributes() {
		// this.width = 190;
		this.width = 220;
		this.height = 35;
	}
	getTextStyle() {
		const style = super.getTextStyle();
		style.fontSize = 14;
		const properties = this.properties;
		style.color = properties.disabled ? 'red' : '#606266';
		return style;
	}
	getNodeStyle() {
		const style = super.getNodeStyle();
		const properties = this.properties;
		// 节点四种状态
		style.stroke = 'blueviolet';
		if (properties.status == 'running') {
			style.stroke = 'blueviolet';
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
	type: 'algorithmNode',
	view: AlgorithmView,
	model: AlgorithmModel,
};
