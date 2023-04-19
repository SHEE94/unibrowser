<template>
	<view class="content">
		<rich-text :nodes="node"></rich-text>
	</view>
</template>

<script>
	
	const app = getApp()
	export default {
		data() {
			return {
				node:[]
			};
		},
		onLoad() {
			
		},
		methods:{
			
		}
	}
</script>

<style lang="less">
.content{
	padding: 30upx;
	box-sizing: border-box;
}
</style>
