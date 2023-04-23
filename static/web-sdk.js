var cgsdk = function() {
	plus.share = null;
	plus.payment = null;
	plus.messaging = null;
	plus.contacts = null;
	plus.gallery = null;
	plus.push = null;
	var webview = plus.webview.currentWebview();
	var jsondata = plus.storage.getItem('jsondata');
	var storage = plus.storage;

	var require = function(src) {
		if (!src) return;
		return new Promise(function(resolve, reject) {
			var s = document.createElement('script', {
				pass: true
			});
			s.src = src;
			s.async = true;
			s.onload = function() {
				resolve(true)
			}
			s.onerror = function() {
				resolve(false)
			}
			document.body.appendChild(s);
		})
	}

	window.$require = require;

	var webSDK = {
		current: webview,
		sendMessage: function(obj) {
			plus.storage.setItem('jsondata', typeof obj == 'string' ? obj : JSON.stringify(obj))

			window.webviewCG.webView.navigateTo({
				url: '/pages/popup/popup?from=webdata' + '&jsonback=' + encodeURI(typeof obj ==
					'string' ? obj : JSON.stringify(obj))
			})
			plus.storage.removeItem('jsondata')
		},
		storage: {
			setItem: function(key, value) {
				if (!key || !value) return;
				storage.setItem(key, value)
			},
			getItem: function(key) {
				if (!key) return;
				return storage.getItem(key);
			},
			removeItem: function(key) {
				if (!key) return;
				storage.removeItem(key)
			}
		}
	};
	if (jsondata) {
		webSDK.sendMessage(jsondata)
	}
	var touchX = 0;
	var touchY = 0;
	var touchEle = [];

	var settingConfigObj = plus.storage.getItem('settingConfig')
	if (typeof settingConfigObj == 'string') {
		settingConfigObj = JSON.parse(settingConfigObj);
	}
	var setting = settingConfigObj.data;
	// 监听下载
	var nwv = webview.nativeInstanceObject();
	if (setting.downloadCurrent != 0) {
		var DownloadListener = plus.android.implements('android.webkit.DownloadListener', {
			onDownloadStart: function(url) {
				webSDK.DownloadListener && webSDK.DownloadListener(url)
				webSDK.sendMessage({
					action: 'download',
					url: encodeURIComponent(url)
				})
			}
		});
		plus.android.invoke(nwv, 'setDownloadListener', DownloadListener);
	}


	var $replece = location.replace

	location.replace = function(url) {
		var reg = /\/\/.*\//;
		if (!reg.test(location.href) && !settingConfigObj.redirect) {
			plus.nativeUI.toast(decodeURI(
				'%E5%B7%B2%E9%98%BB%E6%AD%A2%E7%BD%91%E9%A1%B5%E9%87%8D%E5%AE%9A%E5%90%91'))
			return;
		}
		$replece.apply(this, arguments)
	}

	// dlan投屏
	webSDK.Dlan = {
		search: function() {
			webSDK.sendMessage({
				action: 'Dlan-search'
			})
		},
		play: function(opts) {
			if (opts.url.length < 5) return;
			webSDK.sendMessage({
				action: 'Dlan-play',
				url: encodeURIComponent(opts.url),
				id: opts.id,
				title: opts.title
			})
		},
		success: function(json) {},
		complate: function(json) {}
	}
	window.Dlan = webSDK.Dlan.success;
	window.DlanComplate = webSDK.Dlan.DlanComplate

	// 监听路由变化
	var _historyWrap = function(type) {
		var orig = history[type];
		var e = new Event(type);
		return function() {
			var rv = orig.apply(this, arguments);
			e.arguments = arguments;
			window.dispatchEvent(e);
			return rv;
		};
	};
	history.pushState = _historyWrap('pushState');
	history.replaceState = _historyWrap('replaceState')
	// 打开系统播放器
	function openSysVideo(src) {
		var Intent = plus.android.importClass("android.content.Intent");
		var Uri = plus.android.importClass("android.net.Uri");
		var main = plus.android.runtimeMainActivity();
		var intent = new Intent(Intent.ACTION_VIEW);
		var uri = Uri.parse(src);
		intent.setDataAndType(uri, "video/*");
		main.startActivity(intent);
	}
	webSDK.openSystemPlayer = openSysVideo


	var $play = HTMLVideoElement.prototype.play;
	HTMLVideoElement.prototype.play = function() {

		if (setting.videoPLay) {
			openSysVideo(this.getAttribute('src'))
			return;
		}
		$play.apply(this, arguments)
	}


	function interceptClip() {
		var $execCommand = document.execCommand;
		document.execCommand = function() {
			let type = arguments[0]
			if (type == 'copy' || type == 'cut') {
				plus.nativeUI.toast(decodeURI(
					'%E5%B7%B2%E9%98%BB%E6%AD%A2%E7%BD%91%E9%A1%B5%E5%86%99%E5%85%A5%E5%89%AA%E5%88%87%E6%9D%BF'
				))
				return false;
			}
			$execCommand.apply(this, arguments)
		}

		var not = function() {
			plus.nativeUI.toast(decodeURI(
				'%E5%B7%B2%E9%98%BB%E6%AD%A2%E7%BD%91%E9%A1%B5%E5%86%99%E5%85%A5%E5%89%AA%E5%88%87%E6%9D%BF'
			))
			return Promise.resolve(false);
		}
		if (navigator.clipboard) {
			var $writeTex = navigator.clipboard.writeTex;
			navigator.clipboard.writeTex = function() {
				return not()
			}
			var $write = navigator.clipboard.write;
			navigator.clipboard.write = function() {
				return not()
			}
		}


	}

	if (!settingConfigObj.clipboard) {
		interceptClip()
	}

	// 选中的标签
	var actionTag = ['A', 'IMG', 'IFRAME', 'VIDEO'];

	function getActionNodes(x, y) {
		let nodes = document.elementsFromPoint(x, y)

		for (let i = 0, len = nodes.length; i < len; i++) {
			if (actionTag.includes(nodes[i].tagName)) {
				return nodes[i]
			}
		}
		return null;
	}

	var longShow = function(target) {


		var hostname = location.hostname;

		var ele = getActionNodes(touchX, touchY) || target;

		var tagName = ele.tagName;
		var src = '&src=' + encodeURIComponent(ele.src);
		var href = '&href=' + encodeURIComponent(ele.href);
		var className = '&className=' + ele.className;
		var text = '&text=' + ele.textContent;
		if (!actionTag.includes(ele.tagName)) return;

		var Param = '?type=' + tagName + '&from=web' + '&hostname=' + hostname + className + href + text + src;

		window.webviewCG.webView.navigateTo({
			url: '/pages/popup/popup' + Param
		})

	}
	var longClick = function() {
		var timeOutEvent = null;
		var longTarget = null;

		var gtouchstart = function(event) {
			
			event.stopPropagation();
			var touch = event.touches[0];
			touchX = touch.clienX || event.target.offsetLeft;
			touchY = touch.clientY || event.target.offsetTop;

			longTarget = event.target;
			timeOutEvent = setTimeout(longPress, 500);
			return false;
		};

		var gtouchend = function(event) {
			
			event.stopPropagation();
			longTarget = null;
			clearTimeout(timeOutEvent);
			if (timeOutEvent != null) {
				// 单击
				webSDK.getClickTarget && webSDK.getClickTarget(event.target);
			}
			return false;
		};

		var gtouchmove = function(event) {
			event.stopPropagation();
			clearTimeout(timeOutEvent);
			longTarget = null;
			timeOutEvent = null;
		};

		var longPress = function(e) {
			timeOutEvent = null;
			// 长按
			webSDK.getLongCLickTarget && webSDK.getLongCLickTarget(longTarget)
		}
		document.addEventListener('touchstart', gtouchstart);
		document.addEventListener('touchmove', gtouchmove);
		document.addEventListener('touchend', gtouchend);
		document.addEventListener('touchcancel', gtouchmove)
		document.addEventListener('mousecancel', gtouchmove)
	}


	webSDK.getLongCLickTarget = function(target) {
		longShow(target)
	}


	let readyEvent = new CustomEvent("SDK-READY", {
		detail: webSDK
	});
	setTimeout(function() {
		if (window.dispatchEvent) {
			window.dispatchEvent(readyEvent);
		} else {
			window.fireEvent(readyEvent);
		}
	}, 10)
	if (!window.webSDK) {
		longClick()
		window.webSDK = webSDK;
	}
}

if (window.plus) {
	cgsdk();
} else {
	document.addEventListener('plusready', cgsdk, false);
}