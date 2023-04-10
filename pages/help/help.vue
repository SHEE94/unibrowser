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
			this.getdata()
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
