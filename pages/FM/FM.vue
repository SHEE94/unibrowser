<template>
	<view>
		<file-management></file-management>
	</view>
</template>

<script>
	import FM from './file-management/single-file.vue'
	const app = getApp();
	export default {
		components:{
			fileManagement:FM
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less">

</style>
