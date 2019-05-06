import Rect from '../common/Rect';
// eslint-disable-next-line no-unused-vars
import Point from '../common/Point';
import { HitTestResult, HitTestPosition } from '../editor/HitTest';
// eslint-disable-next-line no-unused-vars
import { MouseManager } from '../editor/MouseManager';
import LabelControl from '../editor/LabelView';
import PreviewParam from '../editor/PreviewParam';
import { Base, PrintData } from '../datas/PrintData';
import LabelView from '../editor/LabelView';
import DzCanvas from '../helpers/DzCanvas';
import RenderParam from '../common/RenderParam';

class BaseControl {
	public parent: LabelControl | null = null;
	public isSelected: boolean = false;
	public isActive: boolean = false;
	private printData: Base = new Base();

	constructor(data?: Base, parent?: LabelView) {
		this.parent = parent || null;
		// 加载打印数据；
		this.load(data || null);
	}

	/**
	 * 设置或者加载标签编辑项数据，相关单位为毫米；
	 * @param data 标签编辑项相关数据；
	 */
	public load(data: Base | null) {
		if (data) {
			this.printData = data.clone();
		} else {
			this.printData = new Base();
		}
	}

	/**
	 * 保存打印数据；
	 */
	public save(): Base {
		return this.PrintData.clone();
	}

	public get PrintData(): Base {
		return this.printData;
	}

	/**
	 * 获取标签的缩放比例；
	 */
	public get scale() {
		return this.parent ? this.parent.scale : 1;
	}

	public get left() {
		return this.PrintData.x * this.scale;
	}

	public set left(value) {
		this.PrintData.x = value / this.scale;
	}

	public get top() {
		return this.PrintData.y * this.scale;
	}

	public set top(value) {
		this.PrintData.y = value / this.scale;
	}

	public get width() {
		return this.PrintData.width * this.scale;
	}

	public set width(value) {
		this.PrintData.width = value / this.scale;
	}

	public get height() {
		return this.PrintData.height * this.scale;
	}

	public set height(value) {
		this.PrintData.height = value / this.scale;
	}

	public get region() {
		return new Rect(this.left, this.top, this.width, this.height);
	}

	/**
	 * 设置控件的起始（左上角）位置；一般情况下在初始化后设置一次即可；
	 * @param {Point} startPoint 控件左上角位置；
	 */
	public setStartPoint(startPoint: Point) {
		this.left = startPoint.x;
		this.top = startPoint.y;
	}

	/**
	 * 设置控件的右下角坐标位置；
	 * @param {Point} endPoint 控件右下角位置坐标线；
	 */
	public setEndPoint(endPoint: Point) {
		// 先借助于 x,y更新 width和height;
		this.width = Math.abs(endPoint.x - this.left);
		this.height = Math.abs(endPoint.y - this.top);
		//
		this.left = Math.min(this.left, endPoint.x);
		this.top = Math.min(this.top, endPoint.y);
	}

	/**
	 * 当鼠标移动时触发该函数；
	 * @param {Point} endPoint 鼠标移动时，鼠标在整个绘图区域内的坐标位置；
	 * @param {MouseManager} args 鼠标移动时的相关参数；
	 */
	public onMouseMove(endPoint: Point, args: MouseManager) {
		if (!args || !args.hitTestResult || args.hitTestResult.control !== this) {
			return;
		}
		// 位置调整
		const testResult = args.hitTestResult;
		const offset = testResult.offset || new Point();
		const position = testResult.position || HitTestPosition.None;
		if (position === HitTestPosition.Inside) {
			// 对象移动操作
			this.left = endPoint.x - offset.x;
			this.top = endPoint.y - offset.y;
		} else {
			const oldRegion = testResult.region;
			const startPoint = testResult.point;
			const offsetLeft = startPoint.x - oldRegion.x;
			const offsetTop = startPoint.y - oldRegion.y;
			const offsetRight = startPoint.x - oldRegion.getRight();
			const offsetBottom = startPoint.y - oldRegion.getBottom();
			// 修改对象的位置及大小；
			const rect = this.region;
			if (position === HitTestPosition.Left || position === HitTestPosition.LeftTop || position === HitTestPosition.LeftBottom) {
				rect.setLeft(endPoint.x - offsetLeft);
			}
			if (position === HitTestPosition.Top || position === HitTestPosition.LeftTop || position === HitTestPosition.RightTop) {
				rect.setTop(endPoint.y - offsetTop);
			}
			if (position === HitTestPosition.Right || position === HitTestPosition.RightTop || position === HitTestPosition.RightBottom) {
				rect.setRight(endPoint.x - offsetRight);
			}
			if (position === HitTestPosition.Bottom || position === HitTestPosition.LeftBottom || position === HitTestPosition.RightBottom) {
				rect.setBottom(endPoint.y - offsetBottom);
			}
			this.setRegion(rect);
		}
	}

	public onMouseUp(endPoint: Point, args: MouseManager) {
		this.onMouseMove(endPoint, args);
	}

	/**
	 * 设置控件所在的区域；
	 * @param {Rect} region 控件所在的区域；
	 */
	public setRegion(region: Rect) {
		if (!(region instanceof Rect)) {
			return;
		}

		this.left = region.x;
		this.top = region.y;
		this.width = region.width;
		this.height = region.height;
	}

	/**
	 * 在给定的画布上绘制相关数据；
	 * @param {DzCanvas} context 画布上下文，用于在上面绘制相关图形；
	 */
	public onRender(context: DzCanvas, renderParam: RenderParam) {
		// 什么都不做，具体任务让子类自己去处理；
	}

	/**
	 * 在主要对象绘制完毕后，绘制一些对象的焦点信息；
	 * @param {DzCanvas} context 画布上下文；
	 * @param {PreviewParam} renderParam 绘制参数；
	 */
	public onPostRender(context: DzCanvas, renderParam: RenderParam) {
		if (this.isActive) {
			//
		} else if (this.isSelected) {
			if (renderParam instanceof PreviewParam) {
				const p = renderParam as PreviewParam;
				// 左上
				p.drawAnchor(context, this.region.getLeftTopPoint());
				// 右上
				p.drawAnchor(context, this.region.getRightTopPoint());
				// 左下
				p.drawAnchor(context, this.region.getLeftBottomPoint());
				// 右下
				p.drawAnchor(context, this.region.getRightBottomPoint());
				// 左中
				p.drawAnchor(context, this.region.getLeftCenterPoint());
				// 上中
				p.drawAnchor(context, this.region.getTopCenterPoint());
				// 右中
				p.drawAnchor(context, this.region.getRightCenterPoint());
				// 下中
				p.drawAnchor(context, this.region.getBottomCenterPoint());
			}
		}
	}

	/**
	 * 对给定的坐标点进行点击测试；
	 * @param {Point} point 当前鼠标所在的左边点；
	 * @param {PreviewParam} renderParam 绘制相关全局参数；
	 */
	public hitTest(point: Point, renderParam: RenderParam): HitTestResult | null {
		if (!(renderParam instanceof PreviewParam)) {
			return null;
		}
		const p = renderParam as PreviewParam;
		const position = this.region.hitTest(point, p.anchorRadius);
		return new HitTestResult(this, point, position);
	}

	/**
	 * 获取当前控件相对于给定位置的偏移量；
	 * @param {Point} point 相对坐标位置；
	 */
	public getOffset(point: Point) {
		return this.region.getOffset(point);
	}
}

export default BaseControl;
