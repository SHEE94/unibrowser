var cgsdk = function() {
	
	var webview = plus.webview.currentWebview();
	var webSDK = {
		current:webview
	};
	var touchX = 0;
	var touchY = 0;
	var touchEle = [];

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
	webSDK.sendMessage = function(obj) {
		setTimeout(function(){
			cg.webView.navigateTo({
				url: '/pages/popup/popup?from=webdata'+'&jsonback='+encodeURI(JSON.stringify(obj))
			
			})
		},1000)
	}
	var longShow = function(target) {
		parentCount = 0;
		var tagName = target.tagName;
		var hostname = location.hostname;
		if(target.tagName == 'CANVAS'||target.tagName == 'INPUT'||target.tagName == 'BUTTON')return;
		
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
		
		cg.webView.navigateTo({
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

	longClick()
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
		window.webSDK = webSDK;
	}
}

if (window.plus) {
	cgsdk();
} else {
	document.addEventListener('plusready', cgsdk, false);
}
