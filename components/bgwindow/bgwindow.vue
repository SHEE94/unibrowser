<template>
	<view>
		<view class="bg-content">
			<view class="list-content" :class="show">
				<view class="list" v-for="(item, index) in list" :key="index">
					<view class="title" @click="openBgWebview(index)">
						<image v-if="yinsi" src="../../static/hide.png" mode="widthFix" style="width: 20px;margin-right: 5px;"></image>
						{{ item.getTitle() }}
					</view>
					<view style="color: #999;" @click="close(item, index)">关闭</view>
				</view>
			</view>
			<view class="btn-list">
				<view class="btn" @click="openNew">新建窗口</view>
				<view class="btn" @click="closeAll">全部关闭</view>
			</view>
		</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	name: 'bgwindow',
	data() {
		return {
			list: [],
			show: '',
			yinsi: false
		};
	},
	mounted() {
		this.list = app.globalData.webviewList;
		this.show = 'ac';
		let setting = uni.getStorageSync('settingConfig');
		this.yinsi = setting.traceless;
	},
	methods: {
		openBgWebview(index) {
			uni.$emit('SWITCH-WEBVIEW', { index: index });
			this.$emit('close');
		},
		openNew() {
			uni.$emit('OPEN-NEW-WINDOW');
			this.$emit('close');
		},
		close(item, index) {
			item.close();
			uni.$emit('CLOSE-WINDOW', index);
			this.$emit('close');
		},
		closeAll() {
			this.list.forEach(e => {
				e.close();
			});
			uni.$emit('CLOSE-WINDOW-ALL');
			this.$emit('close');
		}
	}
};
</script>

<style lang="less">
@import url('@/utils/iconfont.css');
.bg-content {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	.list-content {
		padding: 15px 15px 60px;
		background-color: #fff;
		border-radius: 10px 10px 0 0;
		position: relative;
		transform: translateY(100%);
		opacity: 0;
		transition: all 0.2s;

		.list {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px;
			max-height: 50px;
			overflow: hidden;
			.title {
				width: 70%;
				color: #515151;
				font-size: 13px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				display: flex;
				align-items: center;
			}
		}
		.active {
			background: #eee;

			box-sizing: border-box;
			border-radius: 4px;
		}
	}
	.ac {
		opacity: 1;
		transform: translateY(0%);
	}
	.btn-list {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 44px;
		display: flex;
		justify-content: space-between;
		background: #ffffff;
		.btn {
			flex: 1;
			text-align: center;
			line-height: 44px;
			color: #515151;
		}
	}
}
</style>
