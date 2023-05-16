<template>
	<view class="more-content">
		<view class="more-list">
			<view class="btn" @click="menuChange('reload')">{{$t("moremenu.reload")}}</view>
			<view class="btn" @click="menuChange('openNewWindow')">{{$t("moremenu.open.window")}}</view>
			<view class="btn" @click="openBgwindow">{{$t("moremenu.bg.window")}}</view>
			<view class="btn" @click="opentraceless">
				{{settingConfig.traceless?$t("moremenu.close.nolist"):$t("moremenu.open.nolist")}} </view>
			<view class="btn" @click="menuChange('book')">{{$t("moremenu.bookmark")}}</view>
			<view class="btn" @click="menuChange('addBook')">{{$t("moremenu.add.bookmark")}}</view>
			<view class="btn" @click="menuChange('history')">{{$t("moremenu.history")}}</view>
			<view class="btn" @click="menuChange('full')">{{$t("moremenu.fullscreen")}}</view>
			<view class="btn" @click="menuChange('extend')">{{$t("moremenu.extend")}}</view>
			<view class="btn" @click="menuChange('readmode')">{{read?$t("browser.tips.14"):$t("browser.tips.13")}}</view>
			<!-- <view class="btn" @click="menuChange('download')">下载</view> -->
			<view class="btn" @click="menuChange('setting')">{{$t("moremenu.settin")}}</view>
			<view class="btn" @click="menuChange('quit')">{{$t("moremenu.quit")}}</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		name: 'moremenu',
		data() {
			return {
				settingConfig: {},
				read:app.globalData.read
			};
		},
		mounted() {
			this.settingConfig = uni.getStorageSync('settingConfig');
		},
		methods: {
			openBgwindow() {
				uni.$emit('BG-WINDOW');
			},
			opentraceless() {
				this.settingConfig.traceless = !this.settingConfig.traceless;
				uni.setStorageSync('settingConfig', this.settingConfig)
				plus.nativeUI.toast(!this.settingConfig.traceless ? this.$t("moremenu.close.nolist") : this.$t(
					"moremenu.open.nolist"));
				this.$emit('close');
			},
			menuChange(str) {
				switch (str) {
					case 'reload':
						uni.$emit('RELOAD');
						this.$emit('close');
						break;
					case 'openNewWindow':
						uni.$emit('OPEN-NEW-WINDOW');
						this.$emit('close');
						break;
					case 'quit':
						plus.runtime.quit();
						this.$emit('close');
						break;
					case 'history':
						uni.redirectTo({
							url: '/pages/hitory/hitory',
							animationType: "fade-in"
						})
						break;
					case 'full':
						uni.$emit('FULL', true)
						this.$emit('close');
						break;
					case 'readmode':
						uni.$emit('READ-MODE')
						this.$emit('close');
						break;
					case 'setting':
						uni.redirectTo({
							url: '/pages/setting/setting',
							animationType: "fade-in"
						})
						break;
					case 'book':
						uni.redirectTo({
							url: '/pages/bookmark/bookmark'
						})
						break;
					case 'addBook':
						uni.redirectTo({
							url: '/pages/add-bookmark/add-bookmark'
						})
						break;
					case 'extend':
						uni.redirectTo({
							url: '/pages/script-list/script-list'
						})
						break;
					case 'download':
						uni.redirectTo({
							url: '/pages/download/download'
						})
						break;
				}

			}
		}
	};
</script>

<style lang="less">
	@import 'http://at.alicdn.com/t/font_2480200_9j680e6hv4h.css';

	.more-list {
		position: absolute;
		background: #ffffff;
		color: #515151;
		box-shadow: 0 0 20upx 0upx #515151;
		min-width: 120px;
		border-radius: 10px;
		padding: 15px;
		top: 70px;
		right: 10upx;
		// max-height: 30%;
		overflow-y: auto;
		.btn {
			color: #515151;
			padding: 10px 5px;
		}
	}
</style>