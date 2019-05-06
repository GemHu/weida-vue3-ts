import Rect from '../common/Rect';
// eslint-disable-next-line no-unused-vars
import DzCanvas from '../helpers/DzCanvas';
import Point from '../common/Point';
import BaseControl from '../controls/BaseControl';

class GroupSelector extends Rect {
	private borderColor: string;
	private fillColor: string;
	private startPoint: Point = new Point();
	private endPoint: Point = new Point();
	private isMouseDown: boolean = false;
	private items: BaseControl[] = [];
	private activeItem: BaseControl | null = null;

	constructor() {
		super();
		this.fillColor = 'rgba(100, 100, 255, 0.3)';
		this.borderColor = '#221BE4';
	}
	/**
	 * 在给定的上下文环境上绘制相关数据；
	 * @param {DzCanvas} context Canvas上下文环境
	 */
	public onRender(context: DzCanvas) {
		if (this.isMouseDown && !this.isEmpty()) {
			context.fillRect(this.x, this.y, this.width, this.height, this.fillColor);
			context.drawDashRect(this.x, this.y, this.width, this.height, 2, [5, 5], this.borderColor);
		}
	}

	/**
	 * 当鼠标按下时的过程处理函数；
	 * @param {Point} startPoint 其实坐标位置；
	 */
	public onMouseDown(startPoint: Point) {
		this.isMouseDown = true;
		if (startPoint instanceof Point) {
			this.startPoint = startPoint;
			this.x = startPoint.x;
			this.y = startPoint.y;
			this.width = 0;
			this.height = 0;
		}
	}

	/**
	 * 获取其实坐标点的一个矫正区域，当鼠标移动的范围在该区域内，可以不做处理，提高想搞用户体验及程序性能；
	 */
	public getStartAdjustRegion() {
		return this.startPoint.getAnchorRegion(5);
	}

	/**
	 * 当鼠标移动时的过程处理函数；
	 * @param {Point} endPoint 当前坐标位置；
	 */
	public onMouseMove(endPoint: Point) {
		if (endPoint instanceof Point) {
			this.endPoint = endPoint;
			this.x = Math.min(this.startPoint.x, endPoint.x);
			this.y = Math.min(this.startPoint.y, endPoint.y);
			this.width = Math.abs(this.startPoint.x - endPoint.x);
			this.height = Math.abs(this.startPoint.y - endPoint.y);
		}
	}

	/**
	 * 当鼠标弹起时的处理函数；
	 * @param {Point} endPoint 当前坐标点；
	 */
	public onMouseUp(endPoint: Point) {
		this.isMouseDown = false;
		this.onMouseMove(endPoint);
	}

	/**
	 * 检测目标控件是否在选择区域内，如果在则将目标控件添加到选择列表中，否则从选择列表中移除；
	 * @param {BaseControl} control 检测目标控件
	 */
	public addOrRemove(control: BaseControl) {
		if (!(control instanceof BaseControl)) {
			return;
		}
		if (this.isEmpty()) {
			return;
		}
		if (this.isIntersect(control.region)) {
			// 相交，如果选择列表中没有该控件则添加控件；
			this.selectItem(control);
		} else {
			// 不想交，如果选择列表中有该控件，则该控件已无效，删除该控件；
			this.deSelectItem(control);
		}
	}

	/**
	 * 将目标对象添加到选择列表中；
	 * @param {BaseControl} control 选择目标对象；
	 */
	public selectItem(control: BaseControl) {
		if (!(control instanceof BaseControl)) {
			return;
		}
		// 判断目标对象是否应存在，如果存在，则不需要重复添加；
		const index = this.items.indexOf(control);
		if (index < 0) {
			control.isSelected = true;
			this.items.push(control);
		}
	}

	/**
	 * 将目标控件从选择列表中删除；
	 * @param {BaseControl} control 去选择目标控件；
	 */
	public deSelectItem(control: BaseControl) {
		if (!(control instanceof BaseControl)) {
			return;
		}
		// 判断目标对象是否存在
		const index = this.items.indexOf(control);
		if (index >= 0) {
			control.isSelected = false;
			this.items.splice(index, 1);
		}
	}

	/**
	 * 删除所有选择元素；
	 */
	public deSelectAll() {
		this.items.forEach((child) => {
			child.isSelected = false;
		});
		this.items.splice(0);
	}
}

export default GroupSelector;
