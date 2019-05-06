// eslint-disable-next-line no-unused-vars
import Point from '../common/Point';
// eslint-disable-next-line no-unused-vars
import DzCanvas from '../helpers/DzCanvas';
import RenderParam from '../common/RenderParam';
import LabelView from './LabelView';

class PreviewParam extends RenderParam {
	public anchorRadius: number;

	private anchorColor: string;
	private lineWidth: number;

	constructor(label: LabelView) {
		super(label);
		//
		this.anchorColor = '#F28787';
		this.anchorRadius = 5;
		this.lineWidth = 1;
	}

	/**
	 * 在给定的坐标点上绘制锚点视图；
	 * @param {DzCanvas} context 画布上下文；
	 * @param {Point} point 目标坐标点；
	 */
	public drawAnchor(context: DzCanvas, point: Point) {
		if (point instanceof Point) {
			context.drawRect(point.x - this.anchorRadius, point.y - this.anchorRadius, this.anchorRadius * 2, this.anchorRadius * 2, this.lineWidth, this.anchorColor);
		}
	}
}

export default PreviewParam;
