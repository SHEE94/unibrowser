<template>
	<view class="content">
		<view class="">
			<uni-search-bar @confirm="searchconfirm" @input="keyword" :value="val" :focus="true"/>
		</view>
		<view class="bar">
			<view @tap="clearhistory" v-if="searchHistory.length>0">
				清除
			</view>
		</view>
		<view class="search-history">
			<view  class="tag" v-for="(item,index) in searchHistory" :key="index" @click="tohere(item)">{{item}}</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				val:'',
				searchHistory:[]
			};
		},
		onLoad() {
			this.val = app.globalData.searUrl;
			this.searchHistory = uni.getStorageSync('search-history')||[];
		},
		methods:{
			clearhistory(e){
				uni.removeStorageSync('search-history')
				this.searchHistory = []
				uni.showToast({
					title:'清理完成',
					icon:'success'
				})
			},
			tohere(item){
				uni.$emit('LOAD-URL',{url:item})
				uni.navigateBack({
					animationType:'fade-out'
				})
			},
			keyword(e){
				this.val = e
			},
			searchconfirm(){
				this.searchHistory.unshift(this.val);
				uni.setStorageSync('search-history',this.searchHistory);
				uni.$emit('LOAD-URL',{url:this.val})
				uni.navigateBack({
					animationType:'fade-out'
				})
				// uni.reLaunch({
				// 	url:'/pages/browser/browser?url='+this.val
				// })
			}
		}
	}
</script>

<style lang="less">
.content{
	padding:60upx 30upx 30upx;
	box-sizing: border-box;
}
.search-history{
	display: flex;
	flex-wrap: wrap;
	.tag{
		padding: 8upx 10upx;
		margin: 20upx;
		background-color: #eee;
		border-radius: 4upx;
	}
}
.bar{
		padding: 15upx 50upx;
		margin-bottom: 30upx;
		display: flex;
		justify-content: flex-end;
		box-sizing: border-box;
		width: 100%;
	}
</style>
