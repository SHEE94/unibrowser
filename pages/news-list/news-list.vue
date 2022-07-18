<template>
	<view class="content">
		<unicloud-db v-slot:default="{data, loading, error, options}" collection="news_line" style="width: 100%;height: 100%;">
			<view v-if="loading" style="padding: 30upx; text-align: center;">正在更新</view>
			<view v-if="error">{{error.message}}</view>
			<view v-else>
				<view class="list" v-for="(item,index) in data" :key="index" :data-url="item.url" @tap="openWeb">
					{{item.title}}
				</view>
			</view>
		</unicloud-db>
		
	</view>
</template>

<script>
	import db from '@/utils/db.js'
	export default {
		name:'uniNew',
		data() {
			return {
				
			};
		},
		onLoad() {
			// db.get('news_line').then(res=>{
			// 	console.log(res)
			// })
		},
		methods:{
			openWeb(e){
				let url = e.currentTarget.dataset.url;
				uni.navigateTo({
					url:'/pages/browser/browser?url='+url
				})
			}
		}
	}
</script>

<style lang="less">
.content{
	min-height: 100vh;
	height: 100%;
	background: #eee;
	padding:100upx 30upx 30upx;
	box-sizing: border-box;
	.list{
		background: #F7F7F7;
		padding: 15upx;
		margin-bottom: 10upx;
	}
}
</style>
