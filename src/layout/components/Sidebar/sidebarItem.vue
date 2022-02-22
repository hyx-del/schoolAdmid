<!--
 * @Author: aa
 * @Date: 2021-08-26 13:07:08
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-09-02 20:14:06
 * @Descripttion: 
-->
<template>
	<div v-if="!item.hidden">

		<el-menu-item
			v-if="hasOneShowingChild(item)"
			:index="item.path"
		>
			<i :class="item.meta.icon"></i>
			<template #title>{{ item.meta.title}}</template>
		</el-menu-item>
		<el-submenu
			v-else
			:index="item.path"
		>
			<template #title>
				<i :class="item.meta.icon"></i>
				<span>{{ item.meta.title }}</span>
			</template>

			<template v-for="(cItem, index) of item.children">
				<el-menu-item
					v-if="cItem.hidden!=true"
					:key="index"
					:index="item.path+'/'+cItem.path"
				>
					<i :class="cItem.meta.icon"></i>{{ cItem.meta.title }}
				</el-menu-item>
			</template>

		</el-submenu>
	</div>
</template>

<script>
import { reactive,ref,toRefs,getCurrentInstance,computed } from "vue";
export default {
	props: {
		// route object
		item: {
			type: Object,
			required: true
		},
		isNest: {
			type: Boolean,
			default: false
		},
		basePath: {
			type: String,
			default: ""
		}
	},
	setup(props,ctx) {
		const hasOneShowingChild=item => {
			if(!item.children.length) {
				return false;
			}
			for(const a of item.meta.code) {
				for(const b of item.children[0].meta.code) {
					if(a==b) {
						return true;
					} else {
						return false;
					}
				}
			}
		};
		return {
			hasOneShowingChild
		};
	}
};
</script>

<style lang="scss" scoped>
i {
	margin-right: 8px;
}
.el-menu-item.is-active {
	background: #e4f2ff;
	position: relative;
	&::before {
		content: "";
		width: 4px;
		height: 100%;
		background: #2e8de6;
		display: inline-block;
		position: absolute;
		top: 0;
		left: 0;
	}
}
</style>
