<template>
	<view class="inter-content">
		<view class="defaultbtn" @tap="clearALL">清空所有</view>
		<view class="defaultbtn" @tap="toOverriurl">跳转拦截规则</view>
		<uni-list>
		    <uni-list-item :title="item.hostname" :note="item.classList.join(',')" v-for="(item,index) in adList" :clickable="true" :key="index" @click="del(index)"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				adList:[]
			}
		},
		methods: {
			del(index){
				console.log(index)
				uni.showModal({
					content:'是否删除',
					success: (res) => {
						if(res.confirm){
							this.adList.splice(index,1);
							uni.setStorageSync('adList',this.adList)
						}
					}
				})
				
			},
			clearALL(){
				uni.setStorageSync('adList',[])
				this.adList = []
			},
			toOverriurl(){
				uni.navigateTo({
					url:'overrideUrl/overrideUrl'
				})
			}
		},
		mounted() {
			this.adList = uni.getStorageSync('adList')||[]
		}
	}
</script>

<style>
	.inter-content{
		padding: 30upx;
	}
.defaultbtn{
	padding: 8upx 15upx;
	text-align: center;
	width: 150upx;
	margin: 30upx;
	line-height: 1.2;
	font-size: 26upx;
	border-radius: 4upx;
	border: 1px solid #ccc;
	margin-left: 10upx;
}
</style>
