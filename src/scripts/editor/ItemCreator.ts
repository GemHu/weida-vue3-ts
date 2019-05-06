import BaseControl from '../controls/BaseControl';

/* eslint-disable quotes */
// import LineControl from "../controls/LineControl";
// import RectControl from "../controls/RectControl";

const ItemTypes = {
	None: '',
	Line: 'line',
	Rect: 'rect',
};

class ItemCreator {
	public static createLabelItem(data = {}): BaseControl | null {
		// if (data.name === ItemTypes.Line) {
		// 	return new LineControl(data);
		// } else if (data.name === ItemTypes.Rect) {
		// 	return new RectControl(data);
		// }

		return null;
	}
}

export { ItemTypes, ItemCreator };
