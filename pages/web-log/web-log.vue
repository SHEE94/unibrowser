<template>
	<view class="content">
		<view class="bar">
			<navigator url="/pages/override-resource-log/override-resource-log">{{$t('weblog.override-resource')}}</navigator>
		</view>
		<view class="pick">
			<picker mode="selector" :range="range" @change="bindChange">
				<view>{{ range[current] }} <text class="iconfont icon-down" style="margin-left: 20upx;"></text></view>
			</picker>
		</view>
		<view v-for="(item, index) in showRes" :key="index" class="list" :data-index="index" @tap="change"
			@longpress="longchange">
			<view style="color: #cc6666;">{{$t('weblog.type')}}：{{ item.type }}</view>
			{{ item.url }}
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				range: ['all', 'js', 'css', 'img', 'iframe', 'video'],
				current: 0,
				showRes: [],
				allRes: [],
				devList:[],
				initResArr: {
					js: [],
					css: [],
					img: [],
					iframe: [],
					video: []
				},
			};
		},
		created() {
			this.allRes = app.globalData.allRes || [];
			this.getResourceList()
			this.showAll();
		},
		mounted() {
			this.settingConfig = uni.getStorageSync('settingConfig') || {};
		},
		methods: {
			getResourceList() {
				this.Resource = this.initResArr;
				for (let i = 0, len = this.allRes.length; i < len; i++) {
					if (/.*\.(jpg|png|jpeg|bmp|ico)\b/.test(this.allRes[i])) {
						let obj = {
							type: 'img',
							url: this.allRes[i]
						};
						this.Resource.img.unshift(obj);
					}
					if (/.*\.(js)\b/.test(this.allRes[i])) {
						let obj = {
							type: 'js',
							url: this.allRes[i]
						};
						this.Resource.js.unshift(obj);
					}
					if (/.*\.(css)\b/.test(this.allRes[i])) {
						let obj = {
							type: 'css',
							url: this.allRes[i]
						};
						this.Resource.css.unshift(obj);
					}
					if (/.*\.(html)\b/.test(this.allRes[i])) {
						let obj = {
							type: 'iframe',
							url: this.allRes[i]
						};
						this.Resource.iframe.unshift(obj);
					}

					if (/.*\.(mp4|m4v|m3u8)\b/.test(this.allRes[i])) {
						let obj = {
							type: 'video',
							url: this.allRes[i]
						};
						this.Resource.video.unshift(obj);
					}
				}
			},
			bindChange(e) {
				this.current = e.detail.value;
				let _type = this.range[this.current];
				if (this.Resource.hasOwnProperty(_type)) {
					this.showRes = this.Resource[_type];
				} else {
					this.showAll();
				}
			},
			change(e) {

				let index = e.currentTarget.dataset.index;
				if (this.current == 5) {

					if (this.settingConfig.videoPLay) {
						var Intent = plus.android.importClass("android.content.Intent");
						var Uri = plus.android.importClass("android.net.Uri");
						var main = plus.android.runtimeMainActivity();
						var intent = new Intent(Intent.ACTION_VIEW);
						var uri = Uri.parse(this.showRes[index].url);
						intent.setDataAndType(uri, "video/*");
						main.startActivity(intent);
					}
					uni.navigateTo({
						url: '/pages/videoplayer/videoplayer?src=' + encodeURIComponent(this.showRes[index].url)
					})
					return;
				}
				uni.navigateTo({
					url: '/pages/test-webview/test-webview?url=' + this.showRes[index].url
				});
			},
			convertTemp(the_url) {
				let first_split = the_url.split('//');

				let xx = first_split[0];
				let without_resource = first_split[1];

				let second_split = without_resource.split('/');

				let domain = second_split[0];

				return xx + '//' + domain;
			},
			longchange(e) {
				let index = e.currentTarget.dataset.index;
				uni.showActionSheet({
					itemList: [this.$t('weblog.itemList.0'), this.$t('weblog.itemList.1'),this.$t('weblog.itemList.2'),this.$t('weblog.itemList.3'), this.$t('weblog.itemList.4')],
					success: res => {
						let resRequest =[]
						switch (res.tapIndex) {
							case 0:
								resRequest = uni.getStorageSync('overrideResourceRequest') || [];
								resRequest.unshift(this.showRes[index].url);
								uni.setStorageSync('overrideResourceRequest', resRequest);
								break;
							case 1:
								resRequest = uni.getStorageSync('overrideResourceRequestHost') || [];
								let hostname = this.convertTemp(this.showRes[index].url);
								resRequest.unshift(hostname);
								uni.setStorageSync('overrideResourceRequestHost', resRequest);
								break;
							case 2:
								uni.setClipboardData({
									data: this.showRes[index].url
								});
								break;
							case 3:
								this.createDownload(this.showRes[index].url);
								break;
							case 4:
								const Dlan = uni.requireNativePlugin('JX-Dlna');
								Dlan.search(result => {
									
									if(result.type === 'add'){
										this.devList.push({'id': result.id, 'name': result.name})
									}else {
										this.devList = this.devList.filter(x => x.id != result.id)
									}
									// let itemList = []
									
									// itemList.push()
									// uni.showActionSheet({
									// 	itemList:[]
									// })
								})
							break;
						}


					}
				});
			},
			createDownload(url) {
				uni.showLoading({
					title:this.$t('weblog.tips.1')
				})
				var dtask = plus.downloader.createDownload(url, {
					filename: '_downloads/'
				}, function(d, status) {
					// 下载完成
					uni.hideLoading()
					if (status == 200) {
						uni.showModal({
							content:this.$t('weblog.tips.2') + d.filename
						});
					} else {
						uni.showModal({
							content: this.$t('weblog.tips.3')
						});
						console.log('Download failed: ' + status);
					}
				});

				dtask.start();

			},
			showAll() {
				if (!this.Resource) return;
				this.showRes = [...this.Resource.js, ...this.Resource.css, ...this.Resource.img, ...this.Resource.iframe,
					...this.Resource.video
				];
			}
		},
		onLoad() {
			// this.Resource = app.globalData.LoadResource||{ js: [], css: [], img: [], iframe: [], video: [] };

		}
	};
</script>

<style lang="less">
	.content {
		padding: 15px;
		box-sizing: border-box;
	}

	.header {
		display: flex;
		flex-direction: row-reverse;

		.navi {
			border: 1px solid #ECAD9E;
			padding: 5px 7px;
			margin-bottom: 15px;
		}
	}

	.pick {
		width: 100%;
		border: 1px solid #ECAD9E;
		text-align: center;
	}

	.list {
		width: 100%;
		border-bottom: 1px solid #ECAD9E;
		padding: 7px 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.bar {
		padding: 7px 25px;
		margin-bottom: 15px;
		display: flex;
		justify-content: flex-end;
		box-sizing: border-box;
		width: 100%;
	}
</style>