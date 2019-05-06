import Utils from '../helpers/Utils';
import { ItemTypes } from './ItemCreator';
import Point from '../common/Point';
import LabelView from './LabelView';
import { PrintData } from '../datas/PrintData';
import { MouseAction, MouseManager } from './MouseManager';
import { HitTestResult, HitTestPosition } from './HitTest';
import PreviewParam from './PreviewParam';
import BaseControl from '../controls/BaseControl';
import GroupSelector from './GroupSelector';
import RectControl from '../controls/RectControl';
import PrintManager from '../Print/PrintManager';

function onMouseDown(e: any) {
	LabelEditor.getInstance(null).onMouseDown(e);
}

function onMouseMove(e: any) {
	LabelEditor.getInstance(null).onMouseMove(e);
}

function onMouseUp(e: any) {
	LabelEditor.getInstance(null).onMouseUp(e);
}

// function onDBClick(e: any) {
// 	LabelControl.getInstance(null).onDBClick(e);
// }

// function onContextMenu(e) {
// 	LabelControl.getInstance(null).onContextMenu(e);
// }

const DzCursors = {
	/**
	 * 默认光标样式；
	 */
	Default: 'default',
	/**
	 * 移动操作；
	 */
	Move: 'move',
	/**
	 * 上下方向调整；
	 */
	ResizeTB: 'n-resize',
	/**
	 * 左右方向调整；
	 */
	ResizeLR: 'w-resize',
	/**
	 * 左上角、右下角调整；
	 */
	ResizeLT: 'nw-resize',
	/**
	 * 右上角、左下角调整；
	 */
	ResizeRT: 'ne-resize',
	// RotateLT: 'url(xxx)',
	// RotateRT: 'url(xxx)',
	// RotateLB: 'url()',
	// RotateRB: 'url()'
};

class LabelEditor {
	// ========================//
	// 静态方法区域
	// ========================//
	/**
	 * 获取编辑器单实例，因为涉及到了相关事件的注册，为了避免不必要的麻烦，将编辑器对象设置成单实例吧；
	 * @param {object} el 编辑器canvas或者编辑器所在父容器；
	 * @param {*} data 编辑器相关参数；
	 */
	public static getInstance(el: any): LabelEditor {
		if (!LabelEditor.sInstance) {
			LabelEditor.sInstance = new LabelEditor(el);
		}

		return LabelEditor.sInstance;
	}
	// ========================//
	// 静态属性
	// ========================//
	private static sInstance: any;

	// ========================//
	// 成员属性 //
	// ========================//
	// public field
	public LabelControl: LabelView;
	// protect field
	protected container: HTMLElement;
	// private field
	private renderParam: any;
	private canvas: any;
	private mouseManager: MouseManager = MouseManager.getInstance();
	private offset: Point = new Point();
	private groupSelector: GroupSelector = new GroupSelector();

	constructor(container: HTMLElement) {
		// 创建一个默认大小的标签；
		this.LabelControl = new LabelView(new PrintData({
			width: 50,
			height: 70,
			rotation: 90,
		}));
		// 显示标签；
		this.canvas = this.LabelControl.Canvas;
		this.container = container;
		this.container.innerHTML = '';
		this.container.appendChild(this.canvas);
		//
		this.renderParam = new PreviewParam(this.LabelControl);
		// 注册鼠标点击事件
		this.initMouseEvent();
		// 相关参数初始化完毕后，刷新下页面；
		this.invalidate();
	}

	/**
	 * 根据给定的标签数据，更新标签控件；
	 * @param {Object} data 标签数据；
	 */
	public loadData(data: PrintData) {
		if (data) {
			this.LabelControl.loadData(data);
		}
	}

	/**
	 * 保存标签内容到给定的数据中；
	 */
	public saveData(): PrintData {
		return this.LabelControl.saveData();
	}

	public invalidate() {
		this.LabelControl.invalidate();
		this.LabelControl.onRender(this.renderParam);
		// 显示多选边框
		if (this.mouseManager.action === MouseAction.Select) {
			this.groupSelector.onRender(this.LabelControl.Context);
		}
	}

	public addCanvasListener(eventName: string, handler: (e: any) => void) {
		Utils.addListener(this.canvas, eventName, handler);
	}

	public removeCanvasListener(eventName: string, handler: (e: any) => void) {
		Utils.removeListener(this.canvas, eventName, handler);
	}

	public addDocListener(eventName: string, handler: (e: any) => void) {
		Utils.addListener(document, eventName, handler);
	}

	public removeDocListener(eventName: string, handler: (e: any) => void) {
		Utils.removeListener(document, eventName, handler);
	}

