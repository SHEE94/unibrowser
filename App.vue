<script>
import update from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
import db from './utils/db.js';
import { ADBlock } from './utils/ADBlock.js';

export default {
	globalData: {
		appUpdate: update,
		isAd: url => {
			return ADBlock.isAd(url);
		},
		settingConfig: {
			pullLoad: false,
			videoPLay: false,
			canvas: false,
			resLog: false,
			switchWindow: false,
			arm: 220,
			downloadCurrent: 0
		},
		Dlan:{}
	},
	onLaunch: function() {
		
		this.globalData.Dlan = uni.requireNativePlugin('JX-Dlna');
		let settingConfig = uni.getStorageSync('settingConfig');
		if (!settingConfig) {
			uni.setStorageSync('settingConfig', this.globalData.settingConfig);
		}
		// let adbInit = ADBlock.init();
		// ADBlock.on('LOADED', AD_HOSTS => {
		// 	// console.log(ADBlock.isAd('http://img16.diyifanwen.com/ads/asda.png'));
		// });

		// this.down()
		update();
		console.log('App Launch');
		let arg = plus.runtime.arguments;
		let ua =
			uni.getStorageSync('UA') ||
			'Mozilla/5.0 (Linux; Android 7.1.2; V1923A Build/N2G47O; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.70 Mobile Safari/537.36 SCRIPT/2.0';
		plus.navigator.setUserAgent(ua, false);

		if (arg) {
			if (typeof arg == 'string') {
				arg = JSON.parse(arg);
			}
			if (arg.url) {
				uni.$emit('OPEN-Shortcut', { url: arg.url });
			}
			if (arg.targeturl) {
				uni.navigateTo({
					url: '/pages/browser/browser?url=' + arg.targeturl,
					animationType: 'fade-in'
				});
			}
		}
		this.getScript();
		plus.navigator.closeSplashscreen();
		this.message()
	},
	onShow: function() {
		
		plus.globalEvent.addEventListener('newintent', () => {
			let arg = plus.runtime.arguments;
			if (typeof arg == 'string') {
				try {
					arg = JSON.parse(arg);
				} catch (e) {
					//TODO handle the exception
				}
			}
			if (arg.targeturl) {
				uni.navigateTo({
					url: '/pages/browser/browser?url=' + arg.targeturl,
					animationType: 'fade-in'
				});
			} else if (arg.length > 0) {
				uni.navigateTo({
					url: '/pages/browser/browser?url=' + arg,
					animationType: 'fade-in'
				});
			}
		});
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
		message() {
			plus.globalEvent.addEventListener('plusMessage', msg => {
				if (msg.data.args.data.name == 'postMessage') {
					const info = msg.data.args.data.arg;
					console.log(info)
				}
			});
		},
		getScript() {
		
		}
	}
};
</script>

<style>
@import url('http://at.alicdn.com/t/font_2480200_3yzz8czk5xo.css');
@import url('./utils/iconfont.css');
/*每个页面公共css */
view {
	color: #515151;
}
</style>
