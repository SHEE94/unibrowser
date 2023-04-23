<template>
	<view class="menu-content">
		<view class="list-content">
			<view class="url-text" v-if="href && href != 'undefined'">{{href}}</view>
			<template v-if="href && href != 'undefined'">
				<view class="btn" @click="menuChange('openBg',href)">后台打开</view>
				<view class="btn" @click="menuChange('openNew',href)">新窗口打开</view>
				<view class="btn" @click="menuChange('copyLink',href)">复制链接</view>
				<view class="btn" @click="menuChange('overrLink',href)">拦截链接</view>
				<view class="btn" @click="menuChange('adurl')">拦截该网址</view>
				<view class="btn" @click="menuChange('copyText')">复制链接文本</view>
			</template>
			<template v-if="src && src != 'undefined'">
				<view class="btn" @click="menuChange('saveImg')">保存图片</view>
				<view class="btn" @click="menuChange('preview')">预览图片</view>
				<view class="btn" @click="menuChange('copyImgLink',src)">复制图片链接</view>
				<view v-if="tag == 'VIDEO'" class="btn" @click="menuChange('openVideo',src)">使用播放器打开</view>
			</template>
			<view class="btn" @click="menuChange('copyChangeText')">复制文本</view>
			<view class="btn" @click="menuChange('ad')">标记为广告</view>
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
						plus.nativeUI.toast('已复制到剪切板');
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
					uni.$emit('OPEN-NEW-WINDOW',this.href);
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
										plus.nativeUI.toast('文件已保存');
									},
									fail: (res) => {
										plus.nativeUI.toast('未获得授权');
										uni.saveFile({
											tempFilePath: path,
											success: (res) => {
												plus.nativeUI.toast('文件保存路径：' + res
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
			width: 45%;
			background: #fefefe;
			padding: 15px;
			border-radius: 10px;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			// border:1px solid #ccc;
			box-shadow: 0 0 20upx 2upx #c0c0c0;
			max-height: 90%;
			overflow-y: auto;
			border: 1px solid #eee;

			.url-text {
				font-size: 12px;
				width: 100%;
				color: #999;
				overflow: hidden;
				text-overflow: ellipsis;

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