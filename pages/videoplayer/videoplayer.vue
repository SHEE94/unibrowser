<template>
	<view class="video-content" @click="player">
		<!-- <video style="height: 100%;width: 100%;" :src="src" controls codec="software"></video> -->
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
			this.player()
		},
		methods: {
			player(e){
				var Intent = plus.android.importClass("android.content.Intent");
				var Uri = plus.android.importClass("android.net.Uri");  
				var main = plus.android.runtimeMainActivity();  
				var intent=new Intent(Intent.ACTION_VIEW);  
				var uri=Uri.parse(this.src);  
				intent.setDataAndType(uri,"video/*");  
				main.startActivity(intent);
			}
		}
	}
</script>

<style>
.video-content{
	height: 100vh;
	background-color: #000000;
	
}
</style>
