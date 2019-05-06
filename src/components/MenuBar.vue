<template>
	<div class="menubar">
		<!-- 新建 -->
		<div class="menu-item" id="menu-item-new">
			<img class="menu-item-icon" src="../assets/images/new_construction.png" alt>
			<div class="menu-item-text">新建</div>
		</div>
		<!-- 标签模板 -->
		<div class="menu-item" id="menu_template">
			<img class="menu-item-icon" src="../assets/images/template.png" alt>
			<div class="menu-item-text">标签模板</div>
		</div>
		<div class="menu-item" id="menu_save">
			<img class="menu-item-icon" src="../assets/images/save.png" alt>
			<div class="menu-item-text">保存</div>
		</div>
		<div class="menu-item">
			<img class="menu-item-icon" src="../assets/images/save_as.png" alt>
			<div class="menu-item-text">另存为</div>
		</div>
		<div class="menu-item" id="menu_copy">
			<img class="menu-item-icon" src="../assets/images/copy.png" alt>
			<div class="menu-item-text">拷贝</div>
		</div>
		<div class="menu-item" id="menu_lock">
			<img class="menu-item-icon" src="../assets/images/lock.png" alt>
			<div class="menu-item-text">锁定</div>
		</div>
		<div class="menu-item">
			<img class="menu-item-icon" src="../assets/images/uploading.png" alt>
			<div class="menu-item-text">上传</div>
		</div>
		<div class="menu-item" @click="doPrint">
			<img class="menu-item-icon" src="../assets/images/uploading.png" alt>
			<div class="menu-item-text">打印</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MenuBar extends Vue {
	// name: 'menubar',
	/**
	 * doPrint
	 */
	public doPrint() {
		this.$store.commit('doPrint');
	}
}

</script>

<style>
/* 上部工具条 */
.menubar .menu-item {
	width: 60px;
	text-align: center;
	float: left;
	cursor: pointer;
}
.menubar .menu-item-icon {
	width: 30px;
	height: 30px;
	margin: 0 auto;
}
.menubar .menu-item-text {
	font-size: 14px;
}
.menubar #menu-item-new {
	margin-left: 33px;
}
</style>
