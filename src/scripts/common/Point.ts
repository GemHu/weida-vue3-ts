import Rect from './Rect';

class Point {
	// ========================//
	// 静态方法区域
	// ========================//

	/**
	 * 获取一个空实例；
	 */
	public static getEmptyPoint() {
		return new Point(0, 0);
	}

	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x || 0;
		this.y = y || 0;
	}

	public isEmpty() {
		return !this.x && !this.y;
	}

	/**
	 * 根据给定的锚点半径获取当前点上的锚点区域；
	 * @param {number} radius 锚点半径；
	 */
	public getAnchorRegion(radius: number) {
		if (typeof radius !== 'number' || radius <= 0) {
			radius = 0;
		}
		return new Rect(this.x - radius, this.y - radius, radius * 2, radius * 2);
	}
}

export default Point;
