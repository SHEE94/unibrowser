<template>
	<view>
		<web-view src="_www/static/html/codeedit/index.html" @message="message"></web-view>
	</view>
</template>

<script>
	export default {
		data() {this
			return {
			}
		},
		onLoad(options) {
			this._type = options.type;
			this.index = options.index;
			this.postMessage()
		},
		methods: {
			postMessage(e){
				if(!this._type)return;
				plus.storage.setItem('postMessage',JSON.stringify({
					type:'edit',
					data:uni.getStorageSync('script_list')[this.index]
				}))
			},
			message(e){
				
				let scriptList = uni.getStorageSync('script_list')||[]
				let scriptObj = e.detail.data[e.detail.data.length-1].script;
				scriptList.unshift(scriptObj);
				uni.setStorageSync('script_list',scriptList);
			}
		}
	}
</script>

<style>

</style>
