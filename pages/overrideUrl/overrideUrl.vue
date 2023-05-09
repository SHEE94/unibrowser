<template>
	<view>
		<textarea v-model="urls" placeholder-style="font-size:12px" :placeholder='$t("resourcelog.tips.6")' style="width: 100%;height: 400px;padding: 30px;box-sizing: border-box;"/>
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
