<!--
 * @Author: aa
 * @Date: 2021-08-25 10:44:36
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-10-14 10:24:35
 * @Descripttion: 
-->
<template>
	<div class="app-wrapper">
		<!-- 顶部 -->
		<navbar class="sidebar-container" />
		<div class="main-container">
			<div class="left">
				<sidebar />
			</div>
			<div class="right">
				<app-main />
			</div>
		</div>
	</div>
</template>

<script>
import { reactive,ref,toRefs } from "vue";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar/index";
import AppMain from "./components/AppMain";

export default {
	name: "Layout",
	provide() {
		return {
			reload: this.reload
		}
	},
	components: {
		Navbar,
		Sidebar,
		AppMain
	},
	setup() {
		const state=reactive({
			reloadActive: true
		});

		const reload=() => {
			this.reloadActive=false
			this.$nextTick(function() {
				this.reloadActive=true
			})
		}

		return {
			...toRefs(state)
		};
	}
};
</script>

<style lang="scss" scoped>
.app-wrapper {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
.main-container {
	flex: 1;
	display: flex;
	overflow-y: auto;
	width: 100%;
	.left {
		width: 208px;
		height: 100%;
	}
	.right {
		flex: 1;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		overflow: auto;
	}
}
</style>
