<template>
	<view>
		<textarea v-model="UserAgent" placeholder="UA" style="padding: 30upx; width: 100%;height: 400upx; box-sizing: border-box;background-color: #eee;"/>
		<view class="ua-list">
			<uni-list>
			    <uni-list-item :title="item.title" :note="item.ua" v-for="(item,index) in uaList" :key="index" :clickable="true" @click="change(item.ua)"></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				UserAgent:'',
				uaList:[{title:'QQ浏览器',ua:'User-Agent: MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',active:false},
				{title:'Opera浏览器',ua:'User-Agent: Opera/9.80 (Android 2.3.4; Linux; Opera Mobi/build-1107180945; U; en-GB) Presto/2.8.149 Version/11.10',active:false},
				{title:'BlackBerry浏览器',ua:'User-Agent: Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.337 Mobile Safari/534.1+',active:false},
				{title:'WebOS HP Touchpad',ua:'User-Agent: Mozilla/5.0 (hp-tablet; Linux; hpwOS/3.0.0; U; en-US) AppleWebKit/534.6 (KHTML, like Gecko) wOSBrowser/233.70 Safari/534.6 TouchPad/1.0',active:false},
				{title:'UC浏览器',ua:'User-Agent: NOKIA5700/ UCWEB7.0.2.37/28/999',active:false},
				{title:'safari浏览器',ua:'User-Agent:Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5',active:false},
				{title:'Chrome – MAC',ua:'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',active:false},
				{title:'safari – MAC',ua:'User-Agent:Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',active:false},
				{title:'默认',ua:'Mozilla/5.0 (Linux; Android 7.1.2; V1923A Build/N2G47O; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.70 Mobile Safari/537.36 SCRIPT/2.0',active:true},]
			};
		},
		mounted() {
			this.UserAgent = uni.getStorageSync('UA')||this.uaList[this.uaList.length-1].ua;
		},
		onUnload() {
			uni.setStorageSync('UA',this.UserAgent)
			plus.navigator.setUserAgent(this.UserAgent, false)
		},
		methods:{
			change(ua){
				uni.showToast({
					icon:'success',
					title:'已切换'
				})
				this.UserAgent = ua
			}
		}
	}
</script>

<style lang="less">
.ua-list{
	padding: 15px;
	margin-top: 20px;
}
</style>
