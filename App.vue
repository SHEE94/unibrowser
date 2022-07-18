<script>
import db from './utils/db.js'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			let arg = plus.runtime.arguments;
			plus.navigator.setUserAgent('Mozilla/5.0 (Linux; Android 7.1.2; V1923A Build/N2G47O; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.70 Mobile Safari/537.36 SCRIPT/2.0', false)
			if(arg){
				if(typeof arg == 'string'){
					 arg = JSON.parse(arg)
				}
				if(arg.url){
					uni.$emit('OPEN-Shortcut',{url:arg.url})
				}
			}
			this.getScript()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			getScript(){
				db.get('script').then(data=>{
					console.log(data)
					data.forEach(item=>{
						item.name = item.title;
						item.active = false;
						item.install = false;
						item.installPath = ''
					})
					console.log(data)
					uni.setStorageSync('onlineScript',data)
				})
			}
		}
	}
</script>

<style>
	@import url("//at.alicdn.com/t/font_358205_sk5fza10607.css");
	@import url("./utils/iconfont.css");
	/*每个页面公共css */
	view{
		color: #515151;
	}
</style>


