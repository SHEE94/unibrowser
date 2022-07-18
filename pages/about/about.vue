<template>
	<view class="content">
		<rich-text :nodes="node"></rich-text>
	</view>
</template>

<script>
	import db from '@/utils/db.js';
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
			async getdata(){
				app.globalData.about_rich_text = await db.get('help');
				if(app.globalData.about_rich_text.length>0){
					this.node = app.globalData.about_rich_text[0].about_rich_text
				}
				console.log(this.node)
				// editor.txt.setJSON(data[0])
			}
		}
	}
</script>

<style lang="less">
.content{
	padding: 30upx;
	box-sizing: border-box;
}
</style>
