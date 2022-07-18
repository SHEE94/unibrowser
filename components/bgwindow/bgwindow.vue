<template>
	<view>
		<view class="bg-content">
			<view class="list-content" :class="show">
				<view class="list" v-for="(item, index) in list" :key="index" @click="openBgWebview(index)">
					<view class="title">{{ item.getTitle() }}</view>
					<view style="color: #999;" @click="close(item,index)">关闭</view>
				</view>
			</view>
			<view class="btn-list">
				<view class="btn" @click="openNew">新建窗口</view>
				<view class="btn" @click="closeAll">全部关闭</view>
			</view>
		</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	name: 'bgwindow',
	data() {
		return {
			list: [],
			show:''
		};
	},
	mounted() {
		this.list = app.globalData.webviewList;
		
		this.show = 'ac'	
	},
	methods:{
		openBgWebview(index){
			uni.$emit('SWITCH-WEBVIEW',{index:index})
			this.$emit('close')
		},
		openNew(){
			uni.$emit('OPEN-NEW-WINDOW')
			this.$emit('close')
		},
		close(item,index){
			item.close()
			uni.$emit('CLOSE-WINDOW',index)
			this.$emit('close')
		},
		closeAll(){
			this.list.forEach(e=>{
				e.close()
			})
			uni.$emit('CLOSE-WINDOW-ALL')
			this.$emit('close')
		}
	}
};
</script>

<style lang="less">
.bg-content {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	.list-content {
		padding: 30upx 30upx 120upx;
		background-color: #fff;
		border-radius: 10px 10px 0 0;
		position: relative;
		transform: translateY(100%);
		opacity: 0;
		transition: all .2s;
		.list {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20upx 0;
			.title{
				width: 70%;
				color: #515151;
				font-size: 26upx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
	.ac{
		opacity: 1;
		transform: translateY(0%);
	}
	.btn-list {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 88upx;
		display: flex;
		justify-content: space-between;
		background: #ffffff;
		.btn {
			flex: 1;
			text-align: center;
			line-height: 88upx;
			color: #515151;
		}
	}
}
</style>
