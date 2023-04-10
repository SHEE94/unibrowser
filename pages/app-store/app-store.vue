<template>
	<view>
		<view class="app-content">
			<view class="title">
				精选应用
			</view>
			
		</view>
	</view>
</template>

<script>

export default {
	data() {
		return {
			tabCurrent:0,
			id:'',
			scrollleft:0,
			list: [
				{
					cate: '4399',
					list: [
						{
							title: '大大的',
							privew: '',
							url: 'http://szhong.4399.com/4399swf/upload_swf/ftp34/liuxinyu/20201221/1/gameIndex.html'
						}
					]
				}
			]
		};
	},

	activated() {
		this.$refs.dataref.loadMore()
	},
	
	methods: {
		
		handleLoad(data, ended, pagination){
			this.dataList = data
			this.id = data[this.tabCurrent]._id
			console.log(data, ended, pagination)
		},
		changeTab(index){
			let fqa = uni.getStorageSync('app-fqa');
			if(!fqa){
				setTimeout(()=>{
					this.scrollleft = 1000
					setTimeout(()=>{
						this.scrollleft = 0
					},500)
				},500)
				uni.setStorageSync('app-fqa',true);
			}
			this.tabCurrent = index;
			this.id = this.dataList[index]._id
		},
		scrolltolower(){
			this.$refs.dataref.loadMore()
		}
	}
};
</script>

<style lang="less">
.app-content {
	display: flex;
	flex-direction: column;
	padding: 15px;
	padding-top: 60px;
	box-sizing: border-box;
	.title {
		padding-bottom: 15px;
		background-color: #fff;
		border-bottom: 1px solid #ECAD9E;
		margin-bottom: 15px;
		font-weight: bold;
	}
	.tab-bar {
		white-space: nowrap;
		.tab {
			display: inline-block;
			
			margin: 0 10px;
		}
	}
	.app-row {
		width: 100%;
		margin-bottom: 15px;
		display: flex;
		justify-content: stretch;
		flex-wrap: wrap;
		align-content: space-around;
		.app-col {
			width: 20%;
			height: 80px;
			margin: 10px 0;
			display: flex;
			align-items: center;
			flex-direction: column;
			.preview {
				width: 50px;
				background-color: #eee;
				height: 50px;
				border-radius: 8upx;
				overflow: hidden;
			}
			.name {
				font-size: 11px;
				width: 50px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
	}
}
</style>
