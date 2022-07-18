<template>
	<view class="menu-content">
		<view class="list-content">
			<template v-if="href && href != 'undefined'">
				<view class="btn" @click="menuChange('openBg',href)">后台打开</view>
				<view class="btn" @click="menuChange('copyLink',href)">复制链接</view>
				<view class="btn" @click="menuChange('overrLink',href)">拦截链接</view>
				<view class="btn" @click="menuChange('copyText')">复制链接文本</view>
			</template>
			<template v-if="src && src != 'undefined'">
				<view class="btn" @click="menuChange('saveImg')">保存图片</view>
				<view class="btn" @click="menuChange('preview')">预览图片</view>
			</template>
			<view class="btn" @click="menuChange('copyChangeText')">复制文本</view>
			<view class="btn" @click="menuChange('ad')">标记为广告</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'menu-call',
	props: ['tag', 'src', 'text', 'className','href','hostname'],
	data() {
		return {};
	},
	mounted() {
		console.log(this.href,this.src)
	},
	methods:{
		clipText(text){
			uni.setClipboardData({
				data:text,
				success: (res) => {
					plus.nativeUI.toast('已复制到剪切板');
				}
			})
		},
		menuChange(str,url){
			switch(str){
				case 'openBg':
					uni.$emit('OPEN-BG',{url:url})
				break;
				case 'copyLink':
					this.clipText(this.text)
				break;
				case 'overrLink':
					
				break;
				case 'copyText':
					this.clipText(this.text)
				break;
				case 'saveImg':
					uni.downloadFile({
						url:this.src,
						success: (res) => {
							let path = res.tempFilePath;
							console.log(path)
							uni.saveImageToPhotosAlbum({
								filePath:path,
								success: (res) => {
									plus.nativeUI.toast('文件已保存');
								},fail: (res) => {
									plus.nativeUI.toast('未获得授权');
								}
							})
							
						}
					})
				break;
				case 'preview':
					uni.previewImage({
						urls:[this.src]
					})
				break;
				case 'copyChangeText':
					this.clipText(this.text)
				break;
				case 'ad':
					let adlist = uni.getStorageSync('adList')||[]
					let has = false;
					for(let i = 0;i<adlist.length;i++){
						if(adlist[i].hostname == this.hostname){
							has = true;
							adlist[i].classList.unshift(this.className)
						}
					}
					if(!has){
						let ad = {hostname:this.hostname,classList:[this.className]}
						adlist.unshift(ad)
					}
					uni.setStorageSync('adList',adlist)
					uni.$emit('AD',{className:this.className})
				break;
			}
			this.close()
		},
		close(){
			this.$emit('close')
		}
	}
};
</script>

<style lang="less">
.menu-content {
	.list-content {
		position: fixed;
		width: 50%;
		background: #ffffff;
		padding: 30upx;
		border-radius: 5px;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		// border:1px solid #ccc;
		box-shadow: 0 0 20upx 2upx #c0c0c0;
		.btn {
			color: #515151;
			// border-bottom: 1px solid #C0C0C0;
			padding: 20upx;
		}
		.btn:nth-last-child(1) {
			border-bottom: none;
		}
	}
}
</style>
