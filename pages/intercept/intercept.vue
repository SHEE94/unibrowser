<template>
	<view class="inter-content">
		<view class="defaultbtn" @tap="clearALL">{{$t('inter.clearALL')}}</view>
		<view class="defaultbtn" @tap="toOverriurl">{{$t("inter.toOverriurl")}}</view>
		<view class="defaultbtn" @tap="addUrl">{{$t("inter.addUrl")}}</view>
		<uni-list>
		    <uni-list-item :title="item.hostname" :note="item.classList.join(',')" v-for="(item,index) in adList" :clickable="true" :key="index" @click="del(index)"></uni-list-item>
		</uni-list>
		
	</view>
</template>

<script>
	const app = getApp()
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
					content:this.$t("inter.tips.1"),
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
			},
			addUrl(){
				uni.navigateTo({
					url:'/pages/overrideUrl/overrideUrl'
				})
			},
		},
		
		mounted() {
			this.adList = uni.getStorageSync('adList')||[]
		}
	}
</script>

<style>
	.inter-content{
		padding: 15px;
	}
.defaultbtn{
	padding: 4px 7px;
	text-align: center;
	width: 80px;
	margin: 15px;
	line-height: 1.2;
	font-size: 13px;
	border-radius: 4upx;
	border: 1px solid #ccc;
	margin-left: 5px;
}
</style>
