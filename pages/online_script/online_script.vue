<template>
	<view>
		<uni-list>
			<uni-list-item :title="item.name" :note="item.desc" v-for="(item, index) in list" :key="index">
				<template slot="footer">
					<view class="install-btn">
						<view class="btn" @click="install(item.url,index)" v-if="!item.install&&!item.update">安装</view>
						<view class="btn" style="background: #eee;border: #ccc;" v-if="item.install">已安装</view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: []
		};
	},
	onLoad() {
		this.list = uni.getStorageSync('onlineScript')||[];
		this.installOnlineScript = uni.getStorageSync('installOnlineScript')||[];
		this.list.forEach((a,index)=>{
			this.installOnlineScript.forEach(b=>{
				if(a._id == b._id){
					a.install = true;
				}
				if(a.name == b.name&&a._id != b._id){
					console.log(a,b)
					a.update = true;
				}
			})
		})
		console.log(this.list)
	},
	methods: {
		
		install(url,index) {
			uni.showLoading({
				title: '正在安装'
			});
			uni.downloadFile({
				url: url,
				success: res => {
					console.log(res.tempFilePath)
					
					if (res.statusCode === 200) {
						uni.saveFile({
							tempFilePath:res.tempFilePath,
							success: (res) => {
								let savedFilePath = res.savedFilePath;
								this.list[index].install = true;
								this.list[index].update = false;
								this.list[index].installPath = savedFilePath;
								
								this.installOnlineScript.push(this.list[index])
								uni.setStorageSync('installOnlineScript',this.installOnlineScript)
								uni.showToast({
									title: '安装成功'
								});
							}
						})
						
						console.log('下载成功');
					} else {
						uni.showModal({
							content: '安装失败'
						});
					}
				},
				fail: err => {
					uni.showModal({
						content: '下载超时'
					});
				},complete() {
					uni.hideLoading();
				}
			});
		}
	}
};
</script>

<style lang="less">
.install-btn {
	display: flex;
	height: 100%;
	align-items: center;
	justify-content: center;
	.btn {
		padding: 4px 15px;
		line-height: 1.8;
		border-radius: 4px;
		border: 1px solid #008585;
		font-size: 11px;
	}
}
</style>
