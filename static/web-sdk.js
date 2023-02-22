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
				console.log('webview')
				webSDK.DownloadListener&&webSDK.DownloadListener(url)
				webSDK.sendMessage({
					action: 'download',
					url: encodeURIComponent(url)
				})
			}
		});
		plus.android.invoke(nwv, 'setDownloadListener', DownloadListener);
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


	// 获取所有视频标签
	function getAllVideoTag() {
		let videos = document.querySelectorAll('video');
		videos.forEach(function(item, index) {
			if (item.autoplay) {
				item.pause();
				openSysVideo(item.src)
				return;
			}
			item.addEventListener('playing', function() {
				item.pause();
				openSysVideo(item.src)
			})
		})
	}

	// 获取子集
	function getChildren(parent) {
		// console.log(parent.nodeType==3?parent.nodeValue:parent.nodeName);
		for (var i = 0, len = parent.childNodes.length; i < len; i++) {
			// console.log(parent.childNodes[i].tagName);
			if (parent.childNodes[i].tagName == 'A') {
				touchEle[0] = parent.childNodes[i]
			}
			if (parent.childNodes[i].tagName == 'IMG') {
				touchEle[1] = parent.childNodes[i]
			}
			getChildren(parent.childNodes[i])
		}
	}
	let parentCount = 0;
	// 遍历父节点是否是链接
	function getParents(node) {
		parentCount++;

		let link = node;
		// 只遍历5层
		if (parentCount == 5) {
			return link;
		}
		// 找到链接和图片直接返回
		if (node.tagName == 'A' || node.tagName == 'IMG' || node.tagName == 'IFRAME') {
			Link = node;
			return link
		}
		let parentNode = node.parentNode
		if (parentNode) {
			if (parentNode.tagName == 'A' || parentNode.tagName == 'IMG' || parentNode.tagName == 'IFRAME') {
				link = parentNode
			} else {
				getParents(parentNode)
			}
		} else {
			return node;
		}
		return link;
	}

	var longShow = function(target) {
		parentCount = 0;
		var tagName = target.tagName;
		var hostname = location.hostname;


		var ele = getParents(target);
		var src = '';
		var href = '';
		var className = '&className=' + ele.className;
		var text = '&text=' + ele.textContent;

		if (ele.tagName == 'A') {
			tagName = 'A';
			href = '&href=' + encodeURIComponent(ele.href);
			className = '&className=' + ele.className;
			text = '&text=' + ele.textContent
		} else if (ele.tagName == 'IMG') {
			tagName = 'IMG';
			src = '&src=' + encodeURIComponent(ele.src);
			className = '&className=' + ele.className;
			text = '&text=' + ele.textContent
		} else {
			tagName = target.tagName;
			href = '&href=' + encodeURIComponent(target.href);
			src = '&src=' + encodeURIComponent(target.src);
			className = '&className=' + target.className;
			text = '&text=' + target.textContent
		}

		var Param = '?type=' + tagName + '&from=web' + '&hostname=' + hostname + className + href + text + src;
		var nottag = ['A', 'IMG', 'IFRAME', 'VIDEO'];
		var isHas = false;
		for (var j = 0, len = nottag.length; j < len; j++) {
			if (nottag[j] == tagName) {
				isHas = true;
				break;
			}
		}

		if (!isHas) return;
		window.webviewCG.webView.navigateTo({
			url: '/pages/popup/popup' + Param
		})

	}
	var longClick = function() {
		var timeOutEvent = null;
		var longTarget = null;

		var gtouchstart = function(event) {
			// event.preventDefault();
			event.stopPropagation();
			var touch = event.touches[0];
			touchX = touch.clienX || event.target.offsetLeft;
			touchY = touch.clientY || event.target.offsetTop;

			longTarget = event.target;
			timeOutEvent = setTimeout(longPress, 500);
			return false;
		};

		var gtouchend = function(event) {
			// event.preventDefault();
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
	}
	if (setting.videoPLay) {
		getAllVideoTag()
	}
	webSDK.getClickTarget = function() {
		if (setting.videoPLay) {
			getAllVideoTag()
		}
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
