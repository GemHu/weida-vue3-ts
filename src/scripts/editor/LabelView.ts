import GroupSelector from './GroupSelector';
import { PrintData } from '../datas/PrintData';
import BaseControl from '../controls/BaseControl';
import { ItemCreator } from './ItemCreator';
import DzCanvas from '../helpers/DzCanvas';
import Point from '../common/Point';
import Rect from '../common/Rect';
import RenderParam from '../common/RenderParam';
import { HitTestPosition, HitTestResult } from './HitTest';

/**
 * 标签控件，用于显示或者打印一张标签；
 */
class LabelView {
	private margin: number = 10;
	private renderParam: RenderParam | null = null;
	private printData: PrintData = new PrintData();
	private children: BaseControl[] = [];
	private canvas: HTMLCanvasElement = document.createElement('canvas');
	private context: DzCanvas;

	constructor(data: PrintData) {
		// 初始化画布；
		this.initCanvas();
		this.context = new DzCanvas(this.Canvas);
		//
		this.updateLabelSize();
		// 加载标签数据；
		this.loadData(data);
	}

	public get Canvas(): HTMLCanvasElement {
		return this.canvas;
	}

	public get Context(): DzCanvas {
		return this.context;
	}

	public get PrintData(): PrintData {
		return this.printData;
	}
	get scale() {
		return this.renderParam ? this.renderParam.Scale : 1;
	}

	get IsLandscape(): boolean {
		return this.PrintData && this.PrintData.IsLandscape;
	}

	/**
	 * 标签无旋转时的宽度，单位毫米；
	 */
	get ShownWidthMM() {
		return this.IsLandscape ? this.PrintData.width : this.PrintData.height;
	}

	/**
	 * 标签无旋转时的高度，单位毫米；
	 */
	get ShownHeightMM() {
		return this.IsLandscape ? this.PrintData.height : this.PrintData.width;
	}

	get rotation() {
		return this.PrintData.rotation || 0;
	}

	set rotation(value) {
		this.PrintData.rotation = value;
	}

	set width(value) {
		if (this.renderParam) {
			this.renderParam.Scale = value / this.ShownWidthMM;
		}
	}

	get width() {
		return this.ShownWidthMM * this.scale;
	}

	set height(value) {
		if (this.renderParam) {
			this.renderParam.Scale = value / this.ShownHeightMM;
		}
	}

	get height() {
		return this.ShownHeightMM * this.scale;
	}

	/**
	 * 从给定的数据中加载标签内容；
	 * @param {Object} data 待加载数据；
	 */
	public loadData(data: PrintData) {
		this.printData = data || new PrintData();
		// children
		this.children = [];
		data.Items.forEach((item) => {
			const child = ItemCreator.createLabelItem(item);
			if (child != null) {
				child.parent = this;
				this.children.push(child);
			}
		});
	}

	/**
	 * 将标签内容保存到给定的对象中去；
	 * @param {Object} data 保存后的目标对象；
	 */
	public saveData(): PrintData {
		// 先同步数据；为了提高性能，线注释掉这段代码；
		// this.printData.items.splice(0);
		// this.children.forEach(child => {
		// 	this.printData.items.push(child.printData);
		// });
		// 复制打印数据；
		return this.PrintData.clone();
	}

	public initCanvas() {
		// 一张标签对应一张独立的 canvas；
		this.Canvas.style.position = 'absolute';
		this.Canvas.style.backgroundColor = '#ffffff';
		this.Canvas.style.borderRadius = '10px';
		// 封装后的画布上下文，可以通过该实例来进行相关的绘制操作；
		this.context = new DzCanvas(this.Canvas);
	}

	/**
	 * 使当前绘制信息无效，清空画布，开始重新绘制；
	 */
	public invalidate() {
		this.context.clearAll();
	}

	// updateRegion (renderParam) {
	// 	const rect = new Rect(0, 0, this.width, this.height);
	// 	if (renderParam.renderStatus === RenderStatus.Printing) {
	// 		// 标签缩放比率按照打印机的分辨率来设置，这样渲染出来的标签就可以适配打印机；
	// 		this.region = renderParam.getPrintRegion(rect);
	// 	} else {
	// 		// 标签缩放比率需要根据预览页面的大小来计算，这样渲染出来的样式就是实际显示的样式；
	// 		this.region = rect;
	// 	}
	// }

	/**
	 * 重新绘制相关视图；
	 * @param {DzCanvas} context 画布上下文环境；
	 * @param {RenderParams} renderParams 绘制全局参数；
	 */
	public onRender(renderParams: RenderParam) {
		this.renderLabel(this.context, renderParams);
		//
		this.renderExtra(this.context, renderParams);
	}

