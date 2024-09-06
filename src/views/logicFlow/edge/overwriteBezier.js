import { BezierEdge, BezierEdgeModel, h } from '@logicflow/core';

class OverwriteBezierModel extends BezierEdgeModel {
	initEdgeData(data) {
		super.initEdgeData(data);
		this.customTextPosition = true;
	}
	setAttributes() {
		// this.isAnimation = true;
	}
	getTextStyle() {
		const style = super.getTextStyle();
		const properties = this.properties;
		if (properties.status == '失败') {
			style.color = 'red';
		}
		return style;
	}
	getEdgeStyle() {
		const style = super.getEdgeStyle();
		const properties = this.properties;
		if (properties.status == '失败') {
			style.strokeDasharray = '10 10';
		}
		return style;
	}
	getEdgeAnimationStyle() {
		const style = super.getEdgeAnimationStyle();
		style.stroke = '#426EC4';
		style.strokeDasharray = '10 10';
		style.strokeDashoffset = '100%';
		style.animationDuration = '25s';
		return style;
	}
}

class OverwriteBezier extends BezierEdge {
	// getAdjustPointShape(x, y, model) {
	// 	return h('g', {}, [
	// 		h('image', {
	// 			x: x - 9,
	// 			y: y - 9,
	// 			width: 18,
	// 			height: 18,
	// 			cursor: 'move',
	// 			href: 'data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMnB4IiBoZWlnaHQ9IjIycHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iMTEiIGN5PSIxMSIgcj0iNyIgc3Ryb2tlPSIjZmZmIiBmaWxsPSIjMjliNmYyIi8+PGNpcmNsZSBjeD0iMTEiIGN5PSIxMSIgcj0iMyIgc3Ryb2tlPSIjZmZmIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjwvc3ZnPg==',
	// 		}),
	// 	]);
	// }
	//   getStartArrow() {
	//     const { model } = this.props;
	//     const { stroke, strokeWidth } = model.getArrowStyle();
	//     return h("path", {
	//       stroke,
	//       strokeWidth,
	//       fill: "#FFF",
	//       d: "M 20 0 10 -5 0 0 10 5 z"
	//     });
	//   }
	//   getEndArrow() {
	//     const { stroke } = this.props.model.getArrowStyle();
	//     return h("path", {
	//       stroke,
	//       fill: "#FFF",
	//       d: "M 0 0 -10 -5 -10 5 z"
	//     });
	//   }
}

export default {
	type: 'overwriteBezier',
	model: OverwriteBezierModel,
	view: OverwriteBezier,
};
