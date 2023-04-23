<template>
	<view class="content">
		<view class="list">
			<view class="left-info"><view class="label">允许定位</view></view>
			<view class="arr"><switch :checked="settingConfig.location" data-type="location" @change="change" /></view>
		</view>
		
		<view class="list">
			<view class="left-info"><view class="label">拦截cookies</view></view>
			<view class="arr"><switch :checked="settingConfig.cookies" data-type="cookies" @change="change" /></view>
		</view>
		<view class="list">
			<view class="left-info"><view class="label">允许网页访问剪切板</view></view>
			<view class="arr"><switch :checked="settingConfig.clipboard" data-type="clipboard" @change="change" /></view>
		</view>
		<view style="font-size: 11px;color: #999;">
			浏览器其实本身并没有申请定位权限，该功能是为禁止H5自带的定位接口，但网页还是可以通过你的IP地址知道你的所在的城市
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				settingConfig:{
					location:false,
					cookies:false,
					clipboard:true
				}
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
		methods:{
			change(e){
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
