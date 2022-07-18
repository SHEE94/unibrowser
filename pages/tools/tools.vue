<template>
	<view class="content">
		<view class="list" @tap="addScriptOnline">
			<view class="left-info"><view class="label">添加在线脚本</view></view>
			<view class="arr iconfont icon-right"></view>
		</view>
		<view class="list" @tap="addScriptLoacal">
			<view class="left-info"><view class="label">添加本地脚本</view></view>
			<view class="arr iconfont icon-right"></view>
		</view>
		<navigator class="list" url="script-edit-tool/script-edit-tool">
			<view class="left-info"><view class="label">编辑脚本</view></view>
			<view class="arr iconfont icon-right"></view>
		</navigator>
		<navigator url="../script-list/script-list" class="list">
			<view class="left-info"><view class="label">脚本列表</view></view>
			<view class="arr iconfont icon-right"></view>
		</navigator>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {};
	},
	methods: {
		addScriptOnline(e) {
			uni.navigateTo({
				url:'/pages/online_script/online_script'
			})
			
		},
		addScriptLoacal(e) {
			let wv = app.globalData.wv;
			if (wv) {
				uni.showToast({
					icon: 'none',
					title: '暂不可添加'
				});
				return;
			}
			uni.navigateTo({
				url:'../FM/FM'
			})
		}
	}
};
</script>

<style lang="less">
.content {
	padding: 30upx 15upx;
	background-color: #eeeeee;
	min-height: 100vh;
	box-sizing: border-box;
}

.list {
	display: flex;
	margin-bottom: 20upx;
	align-items: center;
	justify-content: space-between;
	padding: 15upx 20upx;
	background-color: #f7f7f7;
	.left-info {
		display: flex;
		align-items: center;
		.icon {
			margin-right: 10upx;
			font-size: 30upx;
			margin-bottom: -5upx;
		}
	}
}
</style>
