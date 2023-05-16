<template>
	<view class="menu-content">
		<view class="list-content">
			<view class="url-text" v-if="href && href != 'undefined'">{{href}}</view>
			<template v-if="href && href != 'undefined'">
				<view class="btn" @click="menuChange('openBg',href)">{{$t("menu.background.open")}}</view>
				<view class="btn" @click="menuChange('openNew',href)">{{$t("menu.new.open")}}</view>
				<view class="btn" @click="menuChange('copyLink',href)">{{$t("menu.copy.link")}}</view>
				<view class="btn" @click="menuChange('overrLink',href)">{{$t("menu.inter.link")}}</view>
				<view class="btn" @click="menuChange('adurl')">{{$t("menu.inter.website")}}</view>
				<view class="btn" @click="menuChange('copyText')">{{$t("menu.copy.link.text")}}</view>
			</template>
			<template v-if="src && src != 'undefined'">
				<view class="btn" @click="menuChange('saveImg')">{{$t("menu.save.img")}}</view>
				<view class="btn" @click="menuChange('preview')">{{$t("menu.preivew.img")}}</view>
				<view class="btn" @click="menuChange('copyImgLink',src)">{{$t("menu.copy.img")}}</view>
				<view v-if="tag == 'VIDEO'" class="btn" @click="menuChange('openVideo',src)">{{$t("menu.open.play")}}
				</view>
			</template>
			<view class="btn" v-if="text && text != 'undefined'" @click="menuChange('copyChangeText')">{{$t("menu.copy.text")}}</view>
			<view class="btn" @click="menuChange('ad')">{{$t("menu.ad")}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'menu-call',
		props: ['tag', 'src', 'text', 'className', 'href', 'hostname'],
		data() {
			return {};
		},
		methods: {
			clipText(text) {
				uni.setClipboardData({
					data: text,
					success: (res) => {
						plus.nativeUI.toast(this.$t("menu.copy.clip"));
					}
				})
			},
			menuChange(str, url) {
				switch (str) {
					case 'openBg':
						uni.$emit('OPEN-BG', {
							url: url
						})
						break;
					case 'openNew':
						uni.$emit('OPEN-NEW-WINDOW', this.href);
						break;
					case 'copyImgLink':
						this.clipText(this.src)
						break;
					case 'copyLink':
						this.clipText(this.href)
						break;
					case 'overrLink':
						let urls = uni.getStorageSync('overrideurl')
						urls += ',' + url
						uni.setStorageSync('overrideurl', urls)
						break;
					case 'copyText':
						this.clipText(this.text)
						break;
					case 'saveImg':
						uni.downloadFile({
							url: this.src,
							success: (res) => {
								let path = res.tempFilePath;
								uni.saveImageToPhotosAlbum({
									filePath: path,
									success: (res) => {
										plus.nativeUI.toast(this.$t("menu.tips.1"));
									},
									fail: (res) => {
										plus.nativeUI.toast(this.$t("menu.tips.2"));
										uni.saveFile({
											tempFilePath: path,
											success: (res) => {
												plus.nativeUI.toast(this.$t(
														"menu.tips.3") + '：' + res
													.savedFilePath);
											}
										})
									}
								})

							}
						})
						break;
					case 'preview':
						uni.previewImage({
							urls: [this.src]
						})
						break;
					case 'copyChangeText':
						this.clipText(this.text)
						break;
					case 'openVideo':
						this.openSysVideo(this.src)
						break;
					case 'ad':
						let adlist = uni.getStorageSync('adList') || []
						let has = false;
						for (let i = 0; i < adlist.length; i++) {
							if (adlist[i].hostname == this.hostname) {
								has = true;
								adlist[i].classList.unshift(this.className)
							}
						}
						if (!has) {
							let ad = {
								hostname: this.hostname,
								classList: [this.className]
							}
							adlist.unshift(ad)
						}
						uni.setStorageSync('adList', adlist)
						uni.$emit('AD', {
							className: this.className
						})
						break;
					case 'adurl':
						if (this.href) {
							this.urls = uni.getStorageSync('overrideurl') || '';
							let hostarr = this.href.split('.');
							this.urls += ',' + hostarr[1];
							uni.setStorageSync('overrideurl', this.urls)
						}
						break;
				}
				this.close()
			},
			close() {
				this.$emit('close')
			},
			openSysVideo(src) {
				var Intent = plus.android.importClass("android.content.Intent");
				var Uri = plus.android.importClass("android.net.Uri");
				var main = plus.android.runtimeMainActivity();
				var intent = new Intent(Intent.ACTION_VIEW);
				var uri = Uri.parse(src);
				intent.setDataAndType(uri, "video/*");
				main.startActivity(intent);
			}
		}
	};
</script>

<style lang="less">
	.menu-content {

		.list-content {
			position: fixed;
			width: 55%;
			background: #fefefe;
			padding: 15px;
			border-radius: 10px;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			// border:1px solid #ccc;
			box-shadow: 0 0 20px 0px #515151;
			max-height: 90%;
			overflow-y: auto;

			.url-text {
				font-size: 12px;
				width: 100%;
				color: #999;
				overflow: hidden;
				text-overflow: ellipsis;
				max-height: 16px;
			}

			.btn {
				color: #515151;
				// border-bottom: 1px solid #C0C0C0;
				padding: 10px;

			}

			.btn:nth-last-child(1) {
				border-bottom: none;
			}
		}
	}
</style>