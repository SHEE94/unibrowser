<template>
	<view>
		<video style="height: 100vh;width: 100%;" :src="src" controls codec="software"></video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src:''
			}
		},
		onLoad(options) {
			this.src = decodeURIComponent(options.src)
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
