import Point from './Point';
// import { HitTestPosition } from '../editor/HitTest';

class Rect {
	public x = 0;
	public y = 0;
	public width = 0;
	public height = 0;
	public minWidth = 0;
	public minHeight = 0;

	constructor(x: any, y: any, width: number, height: number) {
		if (x instanceof Point && y instanceof Point) {
			this.x = Math.min(x.x, y.x);
			this.y = Math.min(x.y, y.y);
			this.width = Math.abs(x.x - y.x);
			this.height = Math.abs(x.y - y.y);
		} else {
			this.x = typeof x === 'number' ? x : 0;
			this.y = typeof y === 'number' ? y : 0;
			this.width = width;
			this.height = height;
		}
	}

	public isEmpty() {
		return !this.width && !this.height;
	}

	public getLeft() {
		return this.x;
	}

	public getRight() {
		return this.x + this.width;
	}

	public getTop() {
		return this.y;
	}

	public getBottom() {
		return this.y + this.height;
	}

	public setLeft(value: number) {
		let right = this.x + this.width;
		if (value > right - this.minWidth) {
			value = right - this.minWidth;
		}
		this.x = value;
		this.width = right - value;
	}

	public setTop(value: number) {
		let bottom = this.y + this.height;
		if (value > bottom - this.minHeight) {
			value = bottom - this.minHeight;
		}
		this.y = value;
		this.height = bottom - value;
	}

	/**
	 * 设置矩形框有边框坐标位置；
	 * @param {number} value 矩形框有边框坐标位置；
	 * @param {boolean} force 是否进行强制修改？如果是，则不考虑最小宽度，当value小于x的时候，强制切换x值，否则value值不能小于x的值；
	 */
	public setRight(value: number, force: boolean) {
		if (force) {
			if (value < this.x) {
				this.width = this.x - value;
				this.x = value;
			} else {
				this.width = value - this.x;
			}
		} else {
			if (value < this.x + this.minWidth) {
				value = this.x + this.minWidth;
			}
			this.width = value - this.x;
		}
	}

	public setBottom(value: number, force: boolean) {
		if (force) {
			if (value < this.y) {
				this.height = this.y - value;
				this.y = value;
			} else {
				this.height = value - this.y;
			}
		} else {
			if (value < this.y + this.minHeight) {
				value = this.y + this.minHeight;
			}
			this.height = value - this.y;
		}
	}

	public setMinWidth(minWidth: number) {
		this.minWidth = minWidth;
		if (minWidth > this.width) {
			this.width = minWidth;
		}
	}

	public setMinHeight(minHeight: number) {
		this.minHeight = minHeight;
		if (minHeight > this.height) {
			this.height = minHeight;
		}
	}

	/**
	 * 获取矩形区域左上角相对于给定左边点的相对位置（偏移量）；
	 * @param {Point} point 相对坐标点；
	 */
	public getOffset(point: Point) {
		if (point instanceof Point) {
			return new Point(point.x - this.x, point.y - this.y);
		} else {
			return new Point(0, 0);
		}
	}

	/**
	 * 设置当前矩形区域的偏移量；
	 * @param {Point} offset 左边偏移量；
	 */
	public setOffset(offset: Point) {
		if (offset instanceof Point) {
			this.x += offset.x;
			this.y += offset.y;
		}
	}

	/**
	 * 判断当前矩形框与目标矩形框是否有交集；
	 * @param {Rect} rect 目标矩形框；
	 */
	public isIntersect(left: any, top: number, right: number, bottom: number) {
		if (left instanceof Rect) {
			bottom = left.getBottom();
			right = left.getRight();
			top = left.y;
			left = left.x;
		}
		return this.getLeft() < right && left < this.getRight() && this.getTop() < bottom && top < this.getBottom();
	}

	public static createRectByPoint(startPoint: Point, endPoint: Point) {
		let x = Math.min(startPoint.x, endPoint.x);
		let y = Math.min(startPoint.y, endPoint.y);
		let width = Math.abs(startPoint.x - endPoint.x);
		let height = Math.abs(startPoint.y - endPoint.y);
		return new Rect(x, y, width, height);
	}

	/**
	 * 将当前实例复制一份并返回；
	 */
	public clone() {
		return new Rect(this.x, this.y, this.width, this.height);
	}

	public containsPoint(point: Point) {
		if (!(point instanceof Point)) {
			return false;
		}
		if (this.width <= 0 || this.height <= 0) {
			return false;
		}
		return point.x > this.x && point.x < this.x + this.width && point.y > this.y && point.y < this.y + this.height;
	}

	/**
	 * 获取左上角坐标点；
	 */
	public getLeftTopPoint() {
		return new Point(this.x, this.y);
	}

	/**
	 * 获取右上角坐标点；
	 */
	public getRightTopPoint() {
		return new Point(this.x + this.width, this.y);
	}

	/**
	 * 获取左下角坐标点；
	 */
	public getLeftBottomPoint() {
		return new Point(this.x, this.y + this.height);
	}

