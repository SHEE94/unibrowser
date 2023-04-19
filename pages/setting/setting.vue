<template>
	<view class="content">
		<view class="list">
			<view class="left-info"><view class="label">开启下拉刷新</view></view>
			<view class="arr"><switch :checked="settingConfig.pullLoad" @change="changePullload" /></view>
		</view>
		<view class="list">
			<view class="left-info"><view class="label">开启嗅探日志</view></view>
			<view class="arr"><switch :checked="settingConfig.resLog" @change="changeLog" /></view>
		</view>
		<view class="list">
			<view class="left-info"><view class="label">后台窗口休眠</view></view>
			<view class="arr"><switch :checked="settingConfig.dormancy" data-type="dormancy" @change="change" /></view>
		</view>
		<view class="list">
			<view class="left-info"><view class="label">允许网页重定向</view></view>
			<view class="arr"><switch :checked="settingConfig.redirect" data-type="redirect" @change="change" /></view>
		</view>
		<view class="list">
			<view class="left-info"><view class="label">使用系统播放器</view></view>
			<view class="arr"><switch :checked="settingConfig.videoPLay" data-type="videoPLay" @change="change" /></view>
		</view>
		<view class="list">
			<view class="left-info"><view class="label">下载设置</view></view>
			<view class="arr">
				<picker mode="selector" :range="downloadType" @change="changedownloadType">
					<view style="padding: 0 10px;color: #525252;font-size: 14px;">{{ downloadType[settingConfig.downloadCurrent] }}</view>
				</picker>
			</view>
		</view>
		<!-- <view class="list">
			<view class="left-info"><view class="label">开启左右切换窗口</view></view>
			<view class="arr"><switch :checked="settingConfig.switchWindow" @change="switchWindow" /></view>
		</view> -->
		<view class="list" v-for="(item, index) in menuList" :key="index" :data-key="item.key" :data-to="item.to" @click="tohere">
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
			<view class="left-info"><view class="label">恢复默认</view></view>
			<view class="arr iconfont icon-right"></view>
		</view>

		<uni-popup ref="popup" type="center">
			<uni-popup-dialog
				mode="base"
				:title="updatainfo.title"
				:content="updatainfo.contents + '\n版本：' + updatainfo.version"
				:duration="2000"
				:before-close="true"
				@close="close"
				@confirm="confirm"
			></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
const app = getApp();
import update from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
export default {
	data() {
		return {
			updatainfo: {
				title: '',
				contents: '',
				version: ''
			},
			settingConfig: {
				pullLoad: false,
				videoPLay: false,
				canvas: false,
				resLog: false,
				switchWindow: false,
				arm: 220,
				dormancy:false,
				downloadCurrent: 0,
				redirect:true
			},
			downloadType: ['系统下载器', 'ADM下载器', 'IDM+下载器'],
			menuList: [
				{
					icon: 'icon-shuqian',
					name: '嗅探日志',
					to: '/pages/web-log/web-log',
					key: 'web-log'
				},
				{
					icon: 'icon-shuqian',
					name: '拦截',
					to: '/pages/intercept/intercept',
					key: 'intercept'
				},
				{
					icon: 'icon-shuqian',
					name: 'UA设置',
					to: '/pages/ua_set/ua_set',
					key: 'ua_set'
				},

				{
					icon: 'icon-shuqian',
					name: '隐私',
					to: '/pages/privacy/privacy',
					key: 'privacy'
				},
				{
					icon: 'icon-shuqian',
					name: '工具',
					to: '/pages/tools/tools',
					key: '/pages/tools/tools'
				},
				{
					icon: 'icon-shuqian',
					name: '帮助',
					to: '/pages/help/help',
					key: 'help'
				},
				{
					icon: 'icon-shuqian',
					name: '关于',
					to: '/pages/about/about',
					key: 'about'
				}
			],
			from: null
		};
	},
	
	onLoad(options) {
		if (options.from) {
			this.from = options.from;
		}
		let settingConfig = uni.getStorageSync('settingConfig');
		if (settingConfig) {
			this.settingConfig = settingConfig;
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
			this.settingConfig = app.globalData.settingConfig;
			uni.showToast({
				icon: 'success',
				title: '已恢复默认设置'
			});
			setTimeout(() => {
				uni.navigateBack({});
			}, 1500);
		},
		// 选择下载器
		changedownloadType(e) {
			let val = e.detail.value;
			this.settingConfig.downloadCurrent = val;
			if (val == 1) {
				let isInstallADM = plus.runtime.isApplicationExist({ pname: 'com.dv.adm.pay' });
				if (!isInstallADM) {
					uni.showModal({
						icon: 'none',
						title: '你的手机似乎未安装ADM Pro'
					});
				}
			} else if (val == 2) {
				let isInstallIDM = plus.runtime.isApplicationExist({
					pname: 'idm.internet.download.manager.plus'
				});
				if (!isInstallIDM) {
					uni.showModal({
						icon: 'none',
						title: '你的手机似乎未安装IDM+'
					});
				}
			}

			uni.showToast({
				icon: 'none',
				title: '启动新页面时生效'
			});
		},
		confirm() {
			uni.showLoading({
				title: '下载中'
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
				tempFilePath,
				{
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
				title: '打开新窗口时生效'
			});
			this.settingConfig.pullLoad = e.detail.value;
		},
		switchWindow(e) {
			this.settingConfig.switchWindow = e.detail.value;
		},
		dormancy(e){
			
		},
		changeLog(e) {
			uni.showToast({
				icon: 'none',
				title: '打开新窗口时生效'
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
}
</style>
