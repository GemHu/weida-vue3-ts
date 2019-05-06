import Base from './DataItem';

class PrintData extends Base {
	private items: Base[] = [];

	constructor(data?: any) {
		super();
		data = data || {};
		this.width = data.width || 50;
		this.height = data.height || 70;
		// rotation主要用于打印的时候设置旋转角度，绘制的时候不用管；
		this.rotation = data.rotation || 0;
	}

	get Items(): Base[] {
		return this.items;
	}

	/**
	 * 判断当前打印方向是不是横向打印；
	 */
	get IsLandscape(): boolean {
		if (this.rotation === 0 || this.rotation === 2) {
			return true;
		}

		return this.rotation % 180 === 0;
	}

	/**
	 * 判断当前的打印方向是不是竖向打印；
	 */
	get IsPortrait(): boolean {
		if (this.rotation === 1 || this.rotation === 3) {
			return true;
		}

		return this.rotation % 90 === 0 && this.rotation % 180 !== 0;
	}

	public clone(copy?: PrintData): PrintData {
		const copy1 = copy || new PrintData(this);
		this.Items.forEach((item) => {
			copy1.addChild(item.clone());
		});

		return copy as PrintData;
	}

	public addChild(child: Base) {
		if (!child) {
			return;
		}

		this.Items.push(child);
	}

	public removeChild(child: Base): Base | null {
		const index = this.Items.indexOf(child);
		if (index < 0) {
			return null;
		}

		this.Items.splice(index, 1);
		return child;
	}
}

export { PrintData, Base };