	/**
	 * 设置当前绘制对象；
	 * @param {string} value 绘制对象；
	 */
	public setDrawTarget(value: string) {
		value = value || ItemTypes.None;
		if (value === ItemTypes.None) {
			this.mouseManager.action = MouseAction.Select;
		} else {
			this.mouseManager.action = MouseAction.Insert;
			this.mouseManager.maObject = value;
		}
	}

	public createEditObject(drawType: string): BaseControl | null {
		if (drawType === ItemTypes.Rect) {
			return new RectControl();
		} else if (drawType === ItemTypes.Line) {
			// return new LineControl(this);
		}

		return null;
	}

	/**
	 * 双击事件响应函数；
	 * @param {MouseEvent} e 鼠标事件参数；
	 */
	public onDBClick(e: MouseEvent) {
		console.log('onDBClick');
	}

	/**
	 * 右键菜单响应函数；
	 * @param {MouseEvent} e 事件参数；
	 */
	public onContextMenu(e: MouseEvent) {
		console.log('onContextMenu');
	}

	/**
	 * 鼠标按下时的事件处理函数；
	 * @param {MouseEvent} e 鼠标操作时间参数；
	 */
	public onMouseDown(e: MouseEvent) {
		console.log('onMouseDown');
		this.mouseManager.isMouseDown = true;
		// 添加全屏鼠标移动、鼠标弹起事件；
		this.addDocListener('mousemove', onMouseMove);
		this.addDocListener('mouseup', onMouseUp);

		// const startPoint = new Point(e.offsetX, e.offsetY);
		const startPoint = this.calcPoint(e);
		this.groupSelector.onMouseDown(startPoint);
		// 如果当前状态为插入状态，则插入目标对象；
		if (this.mouseManager.action === MouseAction.Insert) {
			// 在编辑器中添加编辑对象
			const control = this.createEditObject(this.mouseManager.maObject);
			if (control != null) {
				this.LabelControl.addChild(control);
				control.left = startPoint.x;
				control.top = startPoint.y;
				this.mouseManager.action = MouseAction.Modify;
				this.mouseManager.hitTestResult = new HitTestResult(control, startPoint, HitTestPosition.RightBottom);
			}
		} else {
			// 如果用户按下了 【Ctrl】 键，表示用户想要在已有选项基础上进行点选或者取消选择操作操作
			const targets = this.LabelControl.hitTest(startPoint, this.renderParam);
			const testTarget = (targets && targets.length > 0 && targets[0].position !== HitTestPosition.None) ? targets[0] : null;
			if (testTarget) {
				this.mouseManager.hitTestResult = testTarget;
				if (e.ctrlKey && testTarget.control.isSelected) {
					this.groupSelector.deSelectItem(testTarget.control);
				} else {
					this.groupSelector.selectItem(testTarget.control);
				}
				this.invalidate();
			} else {
				// 选择操作；
				this.groupSelector.deSelectAll();
				this.mouseManager.hitTestResult = null;
				this.mouseManager.action = MouseAction.Select;
			}
		}
	}

	/**
	 * 鼠标移动时的事件处理函数；
	 */
	public onMouseMove(e: MouseEvent) {
		// console.log('onMouseMove');
		// console.log(e);
		const endPoint = this.calcPoint(e);
		this.groupSelector.onMouseMove(endPoint);
		const targets = this.LabelControl.hitTest(endPoint, this.renderParam);
		const testTarget = targets && targets.length > 0 ? targets[0] : null;
		if (this.mouseManager.isMouseDown) {
			const orienTarget = this.mouseManager.hitTestResult;
			// 在鼠标左键按下的状态下移动
			// 如果当前状态是绘制状态，则试试更新当前绘制对象的大小；
			if (this.mouseManager.action === MouseAction.Move) {
				// 如果当前状态是移动状态，则修改对象移动的偏移量
				(orienTarget as HitTestResult).control.onMouseMove(endPoint, this.mouseManager);
			} else if (this.mouseManager.action === MouseAction.Modify) {
				// 如果当前状态时修改对象大小的状态，则执行相应的修改操作
				(orienTarget as HitTestResult).control.onMouseMove(endPoint, this.mouseManager);
			} else {
				// 如果鼠标在小范围内移动，可以不予处理
				if (this.groupSelector.getStartAdjustRegion().containsPoint(endPoint)) {
					return;
				}
				const prevTestTarget = this.mouseManager.hitTestResult;
				if (prevTestTarget && testTarget && testTarget.control === prevTestTarget.control) {
					if (prevTestTarget.position === HitTestPosition.Inside) {
						this.mouseManager.action = MouseAction.Move;
					} else {
						this.mouseManager.action = MouseAction.Modify;
					}
				} else {
					// 如果当前状态是选择状态，则执行选择操作
					this.LabelControl.updateGroupSelector(this.groupSelector);
				}
			}
			this.invalidate();
		} else {
			// 修改光标状态；
			if (testTarget) {
				this.setCusorByPosition(testTarget.position);
			} else {
				this.setCusorByPosition(HitTestPosition.None);
			}
		}
	}

