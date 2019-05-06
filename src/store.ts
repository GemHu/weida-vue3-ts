import Vue from 'vue';
import Vuex from 'vuex';
import { ItemTypes } from './scripts/editor/ItemCreator';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		/**
		 * 绘制目标，默认为 none，表示当前状态为选择状态，具体value值可参考 ObjectType；
		 */
		drawType: ItemTypes.None,
		/**
		 * 当用户点击打印按钮式，切换改变量，然后通过检测改变量的变化来做相关处理工作；
		 */
		onPrint: true,
	},
	mutations: {
		setDrawType(state, target) {
			state.drawType = target;
		},
		// 切换 onPrint 状态，触发对 onPrint 的监听回调；
		doPrint(state) {
			state.onPrint = !state.onPrint;
		},
	},
	actions: {

	},
});