	/**
	 * 获取右下角坐标点；
	 */
	public getRightBottomPoint() {
		return new Point(this.x + this.width, this.y + this.height);
	}

	/**
	 * 获取左边框中心点；
	 */
	public getLeftCenterPoint() {
		return new Point(this.x, this.y + this.height * 0.5);
	}

	/**
	 * 获取上边框中心点；
	 */
	public getTopCenterPoint() {
		return new Point(this.x + this.width * 0.5, this.y);
	}

	/**
	 * 获取右边框中心点；
	 */
	public getRightCenterPoint() {
		return new Point(this.x + this.width, this.y + this.height * 0.5);
	}

	/**
	 * 获取下边框中心点；
	 */
	public getBottomCenterPoint() {
		return new Point(this.x + this.width * 0.5, this.y + this.height);
	}

	/**
	 * 获取左侧锚点区域；
	 * @param {number} radius 锚点半径
	 */
	public getLeftAnchorRegion(radius: number) {
		return this.getAnchorRegion(radius, this.x, this.y, 0, this.height);
	}

	/**
	 * 获取上边框锚点区域；
	 * @param {number} radius 锚点半径；
	 */
	public getTopAnchorRegion(radius: number) {
		return this.getAnchorRegion(radius, this.x, this.y, this.width, 0);
	}

	/**
	 * 获取右边框上的锚点区域；
	 * @param {number} radius 锚点半径；
	 */
	public getRightAnchorRegion(radius: number) {
		return this.getAnchorRegion(radius, this.x + this.width, this.y, 0, this.height);
	}

	/**
	 * 获取下边框上的锚点区域；
	 * @param {number} radius 锚点半径；
	 */
	public getBottomAnchorRegion(radius: number) {
		return this.getAnchorRegion(radius, this.x, this.y + this.height, this.width, 0);
	}

	/**
	 * 在整个矩形框的锚点区域（上下左右边界分别向外扩展一定范围）；
	 * @param {number} radius 锚点半径；
	 */
	public getOuterAnchorRegion(radius: number) {
		return this.getAnchorRegion(radius, this.x, this.y, this.width, this.height);
	}

	/**
	 * 根据给定的区域和锚点半径，延伸出一个更大的区域；
	 * @param {number} radius 锚点半径
	 * @param {number} x x轴坐标位置；
	 * @param {number} y y轴左边位置；
	 * @param {number} width 有效区域宽度；
	 * @param {number} height 有效区域高度；
	 */
	public getAnchorRegion(radius: number, x: number, y: number, width: number, height: number) {
		if (typeof radius !== 'number' || radius < 0) {
			radius = 0;
		}

		return new Rect(x - radius, y - radius, width + radius * 2, height + radius * 2);
	}

	/**
	 * 通过点击测试，获取当前鼠标在当前矩形区域内的位置；
	 * @param {Point} point 目标坐标点；
	 */
	public hitTest(point: Point, radius: number) {
		// radius = radius || 5;
		// let outer = this.getOuterAnchorRegion(radius);
		// if (!(point instanceof Point) || !outer.containsPoint(point)) {
		// 	return HitTestPosition.None;
		// }

		// if (this.getLeftTopPoint().getAnchorRegion(radius).containsPoint(point)) {
		// 	// 左上角
		// 	return HitTestPosition.LeftTop;
		// } else if (this.getRightTopPoint().getAnchorRegion(radius).containsPoint(point)) {
		// 	// 右上角
		// 	return HitTestPosition.RightTop;
		// } else if (this.getRightBottomPoint().getAnchorRegion(radius).containsPoint(point)) {
		// 	// 右下角
		// 	return HitTestPosition.RightBottom;
		// } else if (this.getLeftBottomPoint().getAnchorRegion(radius).containsPoint(point)) {
		// 	// 坐下角
		// 	return HitTestPosition.LeftBottom;
		// } else if (this.getLeftAnchorRegion(radius).containsPoint(point)) {
		// 	// 左边框
		// 	return HitTestPosition.Left;
		// } else if (this.getTopAnchorRegion(radius).containsPoint(point)) {
		// 	// 上边框
		// 	return HitTestPosition.Top;
		// } else if (this.getRightAnchorRegion(radius).containsPoint(point)) {
		// 	// 右边框
		// 	return HitTestPosition.Right;
		// } else if (this.getBottomAnchorRegion(radius).containsPoint(point)) {
		// 	// 下边框；
		// 	return HitTestPosition.Bottom;
		// } else {
		// 	return HitTestPosition.Inside;
		// }
	}

	/**
	 * 根据给定的缩放比例，获取一个新的矩形框；
	 * @param {number} scale 缩放比例；
	 */
	public getZoomRect(scale: number) {
		scale = scale || 1;
		return new Rect(this.x * scale, this.y * scale, this.width * scale, this.height * scale);
	}
}

export default Rect;