	/**
	 * 鼠标弹起时的时间处理函数；
	 */
	public onMouseUp(e: MouseEvent) {
		console.log('onMouseUp');
		this.removeDocListener('mousemove', onMouseMove);
		this.removeDocListener('mouseup', onMouseUp);
		this.mouseManager.isMouseDown = false;
		const endPoint = this.calcPoint(e);
		this.groupSelector.onMouseUp(endPoint);
		// 有始有终，移除鼠标按下时添加的全屏鼠标事件
		// 不显示多选框
		this.invalidate();
	}

	/**
	 * 更新标签显示效果；
	 */
	public refresh() {
		this.LabelControl.refresh();
		this.calcOffset();
		// 刷新下页面，否则不显示了
		this.invalidate();
	}

	/**
	 * 根据鼠标事件参数，计算当前鼠标位置相对于Canvas的位置；
	 * @param {MouseEvent} e 鼠标事件参数；
	 */
	public calcPoint(e: MouseEvent) {
		// canvas在浏览器中的位置大小；
		return this.getPointer(e);
	}

	/**
	 * 当浏览器大小发生变化后，重新计算canvas在浏览器中的位置；
	 */
	public calcOffset() {
		this.offset = Utils.getElementOffset(this.canvas);
		return this.offset;
	}

	public getPointer(event: MouseEvent) {
		return new Point(event.clientX - this.offset.x, event.clientY - this.offset.y);
	}

	/**
	 * 设置编辑器光标样式，值可参考 DzCursors 对象；
	 * @param {string} cursor 光标样式；
	 */
	public setCusor(cursor: string) {
		this.canvas.style.cursor = cursor;
	}

	/**
	 * 根据鼠标的位置信息，更新鼠标的状态；
	 * @param {number} position 鼠标在控件中的相对位置；
	 */
	public setCusorByPosition(position: HitTestPosition) {
		if (position === HitTestPosition.Left || position === HitTestPosition.Right) {
			this.setCusor(DzCursors.ResizeLR);
		} else if (position === HitTestPosition.Top || position === HitTestPosition.Bottom) {
			this.setCusor(DzCursors.ResizeTB);
		} else if (position === HitTestPosition.LeftTop || position === HitTestPosition.RightBottom) {
			this.setCusor(DzCursors.ResizeLT);
		} else if (position === HitTestPosition.LeftBottom || position === HitTestPosition.RightTop) {
			this.setCusor(DzCursors.ResizeRT);
		} else if (position === HitTestPosition.Inside) {
			this.setCusor(DzCursors.Move);
		} else {
			this.setCusor(DzCursors.Default);
		}
	}

	/**
	 * 计算标签显示区域；
	 */
	public calcShowRegion() {
		return this.LabelControl.calcShowRegion();
	}

	/**
	 * 开始打印标签
	 */
	public print() {
		PrintManager.print(this.LabelControl);
	}

	/**
	 * 注册编辑器相关事件；
	 */
	private initMouseEvent() {
		if (this.canvas) {
			//
			this.addCanvasListener('mousedown', onMouseDown);
			// this.addCanvasListener('mousemove', onMouseMove);
			// this.addCanvasListener('mouseup', onMouseUp);
			// this.addDocListener('mousedown', onMouseDown);
			// 如果全部在这里注册了，鼠标在非编辑区域按下也会触发点击事件的；
			// this.addDocListener('mousemove', onMouseMove);
			// this.addDocListener('mouseup', onMouseUp);

			//
			// Utils.addListener(this.canvas, 'mouseenter', onMouseEnter);
			// Utils.addListener(this.canvas, 'mouseout', onMouseOut);
			// //
			// Utils.addListener(this.canvas, 'dblclick', onDBClick);
			// Utils.addListener(this.canvas, 'contextmenu', onContextMenu);
			// // touch event
			// Utils.addListener(this.canvas, 'touchstart', onMouseDown);
			// Utils.addListener(this.canvas, 'touchmove', onMouseMove);
		}
	}

}

export default LabelEditor;
