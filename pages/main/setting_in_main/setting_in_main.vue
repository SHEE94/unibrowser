<template>
	<view class="content">

		<!-- <uni-row class="demo-uni-row">
			<uni-col :span="12">
				<view class="demo-uni-col">
					<view class="card-content">
						<view class="header">
							<view>书签</view>
							<view class="setting">...</view>
						</view>
						<view class="body">
							<scroll-view scroll-y="true" class="scroll-content">
								<view>
									<view>1232</view>
									<view>1232</view>
									<view>1232</view>
									<view>1232</view>
									<view>1232</view>
								</view>
							</scroll-view>

						</view>
						<view class="more">更多</view>
					</view>
				</view>
			</uni-col>
			<uni-col :span="12">
				<view class="demo-uni-col">1</view>
			</uni-col>
		</uni-row> -->

		<navigator url="/pages/bookmark/bookmark?from=home" open-type="redirect" class="list">
			<view class="left-info">
				<view class="label">{{$t('main.setting.bookmark')}}</view>
			</view>
			<view class="arr iconfont icon-right"></view>
		</navigator>

		<navigator url="/pages/hitory/hitory?from=home" open-type="redirect" class="list">
			<view class="left-info">
				<view class="label">{{$t('main.setting.hitory')}}</view>
			</view>
			<view class="arr iconfont icon-right"></view>
		</navigator>
		<navigator url="/pages/script-list/script-list" class="list">
			<view class="left-info">
				<view class="label">{{$t('main.setting.extension')}}</view>
			</view>
			<view class="arr iconfont icon-right"></view>
		</navigator>
		<navigator url="/pages/setting/setting" class="list">
			<view class="left-info">
				<view class="label">{{$t('main.setting.more')}}</view>
			</view>
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
		padding: 60px 7px;
		background-color: #eeeeee;
		min-height: 100vh;
		box-sizing: border-box;

		.demo-uni-row {
			width: 100%;

			.demo-uni-col {
				padding: 10px;
				box-sizing: border-box;
			}
		}

		.dark {
			background-color: #d3dce6;
		}

		.light {
			background-color: #e5e9f2;
		}
	}

	.card-content {
		background: linear-gradient(to bottom right,#ffff7f,#aa5500);
		box-shadow: 0 0 5px 1px #999;
		border-radius: 10px;
		padding: 5px;

		.header {
			position: relative;
			text-align: center;
			align-items: center;
			// border-bottom: 1px solid #999;
			display: flex;
			justify-content: center;

			.setting {
				position: absolute;
				top: 0;
				right: 10px;
			}
		}

		.body {
			.scroll-content {
				height: 100px;
			}
		}

		.more {
			margin-top: 5px;
			font-size: 12px;
			text-align: center;
		}
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