	/**
	 * 重新绘制相关视图；
	 * @param {DzCanvas} context 画布上下文环境；
	 * @param {RenderParam} renderParams 绘制全局参数；
	 */
	public renderLabel(context: DzCanvas, renderParam: RenderParam) {
		if (!(context instanceof DzCanvas)) {
			return;
		}
		this.renderParam = renderParam;
		// 更新标签渲染后的大小；
		// this.updateRegion(renderParam);
		// 根据不同的渲染状态，更新控件的相关位置信息；
		// this.children.forEach((child) => {
		// 	child.updateRegion(renderParam);
		// });
		// 1、绘制一些全局的信息，譬如背景色，网格线等等；
		// 2、遍历子控件，重绘子控件相关视图；
		this.children.forEach((item) => {
			if (item instanceof BaseControl) {
				item.onRender(context, renderParam);
			}
		});
		// 恢复显示状态；
		// renderParam.renderStatus = RenderStatus.None;
	}

	/**
	 * 渲染标签编辑过程中的附加信息；
	 * @param {DzCanvas} context 画布上下文环境；
	 * @param {RenderParams} renderParams 绘制全局参数；
	 */
	public renderExtra(context: DzCanvas, renderParams: RenderParam) {
		if (!(context instanceof DzCanvas)) {
			return;
		}
		// 1、绘制相关焦点
		this.children.forEach((child) => {
			child.onPostRender(context, renderParams);
		});
	}

	/**
	 * 向编辑器中添加控件；
	 * @param {BaseControl} child 目标控件；
	 */
	public addChild(child: BaseControl) {
		if (!(child instanceof BaseControl)) {
			return false;
		}

		child.parent = this;
		this.children.push(child);
		this.PrintData.addChild(child.PrintData);
	}

	/**
	 * 从子控件列表中删除指定的控件；
	 * @param {BaseControl} child 待删除的目标对象；
	 */
	public removeChild(child: BaseControl) {
		const index = this.children.indexOf(child);
		if (index < 0) {
			return null;
		}

		// js数组函数中，pop删除最后一个元素，shift删除第一个元素，splice表示从指定位置开始删除或者添加多个元素；
		child.parent = null;
		this.PrintData.removeChild(child.PrintData);
		return this.children.splice(index, 1);
	}

	/**
	 * 根据给定的坐标点，查找改坐标点所在位置的对象；
	 * @param {Point} point 目标左边点；
	 * @param {RenderParams} renderParams 全局绘制参数；
	 */
	public hitTest(point: Point, renderParams: RenderParam): HitTestResult[] {
		const results: HitTestResult[] = [];
		// 重新创建个数组对象，然后进行翻转，倒序遍历
		this.children.slice().reverse().forEach((item) => {
			const ret = item.hitTest(point, renderParams);
			if (ret && ret.position !== HitTestPosition.None) {
				results.push(ret);
			}
		});

		return results;
	}

	/**
	 * 根据给定的打印参数，计算标签显示区域；
	 * @param {PrintParam} param 标签打印相关参数；
	 */
	public calcShowRegion() {
		// 获取标签所的div控件；
		const element = this.Canvas.parentNode as HTMLElement;
		if (!element || element.offsetWidth < this.margin * 2 || element.offsetHeight < this.margin * 2) {
			return new Rect();
		}
		// 获取显示容器大小；
		const pWidth = element.offsetWidth - this.margin * 2;
		const pHeight = element.offsetHeight - this.margin * 2;
		// 现根据显示区域的大小，设置标签的默认显示大小；
		this.width = pWidth;
		this.height = pHeight;
		if (pWidth > this.ShownWidthMM * pHeight / this.ShownHeightMM) {
			// 宽度比较大，则可以根据高度获取需要的宽度
			this.width = pHeight * this.ShownWidthMM / this.ShownHeightMM;
		} else {
			// 高度比较大，根据宽度获取需要的高度
			this.height = pWidth * this.ShownHeightMM / this.ShownWidthMM;
		}

		const x = this.margin + (pWidth - this.width) * 0.5;
		const y = this.margin + (pHeight - this.height) * 0.5;
		return new Rect(x, y, this.width, this.height);
	}

	/**
	 * 根据打印参数，更新标签显示效果；
	 */
	public refresh() {
		this.updateLabelSize();
	}

	/**
	 * 根据给定显示区域的大小，更新标签的显示位置及大小
	 */
	public updateLabelSize() {
		const rect = this.calcShowRegion();
		if (!rect) {
			return;
		}
		this.Canvas.style.left = rect.x + 'px';
		this.Canvas.style.top = rect.y + 'px';
		this.Canvas.width = rect.width;
		this.Canvas.height = rect.height;
	}

	/**
	 * 遍历并更新子控件选择状态；
	 */
	public updateGroupSelector(selector: GroupSelector) {
		this.children.forEach((child) => {
			selector.addOrRemove(child);
		});
	}
}

export default LabelView;
