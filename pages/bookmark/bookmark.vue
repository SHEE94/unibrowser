<template>
	<view class="content">
		<view v-if="bookmark.length == 0" style="top: 40px;color: #666666;font-size: 28upx;text-align: center;width: 100%;">
			{{$t("bookmark.tips.3")}}
		</view>
		<view class="bookmark-list" @click="tohere" :data-index="index" :data-url="item.url" @longpress="edit" v-for="(item,index) in bookmark" :key="index">
			<view class="title">{{item.title}}</view>
			<view class="url">{{item.url}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bookmark:[]
			};
		},
		onLoad(options) {
			this.bookmark = uni.getStorageSync('bookmark')||[]
			this.from = options.from
		},
		onShow() {
			this.bookmark = uni.getStorageSync('bookmark')||[]
		},
		methods:{
			tohere(e){
				// uni.$emit('BOOK-MARK',{url:e.currentTarget.dataset.url})
				if(this.from == 'home'){
					uni.redirectTo({
						url:'/pages/browser/browser',
						success() {
							uni.$emit('BOOK-MARK',{url:e.currentTarget.dataset.url})
						}
					})
					return;
				}
				uni.navigateBack({
					success:()=>{
						uni.$emit('BOOK-MARK',{url:e.currentTarget.dataset.url})
					}
				})
			},
			edit(e){
				let index = e.currentTarget.dataset.index;
				uni.showActionSheet({
					itemList:[this.$t("bookmark.tips.4"),this.$t("bookmark.tips.5"),this.$t("bookmark.tips.6")],
					success: (res) => {
						if(res.tapIndex == 0){
							this.bookmark.splice(index,1);
							uni.setStorageSync('bookmark',this.bookmark)
						}else if(res.tapIndex == 1){
							let homebookmark = uni.getStorageSync('homebookmark')||[];
							homebookmark.unshift(this.bookmark[index])
							uni.setStorageSync('homebookmark',homebookmark)
							uni.showToast({
								icon:'success',
								title:this.$t("bookmark.tips.7")
							})
						} else if(res.tapIndex == 2){
							uni.navigateTo({
								url:'../add-bookmark/add-bookmark?index='+index
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
.content{
	min-height: 100vh;
	box-sizing: border-box;
	background-color: #EEEEEE;
	padding:15px;
	.bookmark-list{
		background-color: #f7f7f7;
		margin-bottom: 15px;
		padding: 7px 15px;
		box-sizing: border-box;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		.title{
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.url{
			color: #ccc;
			font-size: 12px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
}
</style>
