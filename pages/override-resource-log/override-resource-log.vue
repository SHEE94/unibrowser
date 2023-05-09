<template>
	<view style="padding: 30upx;box-sizing: border-box;">
		<view class="defaultbtn" @tap="clearALL">{{$t("resourcelog.tips.1")}}</view>
		<view class="defaultbtn" @tap="addoverride">{{$t("resourcelog.tips.2")}}</view>
		<view v-if="request.length>0" style="border-bottom: 1px solid #CCCC77; padding: 30upx;font-weight: bold;">
			{{$t("resourcelog.tips.3")}}
		</view>
		<view v-for="(item, index) in request" :key="index" class="list" :data-index="index" @tap="changeRequest">			
			{{ item }}
		</view>
		<view v-if="hostname.length>0" style="border-bottom: 1px solid #CCCC77; padding: 30upx;font-weight: bold;">
			{{$t("resourcelog.tips.4")}}
		</view>
		<view v-for="(item, index) in hostname" :key="index" class="list" :data-index="index" @tap="changeHOst">			
			{{ item }}
		</view>
		<uni-popup  ref="pops" type="dialog">
			<uni-popup-dialog mode="input" message="Link/Domain" :duration="2000" :before-close="true" @close="showPoop" @confirm="confrim"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	// import uniPop from '@/components/'
	export default {
		
		data() {
			return {
				request:[],
				hostname:[]
			};
		},
		onLoad() {
			this.request = uni.getStorageSync('overrideResourceRequest') || [];
			this.hostname = uni.getStorageSync('overrideResourceRequestHost') || [];
			
		},
		methods:{
			enterd(e){
				this.hostval = e.detail.value;
			},
			showPoop(e){
				this.$refs.pops.close();
				
			},
			confrim(value){
				this.$refs.pops.close();
				// let _type = e.currentTarget.dataset.type;
				if(value.length<5)return;
					this.request.unshift(value);
					uni.setStorageSync('overrideResourceRequest',this.request)
				
			},
			clearALL(){
				uni.removeStorageSync('overrideResourceRequest');
				uni.removeStorageSync('overrideResourceRequestHost');
				this.request = [];
				this.hostname = [];
			},
			addoverride(e){
				 this.$refs.pops.open()
			},
			changeRequest(e){
				let index = e.currentTarget.dataset.index;
				uni.showModal({
					title:this.$t("browser.tips.10"),
					content:this.$t("resourcelog.tips.5"),
					success: (res) => {
						if(res.confirm){
							this.request.splice(index,1);
							uni.setStorageSync('overrideResourceRequest',this.request)
						}
					}
				})
			},
			changeHOst(e){
				let index = e.currentTarget.dataset.index;
				uni.showModal({
					title:this.$t("browser.tips.10"),
					content:this.$t("resourcelog.tips.5"),
					success: (res) => {
						if(res.confirm){
							this.hostname.splice(index,1);
							uni.setStorageSync('overrideResourceRequest',this.hostname)
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
.list {
	width: 100%;
	border-bottom: 1px solid #cccc77;
	padding: 15upx 0;
	overflow: hidden;
	text-overflow: ellipsis;
}
.defaultbtn{
	float: right;padding: 8upx 15upx;line-height: 1.2;font-size: 26upx;border-radius: 4upx;
	border: 1px solid #ccc;
	margin-left: 10upx;
}
.pop-btns{
	position: absolute;
	bottom: 30upx;
	width: 80%;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	justify-content: space-around;
	font-size: 35upx;
}
</style>
