<template>
	<!-- 左侧工具条 -->
	<div class="toolbar">
		<div class="menu-item text" @click="changeDrawTarget($event)">
			<img class="menu-item-icon" src="../assets/images/text.png" alt>
			<div class="menu-item-text">文本</div>
		</div>
		<div class="menu-item barcode" @click="changeDrawTarget($event)">
			<img class="menu-item-icon" src="../assets/images/barcode.png" alt>
			<div class="menu-item-text">一维码</div>
		</div>
		<div class="menu-item qrcode" @click="changeDrawTarget($event)">
			<img class="menu-item-icon" src="../assets/images/qrcode.png" alt>
			<div class="menu-item-text">二维码</div>
		</div>
		<div class="menu-item picture" @click="changeDrawTarget($event)">
			<img class="menu-item-icon" src="../assets/images/picture.png" alt>
			<div class="menu-item-text">图片</div>
		</div>
		<div class="menu-item logo" @click="changeDrawTarget($event)">
			<img class="menu-item-icon" src="../assets/images/logo.png" alt>
			<div class="menu-item-text">Logo</div>
		</div>
		<div class="menu-item line" @click="changeDrawTarget($event)">
			<img class="menu-item-icon" src="../assets/images/line.png" alt>
			<div class="menu-item-text">线条</div>
		</div>
		<div class="menu-item rect" @click="changeDrawTarget($event)">
			<img class="menu-item-icon" src="../assets/images/rectangle.png" alt>
			<div class="menu-item-text">矩形</div>
		</div>
		<div class="menu-item table" @click="changeDrawTarget($event)">
			<img class="menu-item-icon" src="../assets/images/form.png" alt>
			<div class="menu-item-text">表格</div>
		</div>
		<div class="menu-item date" @click="changeDrawTarget($event)">
			<img class="menu-item-icon" src="../assets/images/date.png" alt>
			<div class="menu-item-text">日期</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ItemTypes } from '@/scripts/editor/ItemCreator';

@Component
export default class ToolBar extends Vue {
	// name: 'toolbar',
		/**
		 * 修改当前绘制的目标；
		 */
	public changeDrawTarget(e: any) {
		const ele = this.getElementByClass(e.target, 'menu-item');
		if (!ele) {
			return;
		}

		const classList = ele.className ? ele.className.split(' ') : [];
		this.$store.commit('setDrawType', this.getDrawType(classList[1]));
	}
	public getElementByClass(el: any, className: string): any {
		if (!el) {
			return el;
		}
		const classList = el.className ? el.className.split(' ') : [];
		if (classList.indexOf(className) >= 0) {
			return el;
		}

		return this.getElementByClass(el.parentNode, className);
	}
	public getDrawType(oldType: string) {
		switch (oldType) {
			default:
				return ItemTypes.None;
			case 'line':
				return ItemTypes.Line;
			case 'rect':
				return ItemTypes.Rect;
			// case 'text':
			// 	return ItemTypes.Text;
		}
	}
}
</script>

<style scoped>
.toolbar .menu-item {
	height: 60px;
	line-height: 60px;
	border-bottom: 1px solid #999;
	position: relative;
	cursor: pointer;
}
.toolbar .menu-item-icon {
	width: 30px;
	height: 30px;
	margin: 15px 6px 15px 15px;
	float: left;
}
.toolbar .menu-item-text {
	font-size: 14px;
	float: left;
}
</style>
