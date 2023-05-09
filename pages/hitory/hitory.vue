<template>
	<view>
		<view class="top-bar"><view @click="clearAll">{{$t("history.tips.1")}}</view></view>
		<view class="list-content">
			<view class="list" v-for="(item, index) in history" :key="index" @longpress="more(item, index)" @click="tonav(item.url)">
				<view class="title">{{ item.title }}</view>
				<view class="url">{{ item.url }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			history: []
		};
	},
	mounted() {
		this.history = uni.getStorageSync('history') || [];
	},
	onLoad(options) {
		this.from = options.from;
	},
	methods: {
		clearAll() {
			uni.showModal({
				content:this.$t("history.tips.2"),
				success: res => {
					if (res.confirm) {
						this.history = [];
						uni.setStorageSync('history', []);
					}
				}
			});
		},
		tonav(url) {
			if (this.from == 'home') {
				uni.redirectTo({
					url: '/pages/browser/browser',
					success: () => {
						uni.$emit('HISTORY-MAKE', { type: -1, url: url });
					}
				});
				return;
			}
			uni.$emit('HISTORY-MAKE', { type: -1, url: url });
			uni.navigateBack({
				animationType: 'fade-out'
			});
		},
		more(item, index) {
			uni.showActionSheet({
				itemList: [this.$t("history.tips.3"), this.$t("history.tips.4"),this.$t("history.tips.5"), this.$t("history.tips.6")],
				success: res => {
					if (res.tapIndex == 2) {
						this.history.splice(index, 1);
						uni.setStorageSync('history', this.history);
					} else if (res.tapIndex == 3) {
						uni.setClipboardData({
							data: item.url,
							success: res => {
								plus.nativeUI.toast(this.$t("history.tips.7"));
							}
						});
					} else {
						if(this.from == 'home'){
							console.log('home')
							uni.redirectTo({
								url: '/pages/browser/browser',
								success: () => {
									uni.$emit('HISTORY-MAKE', { type: -1, url: item.url });
								}
							});
							return;
						}
						uni.$emit('HISTORY-MAKE', { type: res.tapIndex, url: item.url });
						uni.navigateBack({
							animationType: 'fade-out'
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="less">
.top-bar {
	height: 35px;
	background-color: #f7f7f7;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	padding: 0 20px;
	color: #515151;
	border-top: 1px solid #ededed;
}
.list-content {
	padding-top: 36px;
	.list {
		padding: 5px 15px;
		font-size: 14px;
		color: #515151;
		border-bottom: 1px solid #efefef;
		.url {
			color: #999999;
			white-space: nowrap;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}
</style>
