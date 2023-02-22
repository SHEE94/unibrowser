<template>
	<view>
		<textarea v-model="urls" placeholder-style="font-size:12px" placeholder="拦截链接关键词多个使用英文逗号 “ , ”隔开,如 baidu,www.weibo,zhihu.com 请勿使用过长的链接,最好使用域名的关键字就行" style="width: 100%;height: 400px;padding: 30px;box-sizing: border-box;"/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				urls:''
			}
		},
		onUnload() {
			uni.setStorageSync('overrideurl',this.urls)
		},
		onHide() {
			uni.setStorageSync('overrideurl',this.urls)
		},
		onLoad() {
			this.urls = uni.getStorageSync('overrideurl')||'';
			
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
