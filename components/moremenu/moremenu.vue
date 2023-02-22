<template>
	<view class="more-content">
		<view class="more-list">			
			<view class="btn" @click="menuChange('reload')">刷新</view>
			<view class="btn" @click="menuChange('openNewWindow')">打开新窗口</view>
			<view class="btn" @click="openBgwindow">后台窗口</view>
			<view class="btn" @click="opentraceless">{{settingConfig.traceless?'关闭无痕':'开启无痕'}} </view>
			<view class="btn" @click="menuChange('book')">书签</view>
			<view class="btn" @click="menuChange('addBook')">添加书签</view>
			<view class="btn" @click="menuChange('history')">历史记录</view>
			<view class="btn" @click="menuChange('full')">全屏</view>
			<view class="btn" @click="menuChange('extend')">扩展</view>
			<!-- <view class="btn" @click="menuChange('download')">下载</view> -->
			<view class="btn" @click="menuChange('setting')">设置</view>
			<view class="btn" @click="menuChange('quit')">退出</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'moremenu',
	data() {
		return {
			settingConfig:{}
		};
	},
	mounted() {
		this.settingConfig = uni.getStorageSync('settingConfig');
	},
	methods: {
		openBgwindow() {
			uni.$emit('BG-WINDOW');
		},
		opentraceless(){
			this.settingConfig.traceless = !this.settingConfig.traceless;
			uni.setStorageSync('settingConfig',this.settingConfig)
			plus.nativeUI.toast(!this.settingConfig.traceless?'关闭无痕':'开启无痕');
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
						url:'/pages/hitory/hitory',
						animationType: "fade-in"
					})
					break;
				case 'full':
					uni.$emit('FULL',true)
					this.$emit('close');
				break;
				case 'setting':
				uni.redirectTo({
					url:'/pages/setting/setting',
					animationType: "fade-in"
				})
				break;
				case 'book':
					uni.redirectTo({
						url:'/pages/bookmark/bookmark'
					})
				break;
				case 'addBook':
					uni.redirectTo({
						url:'/pages/add-bookmark/add-bookmark'
					})
				break;
				case 'extend':
					uni.redirectTo({
						url:'/pages/script-list/script-list'
					})
				break;
				case 'download':
					uni.redirectTo({
						url:'/pages/download/download'
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
	box-shadow: 0 0 20upx 2upx #c0c0c0;
	width: 120px;
	border-radius: 5px;
	padding: 15px;
	top: 70px;
	right: 10upx;
	max-height: 90%;
	overflow-y: auto;
	.btn {		
		color: #515151;
		padding:10px 5px;
	}
}
</style>
