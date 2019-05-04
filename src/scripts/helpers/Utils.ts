import Point from '../common/Point';
import Rect from '../common/Rect';

/**
 * 工具类，提供相关静态方法；
 */
class Utils {
	public static addListener(element: any, eventName: string, handler: any) {
		element.addEventListener(eventName, handler);
	}

	public static removeListener(element: any, eventName: string, handler: any) {
		element.removeEventListener(eventName, handler);
	}

	/**
	 * 如果el为一个字符串，则查找字符串对应的元素，并返回；
	 * @param {object} el 目标元素；
	 */
	public static getElement(el: any) {
		if (typeof el === 'string') {
			let element = document.getElementById(el);
			if (!element) {
				element = document.querySelector(el);
			}
			if (element) {
				return element;
			}
		}

		return el;
	}

	public static getCanvas(el: any) {
		// 如果el为字符串，则将字符串转换为对应的html标签；
		Utils.getElement(el);
		//
		if (el instanceof HTMLCanvasElement) {
			return el;
		} else if (el instanceof HTMLDivElement) {
			for (const item of el.childNodes) {
				if (item instanceof HTMLCanvasElement) {
					return item;
				}
			}
			// 未找到，则创建并添加
			const canvas = document.createElement('canvas');
			canvas.style.position = 'absolute';
			canvas.style.left = '0px';
			canvas.style.top = '0px';
			el.appendChild(canvas);

			return canvas;
		}
		return null;
	}

	/**
	 * 获取当前鼠标位置相对于目标元素左上角的坐标位置；
	 * @param {MouseEvent} event 鼠标事件参数；
	 * @param {HTMLElement} element 目标html元素；
	 */
	public static getPointer(event: MouseEvent, element: HTMLElement) {
		const offset = Utils.getElementOffset(element);
		return new Point(event.clientX - offset.x, event.clientY - offset.y);
	}

	public static getElementOffset(element: HTMLElement) {
		const rect = Utils.getElementRectInClient(element);
		return new Point(rect.x, rect.y);
	}

	public static getElementRectInClient(element: HTMLElement) {
		element = Utils.getElement(element);
		const rect = new Rect(0, 0, 0, 0);
		if (!(element instanceof HTMLElement)) {
			return rect;
		}

		const box = element.getBoundingClientRect();
		rect.x = box.left;
		rect.y = box.top;
		rect.width = box.width ? box.width : box.right - box.left;
		rect.height = box.height ? box.height : box.bottom - box.top;
		return rect;
	}
}

export default Utils;
