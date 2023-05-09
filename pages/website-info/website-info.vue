<template>
	<view class="content">
		<view class="item">
			<view class="title">{{$t("website.hostname")}}：</view>
			<view class="text">{{info.host}}</view>
		</view>
		<view class="item">
			<view class="title font24">{{$t("website.speed")}}：</view>
			<view class="text font20">{{info.speed}}ms</view>
		</view>
		<view class="item">
			<view class="title font24">{{$t("website.scriptCount")}}：</view>
			<view class="text font20">{{info.scriptCount}}</view>
		</view>
		<view class="item">
			<view class="title font24">{{$t("website.addLinkCount")}}：</view>
			<view class="text font20">{{info.addLinkCount}}</view>
		</view>
		<view class="item">
			<view class="title font24">{{$t("website.storageCount")}}：</view>
			<view class="text font20">{{info.storageCount}}</view>
		</view>
		<view class="item">
			<view class="title font24">{{$t("website.clipboardCount")}}：</view>
			<view class="text font20">{{info.clipboardCount}}</view>
		</view>
		<view class="item">
			<view class="title font24">{{$t("website.timerCount")}}：</view>
			<view class="text font20">{{info.timerCount}}</view>
		</view>
		<view class="item">
			<view class="title font24">{{$t("website.addNodeCount")}}：</view>
			<view class="text font20">{{info.addNodeCount}}</view>
		</view>
		<view class="item">
			<view class="title font24">{{$t("website.location")}}：</view>
			<view class="text font20">{{info.location}}</view>
		</view>
		
		<view class="website-setting">
			<view class="website-setting-title">
				{{$t("website.tips.1")}}
			</view>
			<view class="setting-content">
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
						<view class="label">{{$t('setting.videoPLay')}}</view>
					</view>
					<view class="arr">
						<switch :checked="settingConfig.videoPLay" data-type="videoPLay" @change="change" />
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
				
				<view class="list">
					<view class="left-info">
						<view class="label">Developer</view>
					</view>
					<view class="arr">
						<switch :checked="settingConfig.dev" data-type="dev" @change="change" />
					</view>
				</view>
			</view>
		</view>
		
		<button class="reset" @click="reset">{{$t("website.tips.2")}}</button>
		<button type="primary" @click="save">{{$t("bookmark.save")}}</button>
	</view>
</template>

<script>
	const app = getApp()
	import websiteSetting from '@/utils/websiteSetting.js'
	export default {
		data() {
			return {
				info: {},
				settingConfig:JSON.parse(JSON.stringify(websiteSetting))
			};
		},
		
		onLoad(options) {
			let info = uni.getStorageSync('statiData')
			if (!app.globalData.statiData) {
				this.info = info
			} else {
				this.info = app.globalData.statiData
				uni.setStorageSync('statiData', app.globalData.statiData)
			}
			let host = this.info.host;
			let websiteSettingList = this.websiteSettingList = uni.getStorageSync('websiteSetting')||{};
			
			
			let settingConfig = uni.getStorageSync('settingConfig');
			
			Object.keys(this.settingConfig).forEach(key=>{
				Object.keys(settingConfig).forEach(key2=>{
					if(key == key2){
						this.settingConfig[key] = settingConfig[key2]
					}
				})
			})
			
			if(!websiteSettingList[host]){
				websiteSettingList[host] = this.settingConfig;
			}else{
				this.settingConfig = websiteSettingList[host]
			}

		},
		methods:{
			save(){
				this.websiteSettingList[this.info.host] = this.settingConfig
				uni.setStorageSync('websiteSetting',this.websiteSettingList)
				uni.showToast({
					icon:'success'
				})
			},
			change(e) {
				let val = e.detail.value;
				let _type = e.currentTarget.dataset.type;
				this.settingConfig[_type] = val
			},
			reset(){
				this.settingConfig = websiteSetting
				uni.showToast({
					title:this.$t("website.tips.3")
				})
			}
		}
	}
</script>

<style lang="less">
	.content {
		padding: 60px 10px;

		.item {
			display: flex;
			align-items:center;
			padding: 15px 0;
			border-bottom: 1px solid #999;
			.title {
				font-size: 30px;
				width: 70%;
				margin-right: 5px;
			}

			.text {
				font-size: 22px;
				color: #999;
			}

			.font24 {
				font-size: 22px;
			}

			.font20 {
				font-size: 20px;
				color: #008585;
			}
		}
		.website-setting{
			
			padding-top: 15px;
			.website-setting-title{
				font-size: 30px;
				
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
		}
	}
	.reset{
		margin-bottom: 10px;
	}
</style>