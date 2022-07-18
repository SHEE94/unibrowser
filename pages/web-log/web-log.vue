<template>
	<view class="content">
		<view class="bar">
			<navigator  url="/pages/override-resource-log/override-resource-log">查看已拦截的资源</navigator>
		</view>
		<view class="pick">
			<picker mode="selector" :range="range" @change="bindChange">
				<view>{{ range[current] }} <text class="iconfont icon-down" style="margin-left: 20upx;"></text></view>
			</picker>
		</view>
		<view v-for="(item, index) in showRes" :key="index" class="list" :data-index="index" @tap="change" @longpress="longchange">
			<view style="color: #cc6666;">类型：{{ item.type }}</view>
			{{ item.url }}
		</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			range: ['all', 'js', 'css', 'img', 'iframe','video'],
			current: 0,
			showRes: []
		};
	},
	mounted() {
		this.settingConfig = uni.getStorageSync('settingConfig');
		console.log(this.settingConfig )
	},
	methods: {
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
			if(this.current == 5){
				
				if(this.settingConfig.videoPLay){
					var Intent = plus.android.importClass("android.content.Intent");
					var Uri = plus.android.importClass("android.net.Uri");  
					var main = plus.android.runtimeMainActivity();  
					var intent=new Intent(Intent.ACTION_VIEW);  
					var uri=Uri.parse(this.showRes[index].url);  
					intent.setDataAndType(uri,"video/*");  
					main.startActivity(intent);
				}
				uni.navigateTo({
					url:'/pages/videoplayer/videoplayer?src='+encodeURIComponent(this.showRes[index].url)
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
				itemList: ['拦截链接', '拦截域名', '复制链接', '下载'],
				success: res => {
					if (res.tapIndex == 0) {
						let resRequest = uni.getStorageSync('overrideResourceRequest') || [];
						resRequest.unshift(this.showRes[index].url);
						uni.setStorageSync('overrideResourceRequest', resRequest);
					} else if (res.tapIndex == 1) {
						let resRequest = uni.getStorageSync('overrideResourceRequestHost') || [];
						let hostname = this.convertTemp(this.showRes[index].url);
						resRequest.unshift(hostname);
						uni.setStorageSync('overrideResourceRequestHost', resRequest);
					} else if (res.tapIndex == 2) {
						uni.setClipboardData({
							data: this.showRes[index].url
						});
					} else if (res.tapIndex == 3) {
						this.createDownload(this.showRes[index].url);
					}
				}
			});
		},
		createDownload(url) {
			uni.showLoading({
				title:'正在下载'
			})
			var dtask = plus.downloader.createDownload(url, { filename: '_downloads/' }, function(d, status) {
				// 下载完成
				uni.hideLoading()
				if (status == 200) {
					uni.showModal({
						content: '下载成功，文件保存路径:' + d.filename
					});
				} else {
					uni.showModal({
						content: '下载出错了'
					});
					console.log('Download failed: ' + status);
				}
			});

			dtask.start();
			
		},
		showAll() {
			if(!this.Resource)return;
			this.showRes = [...this.Resource.js, ...this.Resource.css, ...this.Resource.img, ...this.Resource.iframe];
		}
	},
	onLoad() {
		this.Resource = app.globalData.LoadResource;
		this.showAll();
	}
};
</script>

<style lang="less">
.content {
	padding: 30upx;
	box-sizing: border-box;
}
.header{
	display: flex;
	flex-direction: row-reverse;
	.navi{
		border: 1px solid #CCCC77;
		padding: 10upx 15upx;
		margin-bottom: 30upx;
	}
}
.pick {
	width: 100%;
	border: 1px solid #cccc77;
	text-align: center;
}
.list {
	width: 100%;
	border-bottom: 1px solid #cccc77;
	padding: 15upx 0;
	overflow: hidden;
	text-overflow: ellipsis;
}
.bar{
		padding: 15upx 50upx;
		margin-bottom: 30upx;
		display: flex;
		justify-content: flex-end;
		box-sizing: border-box;
		width: 100%;
	}
</style>
