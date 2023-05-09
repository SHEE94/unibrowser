<template>
	<view class="content">
		<view class="">
			<uni-search-bar @confirm="searchconfirm" @input="keyword" :value="val" :focus="true"/>
		</view>
		<view class="bar">
			<view @tap="clearhistory" v-if="searchHistory.length>0">
				{{$t("search.tips.1")}}
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
					title:this.$t("search.tips.2"),
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
	padding:30px 15px 15px;
	box-sizing: border-box;
}
.search-history{
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	overflow-x: hidden;
	.tag{
		padding: 4px 5px;
		margin: 10px;
		background-color: #eee;
		border-radius: 2px;
		max-width: 300px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}
.bar{
		padding: 7px 25px;
		margin-bottom: 15px;
		display: flex;
		justify-content: flex-end;
		box-sizing: border-box;
		width: 100%;
	}
</style>
