<template>
	<view class="content">
		<navigator url="/pages/bookmark/bookmark?from=home" open-type="redirect" class="list">
			<view class="left-info"><view class="label">书签</view></view>
			<view class="arr iconfont icon-right"></view>
		</navigator>
		
		<navigator url="/pages/hitory/hitory?from=home" open-type="redirect" class="list">
			<view class="left-info"><view class="label">历史记录</view></view>
			<view class="arr iconfont icon-right"></view>
		</navigator>
		<navigator url="/pages/script-list/script-list" class="list">
			<view class="left-info"><view class="label">扩展</view></view>
			<view class="arr iconfont icon-right"></view>
		</navigator>
		<navigator url="/pages/setting/setting" class="list">
			<view class="left-info"><view class="label">更多设置</view></view>
			<view class="arr iconfont icon-right"></view>
		</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
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
