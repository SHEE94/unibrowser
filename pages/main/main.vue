<template>
	<view class="content">
		<!-- <swiper class="swiper" @change="swiperChang" style="height: 100vh;" easing-function="easeInCubic"
			:indicator-dots="false" :autoplay="false" :interval="500" :duration="400" :current="current">
			<swiper-item>
				<view class="swiper-item"><uni-new></uni-new></view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<view class="search">
						<image src="../../static/search.png" class="searchicon" mode="aspectFit"></image>
						<input type="text" value="" class="input" :placeholder="$t('main.tips.search')" @confirm="search" @focus="focus"
							confirm-type="search" :adjust-position="false" :auto-focus="false" />
						<image src="../../static/scan.png" class="searchicon" mode="aspectFit" @click="scanQR"></image>
					</view>
					<scroll-view scroll-y="true" style=" margin-top: 15px;padding-bottom: 40px;">
						<view class="scroll-content">
							<view @longpress="edit(index)" class="web-card" v-for="(item, index) in homebookmark"
								:key="index" @click="tosetting('/pages/browser/browser?url=' + item.url)">
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
		</swiper> -->
		<view class="swiper-item">
			<view class="search">
				<image src="../../static/search.png" class="searchicon" mode="aspectFit"></image>
				<input type="text" :value="keyword" class="input" :placeholder="$t('main.tips.search')"
					@confirm="search" @focus="lastPageShow = false" @blur="lastPageShow = true" confirm-type="search"
					:adjust-position="false" :auto-focus="false" @input="inputsearch" />
				<image src="../../static/scan.png" class="searchicon" mode="aspectFit" @click="scanQR"></image>
				<view class="search-history-content" v-if="showHistory.length">
					<view class="close-history" @click="showHistory = []">{{$t('script.tips.7')}}</view>
					<scroll-view scroll-y="true" class="scroll-history">
						<view>
							<view v-for="(item,index) in showHistory" :key="index" class="item"
								@click.stop="searchHistory(item)">
								<view>{{item}}</view>
								<view class="ccfffasd icon-bianji icon" @click.stop="editKeyword(item)"></view>
							</view>
						</view>
					</scroll-view>

				</view>
			</view>
			<scroll-view scroll-y="true" style=" margin-top: 15px;padding-bottom: 40px;">
				<view class="scroll-content">
					<view @longpress="edit(index)" class="web-card" v-for="(item, index) in homebookmark" :key="index"
						@click="tosetting('/pages/browser/browser?url=' + item.url)">

						<view class="banner-text" v-show="!item.showBannerText">{{item.title.slice(0,1)}}</view>
						<image :src="item.ico" mode="aspectFill" class="banner" @error="item.showBannerText = false"
							v-show="item.showBannerText"></image>
						<view class="title">{{ item.title }}</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<view class="recover" :class="lastPage.length&&lastPageShow?'active':''">
			<view class="tips">{{$t('main.tips.1')}}</view>
			<view class="btns">
				<view class="btn" @click="openRecover('y')">{{$t('main.tips.2')}}</view>
				<view class="btn" @click="openRecover('n')">{{$t('main.tips.3')}}</view>
			</view>
		</view>
		<view class="home-bar" v-if="!hideBar">
			<!-- <view data-target="back" @tap="topage(0)"><text class="iconfont icon-liebiao1"></text></view> -->
			<!-- <view data-target="forward" @tap="topage(2)"><text class="iconfont icon-yingyongzhongxin"></text></view> -->
			<!-- <view data-target="home" @tap="topage(1)"><text class="iconfont icon-home"></text></view> -->
			<view @click="tohere('./setting_in_main/setting_in_main')" class="setting-main-icon"><text
					class="iconfont icon-more"></text></view>
		</view>
	</view>
</template>

