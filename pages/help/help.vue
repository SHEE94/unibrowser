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
				app.globalData.richtext = await db.get('help');
				if(app.globalData.richtext.length>0){
					this.node = app.globalData.richtext[0].rich_text
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
