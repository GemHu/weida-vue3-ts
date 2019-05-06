import BaseControl from '../controls/BaseControl';
import Point from '../common/Point';
import Rect from '../common/Rect';

class HitTestResult {
	public point: Point;
	public control: BaseControl;
	public position: any;
	public offset: Point;
	public region: Rect;
	/**
	 * 初始化一个点击测试结果对象；
	 * @param {BaseControl} control 点击测试目标控件；
	 * @param {Point} point 点击测试坐标点；
	 * @param {HitTestPosition} position 点击测试的位置；
	 */
	constructor(control: BaseControl, point: Point, position: HitTestPosition) {
		this.point = point || new Point();
		this.control = control;
		this.position = position || HitTestPosition.None;
		this.offset = control.getOffset(point);
		// 备份控件的原始显示区域
		this.region = control.region;
	}
}

enum HitTestPosition {
	None,
	Left,
	Top,
	Right,
	Bottom,
	LeftTop,
	RightTop,
	RightBottom,
	LeftBottom,
	Center,
	Inside,
	OutSide,
}

export { HitTestResult, HitTestPosition };
