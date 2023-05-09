<template>
	<view class="content">
		<view class="list">
			<view class="left-info">
				<view class="label">{{$t('setting.pullLoad')}}</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.pullLoad" @change="changePullload" />
			</view>
		</view>
		<view class="list">
			<view class="left-info">
				<view class="label">{{$t('setting.resLog')}}</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.resLog" @change="changeLog" />
			</view>
		</view>
		<view class="list">
			<view class="left-info">
				<view class="label">{{$t('setting.dormancy')}}</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.dormancy" data-type="dormancy" @change="change" />
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
				<view class="label">{{$t("setting.lastPage")}}</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.lastPage" data-type="lastPage" @change="change" />
			</view>
		</view>
		<!-- <view class="list">
			<view class="left-info">
				<view class="label">每日背景图</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.bingImage" data-type="bingImage" @change="change" />
			</view>
		</view> -->
		
		<view class="list" @click="clear">
			<view class="left-info">
				<view class="label">{{$t('setting.clearcache')}}</view>
			</view>
			<view class="arr">

			</view>
		</view>

		<view class="list">
			<view class="left-info">
				<view class="label">{{$t('setting.downloadCurrent')}}</view>
			</view>
			<view class="arr">
				<picker mode="selector" :range="downloadType" @change="changedownloadType">
					<view style="padding: 0 10px;color: #525252;font-size: 14px;">
						{{ downloadType[settingConfig.downloadCurrent] }}
					</view>
				</picker>
			</view>
		</view>
		<view class="list">
			<view class="left-info">
				<view class="label">{{$t('setting.language')}}</view>
			</view>
			<view class="arr iconfont icon-righ">
				<picker mode="selector" range-key="label" :range="settingConfig.language" @change="changelanguage">
					<view style="padding: 0 10px;color: #525252;font-size: 14px;width: 100px;text-align: right;">
						{{ settingConfig.language[settingConfig.langCurrnt].label }}</view>
				</picker>
			</view>
		</view>
		<!-- <view class="list">
			<view class="left-info"><view class="label">开启左右切换窗口</view></view>
			<view class="arr"><switch :checked="settingConfig.switchWindow" @change="switchWindow" /></view>
		</view> -->
		<view class="list" v-for="(item, index) in menuList" :key="index" :data-key="item.key" :data-to="item.to"
			@click="tohere">
			<view class="left-info">
				<view class="label">{{ item.name }}</view>
			</view>
			<view class="arr iconfont icon-right"></view>
		</view>
		<!-- <view class="list" @click="checkupdate">
			<view class="left-info"><view class="label">检查更新</view></view>
			<view class="arr iconfont icon-right"></view>
		</view> -->
		<view class="list" @click="reset">
			<view class="left-info">
				<view class="label">{{$t("setting.default")}}</view>
			</view>
			<view class="arr iconfont icon-right"></view>
		</view>

		<uni-popup ref="popup" type="center">
			<uni-popup-dialog mode="base" :title="updatainfo.title"
				:content="updatainfo.contents + '\n版本：' + updatainfo.version" :duration="2000" :before-close="true"
				@close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	const app = getApp();
	import update from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	import settingConfigFile from '@/utils/settingConfig.js'
	export default {
		data() {
			return {
				updatainfo: {
					title: '',
					contents: '',
					version: ''
				},
				settingConfig: JSON.parse(JSON.stringify(settingConfigFile)),
				downloadType: [this.$t('setting.download.1'), this.$t('setting.download.2'), this.$t(
					'setting.download.3')],
				menuList: [{
						icon: 'icon-shuqian',
						name: this.$t('setting.web-log'),
						to: '/pages/web-log/web-log',
						key: 'web-log'
					},
					{
						icon: 'icon-shuqian',
						name: this.$t('setting.intercept'),
						to: '/pages/intercept/intercept',
						key: 'intercept'
					},
					{
						icon: 'icon-shuqian',
						name: this.$t('setting.ua_set'),
						to: '/pages/ua_set/ua_set',
						key: 'ua_set'
					},

					{
						icon: 'icon-shuqian',
						name: this.$t('setting.privacy'),
						to: '/pages/privacy/privacy',
						key: 'privacy'
					},
					{
						icon: 'icon-shuqian',
						name: this.$t('setting.tools'),
						to: '/pages/tools/tools',
						key: '/pages/tools/tools'
					},
					// {
					// 	icon: 'icon-shuqian',
					// 	name: '帮助',
					// 	to: '/pages/help/help',
					// 	key: 'help'
					// },
					{
						icon: 'icon-shuqian',
						name: this.$t('setting.about'),
						to: '/pages/about/about',
						key: 'about'
					}
				],
				from: null
			};
		},
		filters: {
			showLang(item) {
				if (!item) {
					return this.settingConfig.language.find(e => e.default).label
				}
				return item.find(e => e.default).label
			}
		},
		onLoad(options) {
			if (options.from) {
				this.from = options.from;
			}
			let settingConfig = uni.getStorageSync('settingConfig');
			if (settingConfig) {
				this.settingConfig = {...this.settingConfig,...settingConfig};
				// uni.removeStorageSync('settingConfig')
			}
		},
		onShow() {
			let settingConfig = uni.getStorageSync('settingConfig');
			if (settingConfig) {
				this.settingConfig = settingConfig;
				// uni.removeStorageSync('settingConfig')
			}
		},
		onHide() {
			uni.setStorageSync('settingConfig', this.settingConfig);
		},
		onUnload() {
			uni.setStorageSync('settingConfig', this.settingConfig);
		},
		methods: {
			reset() {
				uni.removeStorageSync('settingConfig');
				uni.removeStorageSync('historyLogArr')
				this.settingConfig = app.globalData.settingConfig;
				uni.showToast({
					icon: 'success',
					title: this.$t("setting.reDefault")
				});
				
				setTimeout(() => {
					uni.navigateBack({});
				}, 1500);
			},
			clear() {
				uni.$emit('CLEAR-CACHE');
				uni.showToast({
					icon: 'success',
					title:  this.$t("setting.cleared")
				})
			},
			changelanguage(e) {
				let val = e.detail.value;
				let code = this.settingConfig.language[val].code
				this.settingConfig.langCurrnt = val
				uni.setStorageSync('settingConfig', this.settingConfig);
				uni.setLocale(code);
				this.$i18n.locale = code;
			},
			// 选择下载器
			changedownloadType(e) {
				let val = e.detail.value;
				this.settingConfig.downloadCurrent = val;
				if (val == 1) {
					let isInstallADM = plus.runtime.isApplicationExist({
						pname: 'com.dv.adm.pay'
					});
					if (!isInstallADM) {
						uni.showModal({
							icon: 'none',
							title:this.$t("setting.tips.1")
						});
					}
				} else if (val == 2) {
					let isInstallIDM = plus.runtime.isApplicationExist({
						pname: 'idm.internet.download.manager.plus'
					});
					if (!isInstallIDM) {
						uni.showModal({
							icon: 'none',
							title:this.$t("setting.tips.2")
						});
					}
				}

				uni.showToast({
					icon: 'none',
					title:this.$t("setting.tips.3")
				});
			},
			confirm() {
				uni.showLoading({
					title: this.$t("setting.tips.4")
				});
				uni.downloadFile({
					url: this.updatainfo.url,
					success: downloadResult => {
						uni.hideLoading();
						if (downloadResult.statusCode === 200) {
							this.install(downloadResult.tempFilePath);
						}
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},
			close() {
				this.$refs.popup.close();
			},
			install(tempFilePath) {
				plus.runtime.install(
					tempFilePath, {
						force: false
					},
					function() {
						console.log('install success...');
						plus.runtime.restart();
					},
					function(e) {
						uni.showToast({
							icon: 'none',
							title: '安装出错'
						});
						console.error('install fail...');
					}
				);
			},
			async checkupdate() {
				let that = this;
				uni.showLoading({
					title: '检查更新'
				});

				try {
					let success = await update();
					uni.hideLoading();
				} catch (e) {

					uni.hideLoading();
				}
				setTimeout(() => {
					uni.hideLoading();
				}, 10000);
			},
			tohere(e) {
				let key = e.currentTarget.dataset.key,
					to = e.currentTarget.dataset.to;
				uni.navigateTo({
					url: to
				});
			},
			changePullload(e) {
				uni.showToast({
					icon: 'none',
					title: this.$t("setting.tips.5")
				});
				this.settingConfig.pullLoad = e.detail.value;
			},
			switchWindow(e) {
				this.settingConfig.switchWindow = e.detail.value;
			},
			dormancy(e) {

			},
			changeLog(e) {
				uni.showToast({
					icon: 'none',
					title: this.$t("setting.tips.5")
				});
				let val = e.detail.value;
				this.settingConfig.resLog = val;
			},
			change(e) {
				let _type = e.currentTarget.dataset.type;
				this.settingConfig[_type] = e.detail.value;
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
		.arr{
			display: flex;
			justify-content: flex-end;
			min-width: 100px;
		}
	}
</style>