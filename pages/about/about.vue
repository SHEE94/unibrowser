<template>
	<view class="content">
		<view>当前版本：{{version}}</view>
		<rich-text :nodes="node"></rich-text>
	</view>
</template>

<script>
	
	const app = getApp()
	export default {
		data() {
			return {
				version:'1.0.0',
				node:[]
			};
		},
		onLoad() {
			
			let that = this;
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				that.version = widgetInfo.version
			})
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
