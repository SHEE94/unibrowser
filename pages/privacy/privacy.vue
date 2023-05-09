<template>
	<view class="content">
		<view class="list">
			<view class="left-info">
				<view class="label">{{$t("privacy.location")}}</view>
				<view class="desc">{{$t("privacy.location.desc")}}</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.location" data-type="location" @change="change" />
			</view>
		</view>

		<view class="list">
			<view class="left-info">
				<view class="label">{{$t("privacy.cookie")}}</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.cookies" data-type="cookies" @change="change" />
			</view>
		</view>
		<view class="list">
			<view class="left-info">
				<view class="label">{{$t("privacy.clipboard")}}</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.clipboard" data-type="clipboard" @change="change" />
			</view>
		</view>
		<view class="list">
			<view class="left-info"><view class="label">{{$t('privacy.redirect')}}</view></view>
			<view class="arr"><switch :checked="settingConfig.redirect" data-type="redirect" @change="change" /></view>
		</view>
		<view class="list">
			<view class="left-info">
				<view class="label">{{$t('privacy.timer')}}</view>
				<view class="desc">{{$t('privacy.timer.desc')}}</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.timer" data-type="timer" @change="change" />
			</view>
		</view>
		<view class="list">
			<view class="left-info">
				<view class="label">{{$t('privacy.addScript')}}</view>
				<view class="desc">{{$t('privacy.addScript.desc')}}</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.addScript" data-type="addScript" @change="change" />
			</view>
		</view>
		
		<view class="list">
			<view class="left-info">
				<view class="label">{{$t('privacy.nonstandardTag')}}</view>
				<view class="desc">{{$t('privacy.nonstandardTag.desc')}}</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.nonstandardTag" data-type="nonstandardTag" @change="change" />
			</view>
		</view>
		<view class="list">
			<view class="left-info">
				<view class="label">{{$t('privacy.fingerprint')}}</view>
				<view class="desc">{{$t('privacy.fingerprint.desc')}}</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.fingerprint" data-type="fingerprint" @change="change" />
			</view>
		</view>
		
		<view class="list">
			<view class="left-info">
				<view class="label">{{$t('privacy.auto.download')}}</view>
				<view class="desc">{{$t('privacy.auto.download.desc')}}</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.autoDownload" data-type="autoDownload" @change="change" />
			</view>
		</view>
		
		
		<view class="list">
			<view class="left-info">
				<view class="label">{{$t('privacy.otherWebsite')}}</view>
				<view class="desc">{{$t('privacy.otherWebsite.desc')}}</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.otherWebsite" data-type="otherWebsite" @change="change" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				settingConfig: {}
			};
		},
		onLoad() {
			let settingConfig = uni.getStorageSync('settingConfig');

			if (settingConfig) {
				this.settingConfig = settingConfig;
			}
		},
		onHide() {
			uni.setStorageSync('settingConfig', this.settingConfig);
		},
		onUnload() {
			uni.setStorageSync('settingConfig', this.settingConfig);
		},
		methods: {
			change(e) {
				let val = e.detail.value;
				let _type = e.currentTarget.dataset.type;
				this.settingConfig[_type] = val
			}
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
			
			width: 75%;
			.desc {
				font-size: 10px;
				color: #999;
			}

			.icon {
				margin-right: 5px;
				font-size: 15px;
				margin-bottom: -2px;
			}
		}

	}
</style>