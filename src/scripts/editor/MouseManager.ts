import Point from '../common/Point';
import Size from '../common/Size';
import { HitTestResult } from './HitTest';
import BaseControl from '../controls/BaseControl';

/**
 * 当前鼠标正在执行的动作类型；
 */
enum MouseAction {
	None,
	Move,
	Modify,
	Copy,
	Select,
	Insert,
}

class MouseManager {
	// ========================== //
	// 静态方法区域；
	// ========================== //
	public static getInstance() {
		if (!MouseManager.sInstance) {
			MouseManager.sInstance = new MouseManager();
		}

		return MouseManager.sInstance;
	}

	public static getHitTestResult() {
		return MouseManager.getInstance().hitTestResult;
	}

	/**
	 * @returns {MouseAction} 返回当前操作状态；
	 */
	public static getAction() {
		return MouseManager.getInstance().action;
	}

	/**
	 * 设置当前鼠标操作状态；
	 * @param {number} action 目标状态；
	 */
	public static setAction(action: MouseAction) {
		MouseManager.getInstance().action = action;
	}

	// ========================== //
	// 静态属性；
	// ========================== //
	private static sInstance: MouseManager;

	public action: MouseAction = MouseAction.None;
	public hitTestResult: HitTestResult | null = null;
	public isMouseDown: boolean = false;
	public maObject: any;
	public maOffset: Point = new Point();
	public maSize: Size = new Size();

	private constructor() {
	}
}

export { MouseAction, MouseManager };
