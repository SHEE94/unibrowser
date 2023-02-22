<template>
	<view><web-view :src="src"></web-view></view>
</template>

<script>
let testWV;
// const script_1 = require('./str.js');
export default {
	data() {
		return {
			src: 'https://www.baidu.com/',
			searchEngin:'https://www.baidu.com/s?wd='
		};
	},
	onLoad(options) {		
		let url = options.url;
		let reg = /^http/;
		if (!reg.test(url)) {
			if (/^www./.test(url)) {
				url = 'https://' + url;
			} else {
				url = this.searchEngin + url;
			}
			this.src = url;
		} else {
			this.src = url;
		}
		let currentWebview = this.$scope.$getAppWebview();
		let debug_script = plus.storage.getItem('debug_script');
		setTimeout(() => {
			testWV = currentWebview.children()[0];
			testWV.appendJsFile('_www/static/webview.js');
			testWV.appendJsFile('_www/static/web-sdk.js');
			testWV.appendJsFile('_www/static/vconsole.min.js');
			testWV.addEventListener('loaded', e => {
				
				let script_1 = `if(typeof VConsole !== 'undefined'){
					var cvcscript = document.createElement("script");
						cvcscript.src = "https://env-qoymgmtn-1257446115.tcloudbaseapp.com/vconsole.min.js";
						document.getElementsByTagName('head')[0].appendChild(cvcscript);
				} 
					var stopTime = setInterval(function(){
						if (typeof VConsole !== 'undefined') {
							clearInterval(stopTime)
							window.vConsole = new VConsole();
						}
					},500)`;
				script_1 = `try {
   eruda.init();
   eruda.show() ;
} catch (e) {
    
}`;
				testWV.evalJS(script_1);
				if(debug_script){
					testWV.evalJS(JSON.parse(debug_script).data);
				}
			});
		}, 500);
	}
};
</script>

<style lang="less"></style>
