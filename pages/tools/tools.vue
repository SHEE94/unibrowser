<template>
	<view class="content">
		<view class="list" @tap="addScriptOnline">
			<view class="left-info"><view class="label">{{$t("tools.online.script")}}</view></view>
			<view class="arr iconfont icon-right"></view>
		</view>
		<view class="list" @tap="addScriptLoacal">
			<view class="left-info"><view class="label">{{$t("tools.local.script")}}</view></view>
			<view class="arr iconfont icon-right"></view>
		</view>
		<navigator class="list" url="script-edit-tool/script-edit-tool">
			<view class="left-info"><view class="label">{{$t("tools.edit.script")}}</view></view>
			<view class="arr iconfont icon-right"></view>
		</navigator>
		<navigator url="../script-list/script-list" class="list">
			<view class="left-info"><view class="label">{{$t("tools.script.list")}}</view></view>
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
					title:this.$t("tools.tips.1")
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
	padding: 15px 7px;
	background-color: #eeeeee;
	min-height: 100vh;
	box-sizing: border-box;
}

.list {
	display: flex;
	margin-bottom: 10px;
	align-items: center;
	justify-content: space-between;
	padding: 7px 10px;
	background-color: #f7f7f7;
	.left-info {
		display: flex;
		align-items: center;
		.icon {
			margin-right: 5px;
			font-size: 15px;
			margin-bottom: -2px;
		}
	}
}
</style>
