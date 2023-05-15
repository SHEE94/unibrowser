"use strict";
try {
	(function() {
		const startTime = Date.now()
		cgsdk = function() {

			console.log('SDK LOADED')
			window.WEB_SDK_LOADED = true;
			const version = '2.0.0';
			plus.share = null;
			plus.payment = null;
			plus.messaging = null;
			plus.contacts = null;
			plus.gallery = null;
			plus.push = null;
			const webview = plus.webview.currentWebview();
			const storage = plus.storage;
			const _setTimeout = window.setTimeout

			const require = function(src) {
				if (!src) return;
				return new Promise(function(resolve, reject) {
					let s = document.createElement('script', {
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


			const webSDK = {
				current: webview,
				version: version,
				sendMessage: function(obj) {
					window.webviewCG.webView.postMessage({
						data: {
							from: 'webdata',
							jsonback: obj
						}
					});

				},
				storage: {
					setItem: function(key, value) {
						if (!key || !value) return;
						if (typeof value == 'object') {
							value = JSON.stringify(value)
						}
						storage.setItem(key, value)
					},
					getItem: function(key) {
						if (!key) return;
						let val = storage.getItem(key);
						if (typeof val == 'string') {
							val = JSON.parse(val)
						}
						return val;
					},
					removeItem: function(key) {
						if (!key) return;
						storage.removeItem(key)
					}
				}
			};


			let touchX = 0;
			let touchY = 0;

			let settingConfigObj = plus.storage.getItem('settingConfig')
			if (typeof settingConfigObj == 'string') {
				settingConfigObj = JSON.parse(settingConfigObj);
			}
			let setting = settingConfigObj.data;

			// 网站单独设置
			let websiteSetting = webSDK.storage.getItem('websiteSetting') || {
				data: {}
			}
			let host = location.hostname
			let websiteSettingData = websiteSetting.data
			if (websiteSettingData[host]) {
				setting = Object.assign(setting, {}, websiteSettingData[host])
			}


			// 监听下载
			let nwv = webview.nativeInstanceObject();
			if (setting.downloadCurrent != 0 && !setting.autoDownload) {
				let DownloadListener = plus.android.implements('android.webkit.DownloadListener', {
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
			if (setting.autoDownload) {
				let DownloadListener = plus.android.implements('android.webkit.DownloadListener', {
					onDownloadStart: function(url) {
						return false;
					}
				});
				plus.android.invoke(nwv, 'setDownloadListener', DownloadListener);
			}


			class websiteStatistics {
				constructor() {
					let that = this;
					const host = window.location.hostname;
					this.Data = {
						scriptCount: 0,
						speed: 0,
						addLinkCount: 0,
						host: host,
						storageCount: 0,
						clipboardCount: 0,
						timerCount: 0,
						addNodeCount: 0,
						location: 0
					}

					this.statisticsName = `${host}_statistics`

					if (typeof _statistics == 'string') {
						_statistics = JSON.parse(_statistics)
					}


					if (setting.timer) {
						window.setTimeout = function() {
							that.Data.timerCount++
							_setTimeout.apply(this, arguments)
						}
						const _setInterval = window.setInterval
						window.setInterval = function() {
							that.Data.timerCount++
							_setInterval.apply(this, arguments)
						}
						const _requestAnimationFrame = window.requestAnimationFrame
						window.requestAnimationFrame = function() {
							that.Data.timerCount++
							_requestAnimationFrame.apply(this, arguments)
						}
					}

					window.addEventListener('storage', function() {
						that.Data.storageCount++;
					})
					let _getCurrentPosition = window.navigator.geolocation.getCurrentPosition
					window.navigator.geolocation.getCurrentPosition = function() {
						that.Data.location++;
						that.send()
						if (!setting.location) return;
						return _getCurrentPosition.apply(this, arguments)
					}

					window.addEventListener('DOMContentLoaded', function() {
						that.Data.speed = Date.now() - startTime;
						// 开发者工具
						if (setting.dev) {
							(function() {
								var script = document.createElement('script');
								script.src = "//cdn.jsdelivr.net/npm/eruda";
								document.body.appendChild(script);
								script.onload = function() {
									eruda.init()
								}
							})();
						}
					})
				}
				send() {

					webSDK.sendMessage({
						action: 'statistics',
						data: this.Data
					})
				}
				// 添加脚本
				addScript() {
					this.Data.scriptCount++;
				}
				// 添加链接
				addLink() {
					this.Data.addLinkCount++;
				}
				// 添加节点
				addNodes() {
					this.Data.addNodeCount++;
				}
				addClip() {
					this.Data.clipboardCount++;
				}
			}


			const $websiteStatistics = new websiteStatistics();

			webSDK.$websiteStatistics = $websiteStatistics;

			window.sendStatics = function() {
				$websiteStatistics.send()
			}

			let $replece = location.replace

			location.replace = function(url) {
				let reg = /\/\/.*\//;
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
			let _historyWrap = function(type) {
				let orig = history[type];
				let e = new Event(type);
				return function() {
					let rv = orig.apply(this, arguments);
					e.arguments = arguments;
					window.dispatchEvent(e);
					return rv;
				};
			};
			history.pushState = _historyWrap('pushState');
			history.replaceState = _historyWrap('replaceState')
			// 打开系统播放器
			/**
			 * @param {string} src
			 */
			function openSysVideo(src) {
				let Intent = plus.android.importClass("android.content.Intent");
				let Uri = plus.android.importClass("android.net.Uri");
				let main = plus.android.runtimeMainActivity();
				let intent = new Intent(Intent.ACTION_VIEW);
				let uri = Uri.parse(src);
				intent.setDataAndType(uri, "video/*");
				main.startActivity(intent);
			}
			webSDK.openSystemPlayer = openSysVideo


			let $play = HTMLVideoElement.prototype.play;
			HTMLVideoElement.prototype.play = function() {

				if (setting.videoPLay) {
					openSysVideo(this.getAttribute('src'))
					return;
				}
				$play.apply(this, arguments)
			}




			function interceptClip() {
				let $execCommand = document.execCommand;
				document.execCommand = function() {
					let type = arguments[0]
					if (type == 'copy' || type == 'cut') {
						$websiteStatistics.addClip()
						plus.nativeUI.toast(decodeURI(
							'%E5%B7%B2%E9%98%BB%E6%AD%A2%E7%BD%91%E9%A1%B5%E5%86%99%E5%85%A5%E5%89%AA%E5%88%87%E6%9D%BF'
						))
						return false;
					}
					$execCommand.apply(this, arguments)
				}

				let not = function() {
					$websiteStatistics.addClip()
					plus.nativeUI.toast(decodeURI(
						'%E5%B7%B2%E9%98%BB%E6%AD%A2%E7%BD%91%E9%A1%B5%E5%86%99%E5%85%A5%E5%89%AA%E5%88%87%E6%9D%BF'
					))
					return Promise.resolve(false);
				}
				if (navigator.clipboard) {
					let $writeTex = navigator.clipboard.writeTex;
					navigator.clipboard.writeTex = function() {
						return not()
					}
					let $write = navigator.clipboard.write;
					navigator.clipboard.write = function() {
						return not()
					}
				}
			}

			if (!setting.clipboard) {
				interceptClip()
			} else {
				let $execCommand = document.execCommand;
				document.execCommand = function() {
					$websiteStatistics.addClip()
					$execCommand.apply(this, arguments)
				}
				if (navigator.clipboard) {
					let $writeTex = navigator.clipboard.writeTex;
					navigator.clipboard.writeTex = function() {
						$websiteStatistics.addClip()
						return true
					}
					let $write = navigator.clipboard.write;
					navigator.clipboard.write = function() {
						$websiteStatistics.addClip()
						return true
					}
				}
			}


			// 定时器清除
			function timer() {
				window.setInterval = function() {
					return 1
				}

				window.setTimeout = function() {
					return 1
				}

				window.requestAnimationFrame = function() {
					return 1
				}
			}
			if (!setting.timer) {
				timer()
			}

			const _appendChild = HTMLElement.prototype.appendChild
			if (!setting.nonstandardTag) {
				let nodelist =
					'tbody,tr,td,a,div,article,img,input,script,iframe,canvas,main,section,ul,li,h1,h2,h3,h4,h5,h6,nav,video,p,header,footer,style,link,table,span,fieldset,select,option,form,label,hr,i,br';

				HTMLElement.prototype.appendChild = function(node) {
					let tagname = node.tagName
					if (typeof tagname == 'undefined' || !nodelist.includes(tagname.toLocaleLowerCase())) {
						return null;
					}

					if (tagname.toLocaleLowerCase() == 'video') {
						node.setAttribute('controls', 'controls')
						node.setAttribute('autoplay', false);
						return _appendChild.apply(this, arguments);
					}

					if (tagname.toLocaleLowerCase() == 'script') {
						$websiteStatistics.addScript()
					}
					if (tagname.toLocaleLowerCase() == 'a') {
						$websiteStatistics.addLink()
					}
					$websiteStatistics.addNodes()
					return _appendChild.apply(this, arguments);
				}
			} else {
				HTMLElement.prototype.appendChild = function(node) {
					let tagname = node.tagName
					if (tagname) {
						if (tagname.toLocaleLowerCase() == 'script') {
							$websiteStatistics.addScript()
						}
						if (tagname.toLocaleLowerCase() == 'a') {
							$websiteStatistics.addLink()
						}
					}
					$websiteStatistics.addNodes()

					return _appendChild.apply(this, arguments);
				}
			}

			const _alert = window.alert
			const _confirm = window.confirm



			let getHostname = () => {
				let _location = window.location;
				let hostname = _location.hostname.split('.')[1]
				return hostname
			}
			let alertCount = false
			let clickedUrl = ''

			function otherWebsite() {
				if (setting.otherWebsite) {
					function clickLink(url) {

						let a = document.createElement('a')
						a.href = url
						a.target = '_blank';
						a.click()
						a.remove()
						alertCount = false;
					}

					const preventDefault = function(e, url) {
						e.preventDefault();
						if (!url || alertCount) return;
						alertCount = true;
						let con = confirm('网页正在跳转第三方网站是否允许？网址：' + url);

						if (con) {
							clickLink(url);
						} else {
							alertCount = false
						}
					}

					let hostname = getHostname();
					let Alinks = document.querySelectorAll('a')

					Alinks.forEach(function(item) {
						let url = item.href;
						if (!url.includes(hostname) && !item.hasEvent) {
							item.addEventListener('click', function(e) {
								e.preventDefault();
								preventDefault(e, url)
							})
							item.hasEvent = true;
						}
					})
				}
			}




			// ++++++++++++++++++++++++++++++++++
			otherWebsite()

			window.addEventListener('DOMContentLoaded', function() {

				window.WebKitMutationObserver ||
					window.MozMutationObserver;

				const observeMutationSupport = !!MutationObserver;
				if (observeMutationSupport) {
					let observer = new MutationObserver(function(records) {
						otherWebsite()
					});
					let body = document.querySelector('body')
					observer.observe(body, {
						'childList': true,
						'subtree': true
					})
				}
			})

			// +++++++++++++++++++++++++++++++++++++




			// 动态脚本
			function addScript() {
				let createElement = document.createElement;
				document.createElement = function(tag) {
					if (tag.toLocaleLowerCase() == 'script') {
						arguments[0] = 'div'
						return createElement.apply(this, arguments);
					}
					return createElement.apply(this, arguments);
				}
			}

			if (!setting.addScript) {
				addScript()
			}


			function fingerprint() {
				function randomNum(n) {
					let res = ''
					for (let i = 0; i < n; i++) {
						res += Math.floor(Math.random() * 10);
					}
					return res;
				}
				window.innerWidth = window.innerHeight = Math.floor(Math.random() * 900);
				window.navigator.userAgent = window.navigator.userAgent += randomNum(10);
				window.navigator.platform = randomNum(10);
				window.navigator.language = randomNum(10);
				localStorage[randomNum(5)] = randomNum(10);
			}
			if (setting.fingerprint) {
				fingerprint()
			}

			// 选中的标签
			let actionTag = ['A', 'IMG', 'IFRAME', 'VIDEO'];

			/**
			 * @param {number} x
			 * @param {number} y
			 * @returns {Array<HTMLElement>}
			 */
			function getActionNodes(x, y) {
				let nodes = document.elementsFromPoint(x, y)
				let tages = []
				for (let i = 0, len = nodes.length; i < len; i++) {
					if (actionTag.includes(nodes[i].tagName)) {
						tages.push(nodes[i]);
					}
				}
				return tages;
			}

			/**
			 * @param {HTMLElement} target
			 * @returns {Array<HTMLElement>}
			 */
			function getTargetActionNodes(_target) {
				let nodes = [];

				function getNodes(target) {
					let parentNode = target.parentNode;
					if (actionTag.includes(target.tagName)) {
						nodes.push(target)
					}
					parentNode ? getNodes(parentNode) : getNodes = null;
				}
				getNodes(_target)
				return nodes;
			}

			/**
			 * @param {HTMLElement} target
			 */
			const longShow = function(target) {

				let hostname = location.hostname;
				let eles = getActionNodes(touchX, touchY) || getTargetActionNodes(target);

				let tagName,
					eleSrc,
					eleHref,
					eleClassName,
					eleText;

				eles.forEach(function(ele) {
					tagName = ele.tagName
					if (ele.src) {
						eleSrc = encodeURIComponent(ele.src)
					}
					if (ele.href) {
						eleHref = encodeURIComponent(ele.href)
					}
					eleClassName = ele.className
					eleText = ele.textContent;
				})

				let src = '&src=' + eleSrc;
				let href = '&href=' + eleHref;
				let className = '&className=' + eleClassName;
				let text = '&text=' + eleText;
				if (!actionTag.includes(tagName)) return;

				let Param = '?type=' + tagName + '&from=web' + '&hostname=' + hostname + className + href +
					text + src;

				window.webviewCG.webView.postMessage({
					data: {
						from: 'web',
						jsonback: {
							type: tagName,
							from: 'web',
							hostname: hostname,
							className: eleClassName,
							href: eleHref,
							text: eleText,
							src: eleSrc,
						}
					}

				})

				window.webviewCG.webView.navigateTo({
					url: '/pages/popup/popup' + Param
				})

			}


			let readyEvent = new CustomEvent("SDK-READY", {
				detail: webSDK
			});
			_setTimeout(function() {
				if (window.dispatchEvent) {
					window.dispatchEvent(readyEvent);
				} else {
					window.fireEvent(readyEvent);
				}
			}, 10)
			if (!window.webSDK) {
				document.addEventListener('contextmenu', function(event) {
					touchX = event.x;
					touchY = event.y;
					let target = event.target;
					longShow(target)
				})
				window.webSDK = webSDK;
			}
		}

		if (!window.WEB_SDK_LOADED) {
			window.plus ? cgsdk() : document.addEventListener('plusready', cgsdk, false);
		}

	})()
} catch (e) {
	//TODO handle the exception
	console.log('SDK load fail')
	console.warn(JSON.stringify(e.message))
}