<template>
	<view>
		<view class="top-bar">
			<view @click="clearAll">清空</view>
		</view>
		<view class="list-content">
			<view class="list" v-for="(item,index) in history" :key="index" @longpress="more(item,index)" @click="tonav(item.url)">
				<view class="title">{{item.title}}</view>
				<view class="url">{{item.url}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				history:[]
			};
		},
		mounted() {
			this.history = uni.getStorageSync('history')||[]
			
		},
		methods:{
			clearAll(){
				uni.showModal({
					content:'确认清空',
					success: (res) => {
						if(res.confirm){
							this.history = [];
							uni.setStorageSync('history',[])
						}
					}
				})
			},
			tonav(url){
				uni.$emit('HISTORY-MAKE',{type:-1,url:url})
				uni.navigateBack({
					animationType:'fade-out'
				})
			},
			more(item,index){
				uni.showActionSheet({
					itemList:['新窗口打开','后台打开','删除','复制链接'],
					success: (res) => {
						uni.$emit('HISTORY-MAKE',{type:res.tapIndex,url:item.url})
						if(res.tapIndex == 2){
							this.history.splice(index,1);
							uni.setStorageSync('history',this.history)
						}else if(res.tapIndex == 3){
							uni.setClipboardData({
								data:item.url,
								success: (res) => {
									plus.nativeUI.toast('已复制到剪切板');
								}
							})
						}else{
							uni.navigateBack({
								animationType:'fade-out'
							})
						}
						
					}
				})
			}
		}
	}
</script>

<style lang="less">
.top-bar{
	height: 70upx;
	background-color: #f7f7f7;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	padding: 0 40upx;
	color: #515151;
	border-top:1px solid #ededed;
}
.list-content{
	padding-top: 75upx;
	.list{
		padding: 10upx 30upx;
		font-size: 28upx;
		color: #515151;
		border-bottom: 1px solid #efefef;
		.url{
			color: #999999;
			white-space: nowrap;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}
</style>
