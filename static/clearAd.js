!(function() {
	var stop
	var clearAd = {
		//由于manifest文件匹配规则只有通配没有非功能，所以可在此处添加不想删除广告的页面
		checkUrl: function() {
			var Checkflag = 0,
				url = window.location.href;

			//手动添加不需要清除广告的域
			var notDel = ['www.baidu.com', 'taobao.com', 'tmall.com', 'jd.com'];

			//正则匹配
			for (var i = 0; i < notDel.length; i++) {
				var reg = new RegExp(notDel[i], 'g');

				if (reg.test(url)) {
					console.log('This page does not clear ads.');
					break;
				} else {
					if (i == notDel.length - 1) {
						Checkflag = 1;
					}
				}
			}

			if (Checkflag == 1) {
				this.clear();
				this.findSomeAdPossible();
			}
		},
		clear: function() {
			console.log('Clear Start');
			//此处可手动添加广告框id名，去除顽疾ad必备
			var ad_id_name = [
				'cproIframe2001holder',
				'cproIframe2002holder',
				'cproIframe2003holder',
				'cproIframe2004holder',
				'cproIframe2005holder',
				'cproIframe2006holder',
				'cproIframe2007holder',
				'cproIframe2008holder',
				'cproIframe2009holder',
				'id_300x250_banner_top',
				'ads',
				'google_image_div',
				'mx_cs_71603_1261456',
				'AC_TR86_71603',
				'cproIframe_u2060917_1',
				'content_right',
				'left-promotion',
				'top_ads',
				'layerd',
				'MGaSHEeYYE',
				'z747'
			];
			//此处添加广告框类名
			var ad_css_name = ['cproIframe_u410704_3', 'img_ad', 'hover_btn'];

			for (var i = 0; i < ad_id_name.length; i++) {
				document.querySelectorAll('#' + ad_id_name[i]).forEach(item => {
					item.style.display = 'none'
					item.style.visibility = 'hidden'
				})
			}

			for (var i = 0; i < ad_css_name.length; i++) {
				document.querySelectorAll('.' + ad_css_name[i]).forEach(item => {
					// item.remove()
					item.style.display = 'none'
					item.style.visibility = 'hidden'
				})
			}
		},
		//简单算法
		findSomeAdPossible: function() {

			var div = document.querySelectorAll('div');
			var float_img = document.querySelectorAll('img');
			var a = document.querySelectorAll('a');
			var iframe = document.querySelectorAll('iframe');

			this.arrayDel(div);
			this.arrayDel(float_img);
			this.arrayDel(a);
			this.arrayDel(iframe)
		},
		arrayDel: function(arr) {
			var len = arr.length;
			var clearMaxHeight = 220;
			var clearMinHeight = 60;
			for (var i = 0; i < len; i++) {
				var self = arr[i];

				if (this.getStyle(self, 'position') == 'fixed' || this.getStyle(self, 'position') ==
					'absolute') {
					var width = this.getStyle(self, 'width').replace('px', '');
					var height = this.getStyle(self, 'height').replace('px', '');

					var setdom = function(th) {
						th.style.display = 'none'
						th.style.visibility = 'hidden'
					}

					if ((width == '100%' && height <= clearMaxHeight && height > clearMinHeight) || (
							width >= (innerWidth - 10) && height <= clearMaxHeight && height >
							clearMinHeight)) {
						setdom(self)
					}
				}
			}
		},
		getStyle(dom, css) {
			var styles = window.getComputedStyle(dom)
			return styles[css]
		},
		init: function() {
			this.checkUrl();
		}
	};
	window.onload = function() {
		
		
		clearAd.init();
		setTimeout(function() {
			var style = document.createElement('style');
			style.innerHTML = 'body::after,html::after{content: none;}'
			document.body.appendChild(style)
			clearAd.init();
		}, 2000);
	}
})();
