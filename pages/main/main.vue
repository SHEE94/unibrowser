<template>
	<view class="content">
		<swiper
			class="swiper"
			@change="swiperChang"
			style="height: 100vh;"
			easing-function="easeInCubic"
			:indicator-dots="false"
			:autoplay="false"
			:interval="500"
			:duration="400"
			:current="current"
		>
			<swiper-item>
				<view class="swiper-item"><uni-new></uni-new></view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<view class="search">
						<image src="../../static/search.png" class="searchicon" mode="aspectFit"></image>
						<input
							type="text"
							value=""
							class="input"
							placeholder="搜索"
							@confirm="search"
							@focus="focus"
							confirm-type="search"
							:adjust-position="false"
							:auto-focus="false"
						/>
						<image src="../../static/scan.png" class="searchicon" mode="aspectFit" @click="scanQR"></image>
					</view>
					<scroll-view scroll-y="true" style=" margin-top: 15px;padding-bottom: 40px;">
						<view class="scroll-content">
							<view @longpress="edit(index)" class="web-card" v-for="(item, index) in homebookmark" :key="index" @click="tosetting('/pages/browser/browser?url=' + item.url)">
								<image :src="item.ico" mode="aspectFill" class="banner"></image>
								<view class="title">{{ item.title }}</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item"><uni-app-store ref="apps"></uni-app-store></view>
			</swiper-item>
		</swiper>
		<view class="home-bar" v-if="!hideBar">
			<view data-target="back" @tap="topage(0)"><text class="iconfont icon-liebiao1"></text></view>
			<view data-target="forward" @tap="topage(2)"><text class="iconfont icon-yingyongzhongxin"></text></view>
			<view data-target="home" @tap="topage(1)"><text class="iconfont icon-home"></text></view>
			<view @click="tohere('./setting_in_main/setting_in_main')"><text class="iconfont icon-more"></text></view>
		</view>
	</view>
</template>

<script>
import uniNew from '../news-list/news-list.vue';
import uniAppStore from '../app-store/app-store.vue';

const app = getApp();
export default {
	components: {
		uniNew: uniNew,
		uniAppStore: uniAppStore
	},
	data() {
		return {
			baidu: 'https://www.baidu.com/s?wd=',
			enterText: false,
			homebookmark: [],
			hideBar: false,
			current: 1
		};
	},
	onShow() {
		app.globalData.LoadResource = []
		this.homebookmark = uni.getStorageSync('homebookmark')||[];
		console.log(this.homebookmark)
		if(typeof this.homebookmark == 'string'){
			this.homebookmark = JSON.parse(this.homebookmark)
		}
	},
	onLoad() {
		plus.navigator.closeSplashscreen()
		this.currentWebview = this.$scope.$getAppWebview();
		this.stoppuu(false) 
		
		uni.onKeyboardHeightChange(res => {
			console.log(res.height);
			if (res.height > 100) {
				this.hideBar = true;
			} else {
				this.hideBar = false;
			}
		});
	},
	onReady() {
		plus.navigator.closeSplashscreen()
	},
	onPullDownRefresh() {
		this.$refs.apps.scrolltolower()
		setTimeout(()=>{
			uni.stopPullDownRefresh()
		},1500)
	},
	onBackPress() {
		if (this.current == 0 || this.current == 2) {
			this.current = 1;
			return true;
		}
	},
	methods: {
		scanQR(e){
			uni.scanCode({
				success: (res) => {
					console.log(res)
					let result = res.result;
					uni.navigateTo({
						url:'../browser/browser?url='+result,
						animationType:'fade-in'
					})
				}
			})
		},
		edit(index){
			uni.showModal({
				content:'是否删除',
				success: (res) => {
					if(res.confirm){
						this.homebookmark.splice(index,1);
						uni.setStorageSync('homebookmark',this.homebookmark)
					}
				}
			})
		},
		stoppuu(isSupport){
			this.currentWebview.setStyle({
			  pullToRefresh: {  
			    support: isSupport,  
			    style: plus.os.name === 'Android' ? 'circle' : 'default'  
			  }  
			});
		},
		swiperChang(e) {
			this.current = e.detail.current;
			if(this.current == 2){
				this.stoppuu(true)
			}else{
				this.stoppuu(false)
			}
		},
		topage(index) {
			this.current = index;
		},
		tosetting(url){
			uni.navigateTo({
				url:url,
				animationType:'fade-in'
			})
		},
		setHistory() {
			let history = uni.getStorageSync('history') || [];
			if (history.length == 0) {
				uni.setStorageSync('history', history);
			}
		},
		focus() {
			// uni.onKeyboardHeightChange(res => {
			//   console.log(res.height)
			// })
		},
		tohere(url){
			uni.navigateTo({
				url:url
			})
		},
		search(e) {
			let val = e.detail.value;
			uni.navigateTo({
				url: '/pages/browser/browser?url=' + val,
				animationType: 'fade-in'
			});
		}
	}
};
</script>

<style lang="less">
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.swiper {
	height: 100%;
	width: 100%;
	.swiper-item {
		height: 100%;
	}
}
.search {
	display: flex;
	width: 80%;
	align-items: center;
	justify-content: center;
	flex-direction: row;
	border-width: 2upx;
	border-style: solid;
	margin: 0 auto;
	border-color: #cccccc;
	border-radius: 5px;
	margin-top: 50px;
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 5px;
	padding-bottom: 5px;
}
.searchicon {
	width: 20px;
	height: 20px;
}
.input {
	width: 100%;
	padding-left: 10upx;
	color: #525252;
}
.scroll-content {
	display: flex;
	flex-wrap: wrap;
	// flex-direction: column;
	// justify-content: space-between;
	padding: 15px;
	.web-card {
		width: 50px;
		height: 75px;
		// background-color: #eee;

		margin: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		.banner {
			width: 40px;
			height: 40px;
			background: #eee;
			overflow: hidden;
			box-shadow: 0 0 15upx 1px #cccccc;
			border-radius: 10upx;
		}
		.title {
			width: 40px;
			line-height: 27px;
			white-space: nowrap;
			overflow: hidden;
			font-size: 11px;
			text-overflow: ellipsis;
			text-align: center;
		}
	}
}
.home-bar {
	position: fixed;
	height: 40px;
	background-color: #ffffff;
	bottom: 0;
	display: flex;
	flex-direction: row;
	padding-top: 5px;
	padding-bottom: 5px;
	left: 0;
	right: 0;
	align-items: center;
	justify-content: space-around;
	.active {
		color: #007aff;
	}
}
</style>
