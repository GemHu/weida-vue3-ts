<template>
	<div ref="LabelContainer" id="label-editor-presention"></div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import RulerContainer from '../scripts/editor/RulerContainer';
import { ItemTypes } from '../scripts/editor/ItemCreator';

@Component({})
export default class LabelEditor extends Vue {
	// data() {
	// 	return {
	// 	}
	// },
	// mounted() {
	// 	this.RulerContainer = new RulerContainer(this.$refs.LabelContainer);
	// 	this.LabelEditor = this.RulerContainer.LabelEditor;
	// },
	// /**
	//  * 计算属性，计算属性依赖于他说使用到的属性，如果使用到的属性发生变化，则触发计算属性的变化，然后同步的更新用到计算属性的相关属性；
	//  */
	// computed: {
	// 	/**
	// 	 * 插入类型属性；
	// 	 */
	// 	insertType() {
	// 		return this.$store.state.drawType;
	// 	},
	// 	/**
	// 	 * 用户点击打印按钮式的响应函数；
	// 	 */
	// 	onPrint() {
	// 		// 只要
	// 		return this.$store.state.onPrint;
	// 	}
	// },
	// watch: {
	// 	// '$store.state.drawTarget': function (value) {
	// 	// 	if (value !== ObjectType.Select) {
	// 	// 		this.LabelEditor.setDrawTarget(value);
	// 	// 		this.$store.commit('setDrawType', ObjectType.Select);
	// 	// 	}
	// 	// },
	// 	insertType() {
	// 		// 当插入类型发生变化后，要重置插入对象，否则用户连续两次点击同一个插入对象是后续操作无效；
	// 		if (this.insertType !== ItemTypes.None) {
	// 			this.LabelEditor.setDrawTarget(this.insertType);
	// 			this.$store.commit('setDrawType', ItemTypes.None);
	// 		}
	// 	},
	// 	/**
	// 	 * 监控计算属性 onPrint 的变化；
	// 	 */
	// 	onPrint() {
	// 		this.LabelEditor.print();
	// 	}
	// },
	// methods: {
	// }
}
</script>

<style>
/* 标签编辑器 */
#label-editor-presention {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}
</style>
