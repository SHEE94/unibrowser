<template name="footer">
	<view class="footercontent" v-if="!fullstate">
		<view data-target="back" @longpress="clearHisory" @tap="change"><text class="iconfont icon-left" :class="backActive?'active':''"></text></view>
		<view v-if="!loading" @longpress="reloadData" data-target="forward" @tap="change"><text class="iconfont icon-right1" :class="forwardActive?'active':''"></text></view>
		<view v-if="loading" data-target="stop" @tap="change"><text class="iconfont icon-stop"></text></view>
		<view data-target="bar_input" @tap="change" v-if="bar_input" style="width: 200upx;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"><view style="width: 100%;">{{bar_input}}</view></view>
		<view data-target="home" @longpress="fullscreen" @tap="change"><text class="iconfont icon-home"></text></view>
		<!-- <view data-target="window" @tap="change"><text class="window">1</text></view> -->
		<view data-target="more" @longpress="showMoreWindow" @tap="change"><text class="iconfont icon-more"></text></view>
	</view>
</template>

<script>
import newvuew from '@/utils/newvue.js';
const app = getApp()
export default {
	data() {
		return {
			backActive:false,
			forwardActive:false,
			bar_input:'',
			loading:false,
			fullstate:false
		};
	},
	onLoad() {
		uni.getSystemInfo({
			success: res => {
				console.log(res);
			}
		});
	},
	mounted() {
		this.getBarStyle();
		uni.$on('canBack',(e)=>{
			this.backActive = e.canBack;
		})
		uni.$on('canForward',(e)=>{
			this.forwardActive = e.canForward
		})
		uni.$on('pageurl',(e)=>{
			 this.url = e.wvUrl
			this.bar_input = this.title = e.title
		})
		uni.$on('webviewloading',()=>{
			this.loading = true;
		})
		uni.$on('webviewloaded',()=>{
			this.loading = false;
		})
		uni.$on('fullscreen',(e)=>{
			this.fullstate = e.fullscreen
		})
	},
	
	methods: {
		clearHisory(){
			app.globalData.wv.clear();
			uni.removeStorageSync('history')
			uni.showToast({
				icon:'success',
				title:'全部清除完成'
			})
		},
		reloadData(e){
			app.globalData.wv.reload(true)
		},
		fullscreen(e){
			this.fullstate = true;
			uni.$emit('fullscreen',{fullscreen:true, component: this })
		},
		showMoreWindow(){
			uni.$emit('moreWindow',{component: this })
		},
		inblur(){
			this.bar_input = this.title;
		},
		infocus(){
			this.bar_input = this.url;
		},
		getBarStyle() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.footercontent')
				.boundingClientRect(ctx => {
					uni.$emit('barstyle', ctx);
				})
				.exec();
		},
		change(e) {
			let target = e.currentTarget.dataset.target;

			switch (target) {
				case 'forward':
					uni.$emit('bar-forward', { component: this });
					break;
				case 'back':
					uni.$emit('bar-back', { component: this });
					break;
				case 'more':
				uni.$emit('bar-more', { component: this });
					uni.navigateTo({
						url: '/pages/menu/menu',
						animationType:'slide-in-bottom'
					});
					break;
				case 'home':
					uni.$emit('bar-home', { component: this });
					this.bar_input = ''
					uni.reLaunch({
						url: '/pages/main/main'
					});
					break;
				case 'bar_input':
					app.globalData.searUrl = this.url;
					uni.navigateTo({
						url:'/pages/search/search',
						animationType:'fade-in',
						success: (res) => {
							console.log('search')
						}
					})
				break;
				case 'stop':
					uni.$emit('webviewstop',{ component: this })
				break;
				case 'window':
					newvuew.$emit('window', { type: 'open' });
					break;
			}
		}
	}
};
</script>

<style lang="less">
.footercontent {
	position: fixed;
	height: 80upx;
	background-color: #ffffff;
	bottom: 0;
	display: flex;
	flex-direction: row;
	padding-top: 10upx;
	padding-bottom: 10upx;
	left: 0;
	right: 0;
	align-items: center;
	justify-content: space-around;
	.active{
		color: #007AFF;
	}
}
.bartext {
	font-size: 24upx;
}
.barImg {
	width: 50upx;
	height: 50upx;
}
.window {
	width: 50upx;
	height: 50upx;
	border-width: 1px;
	border-style: solid;
	text-align: center;
	line-height: 50upx;
	font-size: 26upx;
	border-color: #8a8a8a;
}
</style>
