class DzCanvas {
	public canvas: HTMLCanvasElement;
	public ctx: CanvasRenderingContext2D;
	public defaultLineWidth: number;
	public defaultColor: string;
	public fontName: string;
	public fontSize: number;
	public supportLineDash: boolean | null;
	public lineWidth = 0;
	public color: any;
	public borderColor: any;
	public backgroundColor: any;
	/**
	 * 用一个Canvas初始化DzCanvas实例；
	 * @param {Canvas} canvas HTML5画布；
	 */
	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		this.defaultLineWidth = 3;
		this.defaultColor = 'black';
		this.fontName = 'Arial';
		this.fontSize = 15;
		//
		this.supportLineDash = this.supports('setLineDash');
	}

	public supports(methodName: string) {
		switch (methodName) {
			case 'getImageData':
				return typeof this.ctx.getImageData !== 'undefined';
			case 'setLineDash':
				return typeof this.ctx.setLineDash !== 'undefined';
			case 'toDataURL':
				return typeof this.canvas.toDataURL !== 'undefined';
			case 'toDataURLWithQuality':
				try {
					this.canvas.toDataURL('image/jpeg', 0);
					return true;
				} catch (e) {
					return false;
				}
			default:
				return null;
		}
	}

	public clearAll() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	// 参数设置
	public setLineWidth(lineWidth: number) {
		this.lineWidth = lineWidth;
	}

	public getLineWidth(lineWidth: number) {
		return lineWidth || this.lineWidth || this.defaultLineWidth;
	}

	public setColor(color: any) {
		this.color = color;
	}

	public getColor(color: any): any {
		return color || this.color || this.defaultColor;
	}

	public setStrokeColor(color: any) {
		this.borderColor = color;
	}

	public getStrokeColor(color: any): any {
		return color || this.borderColor || this.getColor(null);
	}

	public setBackgroundColor(color: string) {
		this.backgroundColor = color;
	}

	public getBackgroundColor(color: string) {
		return color || this.backgroundColor || this.getColor(null);
	}

	public setFontName(name: string) {
		this.fontName = name;
	}

	public setFontSize(fontSize: number) {
		this.fontSize = fontSize;
	}

	public drawLine(x1: number, y1: number, x2: number, y2: number, lineWidth?: number, lineColor?: any) {
		this.ctx.beginPath();
		// 设置直线宽度
		this.ctx.lineWidth = this.getLineWidth(lineWidth || 0);
		// 设置直线颜色
		this.ctx.strokeStyle = this.getStrokeColor(lineColor);
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
	}

	public drawRect(x: number, y: number, width: number, height: number, lineWidth?: number, color?: any) {
		// 为了避免出现毛边，需要对x,y,width,height做些处理
		x = Math.round(x) + 0.5;
		y = Math.round(y) + 0.5;
		width = Math.round(width);
		height = Math.round(height);
		// 设置直线宽度
		this.ctx.lineWidth = this.getLineWidth(lineWidth || 0);
		// 设置直线颜色
		this.ctx.strokeStyle = this.getStrokeColor(color);
		this.ctx.strokeRect(x, y, width, height);
	}

	public drawDashRect(x: number, y: number, width: number, height: number, lineWidth?: number, dashArray?: number[], color?: any) {
		dashArray = dashArray || [];
		if (this.supportLineDash) {
			// 设置直线宽度
			this.ctx.lineWidth = this.getLineWidth(lineWidth || 0);
			// 设置直线颜色
			this.ctx.strokeStyle = this.getStrokeColor(color);
			this.ctx.setLineDash(dashArray);
			this.ctx.strokeRect(x, y, width, height);
			// 取消点画线；
			this.ctx.setLineDash([]);
		} else {
			// 通过绘制点画线的方式来实现；
			this.drawDashLine(x, y, x + width, y, lineWidth);
			this.drawDashLine(x + width, y, x + width, y + height, lineWidth);
			this.drawDashLine(x + width, y + height, x, y + height, lineWidth);
			this.drawDashLine(x, y + height, x, y, lineWidth);
		}
	}

	public drawDashLine(x1: number, y1: number, x2: number, y2: number, lineWidth?: number) {
		this.drawLine(x1, y1, x2, y2, lineWidth, null);
	}

	/**
	 * 绘制填充矩形框；
	 * @param {Number} x 填充矩形x轴坐标位置；
	 * @param {Number} y 填充矩形y轴坐标位置；
	 * @param {Number} width 填充矩形宽度；
	 * @param {Number} height 填充矩形高度；
	 * @param {String} color 填充矩形填充颜色；
	 */
	public fillRect(x: number, y: number, width: number, height: number, color: any) {
		this.ctx.fillStyle = this.getBackgroundColor(color);
		this.ctx.fillRect(x, y, width, height);
	}

	public drawText(text: string, x: number, y: number, width: number, height: number, fontName: string, fontSize: number) {
		this.ctx.font = (fontSize || this.fontSize) + 'px ' + (fontName || this.fontName);
		this.ctx.fillStyle = this.defaultColor;
		this.ctx.fillText(text, x, y);
	}
}

export default DzCanvas;
