import RenderParam from '../common/RenderParam';
import LabelView from '../editor/LabelView';

class PrintParam extends RenderParam {

	private dpi: number = 0;

	constructor(label: LabelView) {
		super(label);
		this.Dpi = 203;
	}

	set Dpi(value) {
		this.dpi = value;
		this.Scale = value / 25.4;
	}

	get Dpi() {
		return this.dpi || 203;
	}
}

export default PrintParam;
