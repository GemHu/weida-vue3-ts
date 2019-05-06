import BaseControl from './BaseControl';
import DzCanvas from '../helpers/DzCanvas';
import RenderParam from '../common/RenderParam';

class RectControl extends BaseControl {
	// constructor () {}

	/**
	 * 在给定的画布上绘制相关数据；
	 * @param {DzCanvas} context 目标画布；
	 */
	public onRender(context: DzCanvas, param: RenderParam) {
		super.onRender(context, param);
		if (this.width > 0 && this.height > 0) {
			context.drawRect(this.left, this.top, this.width, this.height);
		}
	}
}

export default RectControl;
