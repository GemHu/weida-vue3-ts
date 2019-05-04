import Utils from '../helpers/Utils';

class LabelEditor {
	static This: any;
	container: any;

	constructor(container: any, data: any) {
		this.container = Utils.getElement(container);
		// 初始化标签空间；
		data = data || { width: 70, height: 50, rotation: 90 };
	}


	/**
	 * 获取编辑器单实例，因为涉及到了相关事件的注册，为了避免不必要的麻烦，将编辑器对象设置成单实例吧；
	 * @param {object} el 编辑器canvas或者编辑器所在父容器；
	 * @param {*} data 编辑器相关参数；
	 */
	public static getInstance(el: any, data: any) {
		if (!LabelEditor.This) {
			LabelEditor.This = new LabelEditor(el, data);
		}

		return LabelEditor.This;
	}
}

export default LabelEditor;
