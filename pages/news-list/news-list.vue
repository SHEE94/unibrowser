<template>
	<view class="content">
		
		
	</view>
</template>

<script>
	
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
	padding:50px 15px 15px;
	box-sizing: border-box;
	.list{
		background: #F7F7F7;
		padding: 7px;
		font-size: 14px;
		margin-bottom: 5px;
	}
}
</style>
