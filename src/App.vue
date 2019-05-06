<template>
	<!-- 根节点 -->
	<div id="app">
		<div id="app-header">
			<h1>微打@标签</h1>
		</div>
		<!-- 工具条 -->
		<div id="app-banner">
			<menu-bar></menu-bar>
		</div>
		<div id="app-content">
			<!-- </div> -->
			<div class="content-left">
				<tool-bar/>
			</div>
			<div class="content-center">
				<Editor/>
			</div>
			<div class="content-right">
				<router-view/>
			</div>
		</div>
		<div id="app-footer">CopyRight</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
//
import ToolBar from './components/ToolBar.vue';
import MenuBar from '@/components/MenuBar.vue';
import Editor from './components/Editor.vue';

@Component({
	components: {
		ToolBar,
		MenuBar,
		Editor,
	},
})
export default class App extends Vue {}
</script>

<style lang="scss">
/* 相关宽高设置100%，用于撑满这个空间 */
html,
body,
#app {
	width: 100%;
	height: 100%;
}
body {
	min-width: 930px;
	min-height: 700px;
}
#app {
	position: relative;
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
/* 主视图布局样式 */
#app-header,
#app-footer,
#app-banner,
#app-content {
	position: absolute;
	width: 100%;
}
#app-header {
	top: 0;
	height: 56px;
	line-height: 56px;
	text-align: center;
	letter-spacing: 6px;
	background: #707070;
	color: #fff;
	border-bottom: 2px solid #fff;
}
#app-header h1 {
	font-size: 30px;
}
#app-footer {
	bottom: 0;
	height: 30px;
	line-height: 30px;
	background-color: black;
	color: #fff;
	text-align: center;
}
#app-banner {
	top: 0;
	margin-top: 56px;
	height: 50px;
	background: #f0f5fa;
	border-bottom: 1px solid #999;
	padding: 2px 0 1px 0;
}
#app-content {
	top: 110px;
	bottom: 30px;
	/* display: flex;*/
}
#content-table {
	width: 100%;
	height: 100%;
	border: 0;
	border-spacing: 0;
}
.content-left {
	position: absolute;
	left: 0;
	top: 0;
	width: 110px;
	height: 100%;
	background: #f0f5fa;
	border-right: 1px solid #999;
	vertical-align: top;
}
.content-right {
	position: absolute;
	right: 0;
	top: 0;
	width: 352px;
	height: 100%;
	background: #f0f5fa;
	border: 1px solid #000;
}
.content-center {
	/* flex: 1; */
	position: absolute;
	left: 110px;
	right: 352px;
	top: 0;
	bottom: 0;
	background: rgba(112, 112, 112, 0.23);
}
</style>
