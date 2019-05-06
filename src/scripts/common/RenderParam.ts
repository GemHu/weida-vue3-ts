import Rect from './Rect';
import LabelView from '../editor/LabelView';
import { PrintData } from '../datas/PrintData';

class RenderParam {
	protected currLabel: LabelView | null;
	protected scale: number;

	constructor(label?: LabelView) {
		// 标签实际大小相对于毫米尺寸的缩放比例；
		this.scale = 0;
		this.currLabel = label || null;
	}

	get CurrLabel() {
		return this.currLabel as LabelView;
	}

	set CurrLabel(value: LabelView) {
		this.currLabel = value;
	}

	get PrintData(): PrintData | null {
		return this.currLabel ? this.currLabel.PrintData : null;
	}

	get ShownWidth() {
		return this.currLabel ? this.currLabel.ShownWidthMM * this.Scale : 0;
	}

	get ShownHeight() {
		return this.currLabel ? this.currLabel.ShownHeightMM * this.Scale : 0;
	}

	get Scale() {
		return this.scale;
	}

	set Scale(value) {
		this.scale = value || 0;
	}

	get Rotation() {
		return this.CurrLabel.rotation;
	}

	/**
	 * 根据给定的目标矩形区域
	 * @param {Rect} rect 目标矩形区域；
	 */
	public getPrintRegion(rect: Rect): Rect {
		return new Rect(rect.x * this.Scale, rect.y * this.Scale, rect.width * this.Scale, rect.height * this.Scale);
	}
}

export default RenderParam;
