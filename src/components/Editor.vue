<template>
	<div ref="LabelContainer" id="label-editor-presention"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import RulerContainer from '../scripts/editor/RulerContainer';
import { ItemTypes } from '../scripts/editor/ItemCreator';

@Component
export default class Editor extends Vue {
	protected rulerContainer: RulerContainer | null;
	protected labelEditor: any;

	constructor() {
		super();
		this.rulerContainer = null;
	}

	// 声明周期钩子函数；
	public mounted() {
		this.rulerContainer = new RulerContainer(this.$refs.LabelContainer);
		this.labelEditor = this.rulerContainer.LabelEditor;
	}

	// 计算属性
	/**
	 * 插入类型属性；
	 */
	get insertType() {
		return this.$store.state.drawType;
	}
	/**
	 * 用户点击打印按钮式的响应函数；
	 */
	get onPrint() {
		return this.$store.state.onPrint;
	}

	@Watch('insertType')
	public onInsertTypeChanged() {
		// 当插入类型发生变化后，要重置插入对象，否则用户连续两次点击同一个插入对象是后续操作无效；
		if (this.insertType !== ItemTypes.None) {
			this.labelEditor.setDrawTarget(this.insertType);
			this.$store.commit('setDrawType', ItemTypes.None);
		}
	}
	/**
	 * 监控计算属性 onPrint 的变化；
	 */
	@Watch('onPrint')
	public onPrintChanged() {
		this.labelEditor.print();
	}
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
