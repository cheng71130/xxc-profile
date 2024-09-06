import { CurvedEdge, CurvedEdgeModel } from '@logicflow/extension';

class myCurvedEdge extends CurvedEdge {}
class myCurvedEdgeModel extends CurvedEdgeModel {
	initEdgeData(data) {
		super.initEdgeData(data);
		this.radius = 10;
	}
	getEdgeStyle() {
		const style = super.getEdgeStyle();
		style.strokeWidth = 2;
		style.stroke = '#808CAD';
		const properties = this.properties;
		if (properties.status == 'fail') {
			style.strokeDasharray = '15 5';
		}
		return style;
	}
	setAttributes() {
		const properties = this.properties;
		if (properties.status == 'running') {
			this.isAnimation = true;
			this.zIndex += 1;
		} else if (properties.status == 'fail') {
			this.isAnimation = false;
			this.text.value = 'x';
		} else {
			this.isAnimation = false;
			this.zIndex = 0;
			this.text.value = '';
		}
	}
	getEdgeAnimationStyle() {
		const style = super.getEdgeAnimationStyle();
		style.strokeDasharray = '15 5';
		style.animationDuration = '25s';
		style.stroke = '#426EC4';
		return style;
	}
}

export default {
	type: 'niceEdge',
	model: myCurvedEdgeModel,
	view: myCurvedEdge,
};