<script>
	// import uniNew from '../news-list/news-list.vue';
	// import uniAppStore from '../app-store/app-store.vue';
	import searchKeyword from '@/utils/keyword.js';
	import {
		debounce
	} from '@/utils/tools.js'
	const app = getApp();
	export default {
		components: {
			// uniNew: uniNew,
			// uniAppStore: uniAppStore
		},
		data() {
			return {
				baidu: 'https://www.baidu.com/s?wd=',
				enterText: false,
				homebookmark: [],
				hideBar: false,
				current: 1,
				keyword: '',
				defaultBookmark: [{
					url: 'https://cn.bing.com',
					ico: 'https://cn.bing.com/favicon.ico',
					title: 'bing'
				}, {
					url: 'https://m.baidu.com',
					ico: 'https://m.baidu.com/favicon.ico',
					title: 'baidu'
				}, {
					url: 'https://www.sogou.com',
					ico: 'https://www.sogou.com/favicon.ico',
					title: 'sougo'
				}, {
					url: 'https://www.google.com',
					ico: 'https://www.google.com/favicon.ico',
					title: 'google'
				}],
				historyLogArr: [],
				showHistory: [],
				lastPage: [],
				lastPageShow: true,
				bingImg: false,
			};
		},

		onShow() {
			app.globalData.LoadResource = []
			let homebookmark = uni.getStorageSync('homebookmark');
			if (!homebookmark) {
				uni.setStorageSync('homebookmark', this.defaultBookmark)
				homebookmark = this.defaultBookmark;
			}
			homebookmark = homebookmark.map((e) => {
				return {
					...e,
					showBannerText: true
				}
			})
			this.homebookmark = homebookmark
			if (typeof this.homebookmark == 'string') {
				this.homebookmark = JSON.parse(this.homebookmark)
			}
			setTimeout(() => {
				this.lastPage = uni.getStorageSync('lastPage') || [];
			}, 1000)
			let settingConfig = uni.getStorageSync('settingConfig');
			if (settingConfig.bingImage) {
				this.bingImg = true;
			}

		},
		onLoad() {
			this.historyLogArr = uni.getStorageSync('historyLogArr') || []

			plus.navigator.closeSplashscreen()
			this.currentWebview = this.$scope.$getAppWebview();
			this.stoppuu(false)

			uni.onKeyboardHeightChange(res => {
				if (res.height > 100) {
					this.hideBar = true;
				} else {
					this.hideBar = false;
				}
			});


			let systemInfo = uni.getSystemInfoSync();
			this.systemLocale = systemInfo.language;
			this.applicationLocale = uni.getLocale();
			uni.onLocaleChange((e) => {
				this.applicationLocale = e.locale;
			})
		},
		onReady() {
			plus.navigator.closeSplashscreen()
		},
		onPullDownRefresh() {
			this.$refs.apps.scrolltolower()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1500)
		},
		onBackPress() {
			if (this.current == 0 || this.current == 2) {
				this.current = 1;
				return true;
			}
		},
		methods: {

			scanQR(e) {
				uni.scanCode({
					success: (res) => {
						console.log(res)
						let result = res.result;
						uni.navigateTo({
							url: '../browser/browser?url=' + result,
							animationType: 'fade-in'
						})
					}
				})
			},
			edit(index) {
				uni.showModal({
					content: this.$t('main.tips.del'),
					success: (res) => {
						if (res.confirm) {
							this.homebookmark.splice(index, 1);
							uni.setStorageSync('homebookmark', this.homebookmark)
						}
					}
				})
			},
			stoppuu(isSupport) {
				this.currentWebview.setStyle({
					pullToRefresh: {
						support: isSupport,
						style: plus.os.name === 'Android' ? 'circle' : 'default'
					}
				});
			},
			swiperChang(e) {
				this.current = e.detail.current;
				if (this.current == 2) {
					this.stoppuu(true)
				} else {
					this.stoppuu(false)
				}
			},
			topage(index) {
				this.current = index;
			},
			tosetting(url) {
				uni.navigateTo({
					url: url,
					animationType: 'fade-in'
				})
			},
			setHistory() {
				let history = uni.getStorageSync('history') || [];
				if (history.length == 0) {
					uni.setStorageSync('history', history);
				}
			},
			// focus() {
			// 	// uni.onKeyboardHeightChange(res => {
			// 	//   console.log(res.height)
			// 	// })
			// 	this.lastPageShow = false;
			// },
			// blur(){
			// 	this.lastPageShow = true;
			// },
			tohere(url) {
				uni.navigateTo({
					url: url,
					animationType: 'zoom-fade-out'
				})
			},
			openRecover(e) {
				if (e === 'y') {
					app.globalData.lastPage = this.lastPage;
					uni.navigateTo({
						url: '/pages/browser/browser',
						animationType: 'fade-in'
					});
				}
				uni.removeStorageSync('lastPage')
				this.lastPage = []
			},
			bannerload(index) {
				this.homebookmark[index].showBannerText = true

				console.log(this.homebookmark)
			},
			editKeyword(keyword) {
				this.keyword = keyword;

			},
			search(e) {
				let val = e.detail.value;
				this.historyLog(val)
				uni.navigateTo({
					url: '/pages/browser/browser?url=' + val,
					animationType: 'fade-in'
				});
			},
			searchHistory(keyword) {
				uni.navigateTo({
					url: '/pages/browser/browser?url=' + keyword,
					animationType: 'fade-in'
				});
			},

			inputsearch(e) {
				let val = e.detail.value;
				this.showHistory = []
				if (!val) return;


				debounce((val) => {
					searchKeyword(val).then(res => {
						let data = res.s
						this.showHistory = data
					})
				})(val)
				try {
					for (let i = 0, len = this.historyLogArr.length; i < len; i++) {
						if (!this.historyLogArr[i]) continue;
						if (this.historyLogArr[i].indexOf(val) > -1) {
							if (this.showHistory.length > 10) {
								this.showHistory.pop()
							}
							if (!val) {
								this.showHistory = []
								return;
							}
							this.showHistory.unshift(this.historyLogArr[i])
						}
					}
				} catch (e) {
					//TODO handle the exception
				}

			},
			historyLog(keyword) {
				let has = this.historyLogArr.find(item => item == keyword)
				if (!has) {
					this.historyLogArr.push(keyword)
				}
				uni.setStorageSync('historyLogArr', this.historyLogArr)
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
		// min-height: 100vh;

	}

	.bingimg {
		background: url('https://api.isoyu.com/bing_images.php')no-repeat center;
		background-size: cover;
	}

	.swiper {
		height: 100%;
		width: 100%;


	}

	.swiper-item {
		height: 100%;
		width: 100%;
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
		padding: 5px 10px;
		position: relative;
		z-index: 9;
		background-color: rgba(255, 255, 255, .2);
		backdrop-filter: blur(10px);
		color: #000;

		.search-history-content {
			position: absolute;
			transition: all .4s;
			box-sizing: border-box;
			background: #eee;
			left: 0;
			right: 0;
			padding: 10px;
			top: 100%;
			border-radius: 0 0 10px 10px;
			overflow: hidden;
			border: 1px solid #ccc;

			.scroll-history {
				max-height: 200px;

				.item {
					width: 100%;
					margin-top: 5px;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.icon {
						// font-size: 20px;

					}
				}
			}

			.close-history {
				color: #999;
				font-size: 14px;
				align-self: flex-end;
			}
		}

	}

	.searchicon {
		width: 20px;
		height: 20px;
	}

	.input {
		width: 100%;
		padding-left: 10upx;
		color: #000;
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
			position: relative;

			.banner,
			.banner-text {
				position: relative;
				width: 40px;
				height: 40px;
				background: #eeeeeec9;
				overflow: hidden;
				border-radius: 10upx;
			}

			.banner-text {
				position: relative;
				text-align: center;
				line-height: 40px;
			}

			.title {
				color: #000;
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

	.recover {
		display: flex;
		position: fixed;
		bottom: -100%;
		width: 80%;
		transition: all 1s;
		background-color: #fff;
		box-shadow: 0 0 15px 0px #515151;
		border-radius: 10px;
		align-items: center;
		padding: 5px 10px;
		justify-content: space-between;
		transform: scale(0);
		opacity: 0;

		.tips {
			font-size: 10px;
		}

		.btns {
			display: flex;
			width: 25%;
			justify-content: space-between;
			align-items: center;
			font-size: 12px;

			.btn {
				border-radius: 10px;
				padding: 0 10px;
				border: 1px solid #ccc;
			}
		}
	}

	.active {
		bottom: 80px;
		transform: scale(1);
		opacity: 1;
	}

	.home-bar {
		position: fixed;
		height: 40px;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		padding-top: 5px;
		padding-bottom: 5px;
		left: 0;
		right: 0;
		align-items: center;
		justify-content: space-around;
		width: 100%;

		.iconfont {
			color: #000;
			font-size: 30px;
		}

		.setting-main-icon {
			animation: dd 2s infinite alternate;
		}

		@keyframes dd {
			0% {
				transform: rotate(-20deg);
			}

			25% {
				transform: rotate(0deg);
			}

			50% {
				transform: rotate(0deg);
			}

			75% {
				transform: rotate(0deg);
			}

			100% {
				transform: rotate(10deg);
			}
		}

		.active {
			color: #007aff;
		}
	}
</style>