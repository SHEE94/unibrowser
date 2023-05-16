<template>
	<view></view>
</template>

<script>
	const app = getApp();
	let that;
	let fullScreen = false;
	const Intent = plus.android.importClass('android.content.Intent');
	let Webview = plus.android.importClass('android.webkit.WebView');
	const Uri = plus.android.importClass('android.net.Uri');
	const ComponentName = plus.android.importClass('android.content.ComponentName');
	const WebViewClient = plus.android.importClass('android.webkit.WebViewClient');

	const WebChromeClient = plus.android.importClass('android.webkit.WebChromeClient');
	plus.android.importClass('android.webkit.WebSettings');

	const main = plus.android.runtimeMainActivity();
	let intent = new Intent();
	const isAd = app.globalData.isAd;
	const Dlan = app.globalData.Dlan;

	let resRequest = uni.getStorageSync('overrideResourceRequest') || [];
	let host = uni.getStorageSync('host') || [];
	let newrequest = [...resRequest, ...host];

	// 合并过滤规则
	// let matchstr = uni.getStorageSync('matchstr')||[];

	// console.log(matchstr.length)
	// if (!matchstr.length || matchstr.length < newrequest.length) {
	// 	setTimeout(() => {
	// 		for (let i = 0, len = newrequest.length; i < len; i++) {
	// 			if (newrequest[i].length != 0) {
	// 				let obj = {
	// 					match: newrequest[i],
	// 					// redirect: '_www/static/red.jpeg',
	// 					// mime: '(image/jpeg)'
	// 				};
	// 				matchstr = matchstr.concat([obj])
	// 			}
	// 		}
	// 		console.log( matchstr.length,'=======', newrequest.length)
	// 		uni.setStorage({
	// 			key: 'matchstr',
	// 			data: matchstr
	// 		})
	// 	})

	// }



	export default {
		data() {
			return {
				webviewList: [],
				currentWV: 0,
				WVindex: 0, //当前处于哪个页面
				maxWebview: 50, //当前最大可以打开的窗口数量
				newWebview: 'https://cn.bing.com', //'_www/static/html/home/index8.html', //新窗口默认页面
				homeUrl: '',
				searchEngine: 'https://cn.bing.com/search?q=',
				allRes: [],
				initResArr: {
					js: [],
					css: [],
					img: [],
					iframe: [],
					video: []
				},
				settingConfig: {},
				alertCount: 0 //弹窗次数
			};
		},
		beforeCreate() {
			that = this;
		},
		onLoad(options) {
			if (options.url) {
				this.homeUrl = this.to_link(options.url);
			} else {
				this.homeUrl = this.newWebview
			}
			// this.webviewList[this.WVindex].resume();
		},
		onHide() {
			this.offResize();
			this.wvPause()
		},
		deactivated() {
			this.offResize();
		},
		destroyed() {
			this.offResize();
		},
		onShow() {
			this.windowResize();
			if (this.webviewList[this.WVindex]) {
				this.webviewList[this.WVindex].resume()
			}

		},
		onUnload() {
			this.offListener();
		},
		unmounted() {
			this.offListener();
		},
		mounted() {
			this.settingConfig = uni.getStorageSync('settingConfig');
			this.Resource = [];
			this.top = uni.getSystemInfoSync().statusBarHeight + 44;
			this.currentWebview = this.$scope.$getAppWebview();
			this.currentWebview.setStyle({
				hardwareAccelerated: true,
				titleNView: {
					backgroundColor: '#f7f7f7',
					searchInput: {
						align: 'left',
						borderRadius: '8px',
						disabled: true
					},
					buttons: [{
							type: 'menu',
							float: 'right',
							onclick: this.clickMenu
						}, //菜单
						{
							fontSrc: '_www/static/iconfont.ttf',
							text: '\ue612',
							fontSize: '18px',
							float: 'right',
							color: '#515151',
							onclick: this.bgWindow
						}, //后台
						{
							fontSrc: '_www/static/iconfont.ttf',
							text: '\ue617',
							fontSize: '18px',
							float: 'left',
							color: '#515151',
							onclick: this.toHome
						}, //主页
						{
							fontSrc: '_www/static/iconfont.ttf',
							text: '\ue608',
							fontSize: '18px',
							float: 'right',
							onclick: this.clickForward
						}, //前进
						{
							fontSrc: '_www/static/ttf/iconfont2.ttf',
							text: '\ue649',
							fontSize: '18px',
							float: 'right',
							onclick: this.websiteInfo,
							color: '#55aa7f'
						} //网站信息
						// { float: 'right', fontSrc: '_www/static/iconfont.ttf', text: '\ue609', fontSize: '18px' ,onclick:this.canback}
					]
				}
			});
			uni.removeStorageSync('lastPage')

			if (this.settingConfig.lastPage) {
				if (!app.globalData.lastPage.length) {
					this.createWebView(this.homeUrl);
					this.onWebview();
					return
				}
				let lastPage = JSON.parse(JSON.stringify(app.globalData.lastPage));
				app.globalData.lastPage = []
				lastPage.forEach((item) => {
					this.createWebView(item.historyUrl, item.id);
				})

			} else {
				this.createWebView(this.homeUrl);

			}
			this.onWebview();
		},
		onBackPress() {
			this.backPress = true; //用于判断是否点击了返回键以退出横屏全屏
			if (fullScreen) {
				uni.$emit('FULL', false);
				return true;
			}
			this.canback();
			if (this.webviewList.length > 0) {
				return true;
			} else {
				return false;
			}

			/* if (canClose) {
				if (!this.first) {
					this.first = new Date().getTime();
					plus.nativeUI.toast('再按一次退出应用');
					setTimeout(() => {
						this.first = null;
					}, 1000);
				} else {
					if (new Date().getTime() - this.first < 1000) {
						plus.runtime.quit();
					}
				}
			} */
		},

		methods: {
			// 关闭监听
			offListener() {
				uni.$off(['WEB-MESSAGE', 'FULL', 'SWITCH-WEBVIEW', 'BOOK-MARK', 'RELOAD']);
			},
			backHomeCall() {
				uni.removeStorageSync('lastPage')
				app.globalData.lastPage = []
				this.webviewList.length = 0;

				uni.navigateBack({
					animationType: 'fade-out'
				});
			},
			toHome() {
				// this.webviewList[this.WVindex].loadURL(this.homeUrl);
				let fqa = uni.getStorageSync('backhomefqa');

				if (!fqa) {
					uni.showModal({
						content: this.$t("browser.tips.1"),
						success: res => {
							if (res.confirm) {
								this.backHomeCall();
								uni.setStorageSync('backhomefqa', true);
							}
						}
					});
					return;
				}
				this.backHomeCall();
			},
			clickMenu(e) {
				let type = e.type;
				// this.webviewList[this.WVindex].pause();
				this.getResourceList();
				switch (type) {
					case 'menu':
						uni.navigateTo({
							url: '../popup/popup?from=menu'
						});
						break;
				}
			},
			websiteInfo() {
				let wv = this.webviewList[this.WVindex];
				try {
					let link = wv.getURL().split('//')
					wv.evalJS(`
						window.sendStatics()
					`)
					let hostname = link[1].split('/')[0]
					uni.showLoading({
						title: this.$t("website.tips.4")
					})
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/website-info/website-info?hostname=' + encodeURIComponent(
								hostname),
							animationType: 'fade-in',
							success() {
								uni.hideLoading()
							}
						})
					}, 1000)

				} catch (e) {
					console.log(e)
					//TODO handle the exception
				}


			},
			clickForward() {
				let wv = this.webviewList[this.WVindex];
				this.webviewList[this.WVindex].canForward(e => {
					if (e.canForward) {
						wv.forward();
					}
				});
			},
			canback() {
				return new Promise((res, rej) => {
					let wv = this.webviewList[this.WVindex];
					if (!wv) return;
					wv.canBack(e => {
						if (e.canBack) {
							wv.back();
							res(false);
						} else {
							this.webviewList.splice(this.WVindex, 1);
							wv.close();
							this.resetWebview();
							if (this.webviewList.length == 0) {
								this.backHomeCall();
							}
							res(true);
						}
					});
				});
			},
			// 判断横屏竖屏
			windowResize(sysInfo) {
				uni.onWindowResize(res => {
					if (this.backPress) return;
					if (res.size.windowWidth > res.size.windowHeight) {
						fullScreen = true;
						this.fullState(true);
					} else {
						fullScreen = false;
						this.fullState(false);
					}
				});
			},
			// 取消监听
			offResize() {
				uni.offWindowResize(() => {});
			},
			uuid() {
				return Math.random().toString(16).slice(2);
			},

			//记录最后的窗口信息
			saveLastPageInfo(wv) {

				let setList = () => {
					let lastPage = app.globalData.lastPage
					let pageArr = []
					this.webviewList.forEach(item => {
						let obj = {
							id: item.id,
							historyUrl: item.getURL()
						}
						pageArr.push(obj)
					})
					lastPage = pageArr;
					uni.setStorageSync('lastPage', lastPage)
				}
				uni.$on('CLOSE-WINDOW', setList)
				uni.$on('CLOSE-WINDOW-ALL', () => {
					uni.removeStorageSync('lastPage')
					app.globalData.lastPage = []
				})

				wv.addEventListener('loaded', setList)
				wv.addEventListener('close', setList)
			},
			// 获取单独网站配置文件
			getWebsiteConfig(url) {
				let websiteSetting = uni.getStorageSync('websiteSetting') || {}
				for (let key in websiteSetting) {
					if (url.indexOf(websiteSetting) > -1) {
						return websiteSetting[key]
					}
				}
				return null;
			},
			createWebView(url, _id) {

				let id = _id || this.uuid();
				uni.navigateTo({
					url: '../popup/popup?from=back'
				});
				let scriptFiles = uni.getStorageSync('script_dir_file') || [];
				let scriptList = uni.getStorageSync('script_list') || [];
				let onlineScript = uni.getStorageSync('installOnlineScript') || [];
				// #ifdef APP-PLUS
				let left = this.webviewList.length * 100 + '%';
				let wv = plus.webview.create(
					'',
					id, {
						id,
						height: uni.getSystemInfoSync().screenHeight - this.top,
						left: left,
						top: this.top,
						bounce: 'vertical',
						userSelect: true,
						cachemode: 'cacheElseNetwork',
						hardwareAccelerated: true,
						plusrequire: 'ahead',
						videoFullscreen: 'landscape-primary',
						progress: {
							color: '#4580ee',
							height: '2px'
						},
						scalable: true
					}, {
						index: this.currentWV,
						data: {
							name: 'web'
						}
					}
				);

				this.currentWV++;

				// let config = this.getWebsiteConfig(url)
				// let additionalHttpHeaders = {}
				// try {
				// 	additionalHttpHeaders = JSON.parse(config.additionalHttpHeaders)
				// } catch (e) {
				// 	//TODO handle the exception
				// }
				wv.loadURL(url);

				let currentWebview = this.currentWebview;
				currentWebview.append(wv);
				this.webviewList.push(wv);

				// wv.appendJsFile('_www/static/jq.js');
				// wv.appendJsFile('_www/static/clearAd.js');
				// wv.appendJsFile('_www/static/touch.js');
				wv.appendJsFile('_www/static/webview.js');
				wv.appendJsFile('_www/static/web-sdk.js');


				this.overrideUrlLoading(wv);

				setTimeout(() => {

					if (this.settingConfig.lastPage) {
						this.saveLastPageInfo(wv)
					}


					// 拦截资源加载
					this.overrideResourceRequest(wv);

					let nwv = wv.nativeInstanceObject();

					// wv.appendJsFile('_www/static/script/videoBtn.js');

					wv.addEventListener('loading', e => {
						// 重新加载时清空资源记录
						app.globalData.allRes = this.allRes = [];
						// ===================设置项 ========================
						this.settingConfig = uni.getStorageSync('settingConfig');
						if (this.settingConfig.location) {
							plus.android.invoke(nwv, 'setGeolocationEnabled', true);
						} else {
							plus.android.invoke(nwv, 'setGeolocationEnabled', false);
						}
						let pullLoad = this.settingConfig.pullLoad;
						let onRefresh = () => {
							wv.reload();
						};
						if (pullLoad) {
							wv.setPullToRefresh({
									support: true,
									height: '50px',
									range: '200px',
									contentdown: {
										caption: this.$t("browser.tips.2")
									},
									contentover: {
										caption: this.$t("browser.tips.3")
									},
									contentrefresh: {
										caption: this.$t("browser.tips.4")
									}
								},
								onRefresh
							);
						}
						// ==============设置项===========================

						let overrideUrlList = uni.getStorageSync('overrideurl') || '';

						overrideUrlList = overrideUrlList.split(',');
						this.alertCount = 0; //重置弹窗次数
						for (let i = 0, len = overrideUrlList.length; i < len; i++) {
							if (wv.getURL().indexOf(overrideUrlList[i]) > 0) {
								wv.stop();
								wv.back();
							}
						}
						// 无痕模式
						if (this.settingConfig.traceless) {
							plus.navigator.removeSessionCookie();
							// 关闭数据库
							plus.android.invoke(nwv, 'setDatabaseEnabled', false);
						}
						// 加载新数据停止下拉刷新
						wv.endPullToRefresh();
						this.setTitltData();
					});

					wv.addEventListener('loaded', e => {


						if (this.settingConfig.cookies || this.settingConfig.traceless) {
							plus.navigator.removeSessionCookie();
						}
						// 加载在线脚本
						if (onlineScript.length > 0) {
							for (let i = 0; i < onlineScript.length; i++) {
								if (onlineScript[i].active) {
									let path = onlineScript[i].installPath;
									wv.appendJsFile(path);
								}
							}
						}
						this.setTitltData();
						if (!this.settingConfig.traceless) {
							this.setHistory({
								title: wv.getTitle(),
								url: wv.getURL()
							});
						}

						// 加载脚本文件
						if (scriptFiles.length > 0) {
							for (let i = 0; i < scriptFiles.length; i++) {
								if (scriptFiles[i].active) {
									let path = scriptFiles[i].path;
									wv.appendJsFile(path);
								}
							}
						}
						// 加载脚本
						if (scriptList.length > 0) {
							for (let i = 0; i < scriptList.length; i++) {
								if (scriptList[i].active) {
									let script = scriptList[i].script;
									wv.evalJS(script);
								}
							}
						}
						setTimeout(() => {
							this.removeDom(wv);
							this.readMode(wv)
						}, 1000)
					});
					this.setWebviewClient(nwv);
				});
				this.dragWebview();
				return wv;
				// #endif
			},
			// 设置webview的辅助
			setWebviewClient(nwv) {
				let webviewClient = plus.android.implements('android.webkit.WebViewClient', {
					shouldInterceptRequest: (view, url) => {
						console.log(view, url);
					}
				});

				let ChromeClient = plus.android.implements('android.webkit.WebChromeClient', {
					onProgressChanged: (view, progress) => {
						console.log(view, progress);
					},
					onReceivedTitle: (view, title) => {
						console.log(view, title);
					}
				});

				plus.android.invoke(nwv, 'setWebChromeClient', ChromeClient);
				plus.android.invoke(nwv, 'setWebViewClient', webviewClient);
			},

			// 拦截请求的资源
			overrideResourceRequest(wv) {
				// wv.overrideResourceRequest(matchstr);
			},
			// 重设webview位置
			resetWebview() {
				this.setWVIndex();
				let len = this.webviewList.length;
				let j = 0;
				for (let i = len; i > 0; i--) {
					this.webviewList[i - 1].setStyle({
						left: -j * 100 + '%'
					});
					j++;
				}
				this.dragWebview();
				this.setTitltData();
			},
			// 设置拖着
			dragWebview() {
				if (!this.settingConfig.switchWindow) {
					return;
				}
				if (this.webviewList.length >= 2) {
					this.webviewList.forEach((item, index) => {
						// 左滑显示新窗口
						let nextWv = that.webviewList[index + 1];
						if (nextWv) {
							item.drag({
								direction: 'left',
								moveMode: 'followFinger',
								callbackStep: 10
							}, {
								view: nextWv,
								moveMode: 'follow'
							}, function(e) {
								if (e.type == 'end' && e.result) {
									that.WVindex++;
									that.setTitltData();
								}
							});
							// 右滑隐藏新窗口
							nextWv.drag({
								direction: 'right',
								moveMode: 'followFinger',
								callbackStep: 10
							}, {
								view: item,
								moveMode: 'follow'
							}, function(e) {
								if (e.type == 'end' && e.result) {
									that.WVindex--;
									that.setTitltData();
								}
							});
						}
					});
				}
			},
			// 用于资源嗅探
			getResourceList() {
				app.globalData.allRes = this.allRes;
			},

			wvPause(wvid) {
				for (let i = 0; i < this.webviewList.length; i++) {
					if (this.settingConfig.dormancy) {
						this.webviewList[i].pause()
					}
				}
			},

			// 事件监听
			onWebview() {
				let clearLastPage = () => {
					uni.removeStorageSync('lastPage')
					app.globalData.lastPage = []
				}
				uni.$on('OPEN-BG', e => {
					if (this.webviewList.length > this.maxWebview) {
						plus.nativeUI.toast(this.$t("browser.tips.5"));
						return;
					}
					plus.nativeUI.toast(this.$t("browser.tips.6"));
					let wv = this.createWebView(e.url);
					if (this.settingConfig.dormancy) {
						wv.pause()
					}
				});
				uni.$on('RELOAD', () => {
					this.webviewList[this.WVindex].reload();
				});
				// 打开新窗口
				uni.$on('OPEN-NEW-WINDOW', (url) => {

					if (this.webviewList.length > this.maxWebview) {
						plus.nativeUI.toast(this.$t("browser.tips.5"));
						return;
					}
					this.homeUrl = this.newWebview;
					let wv = null
					if (url) {
						wv = this.createWebView(url);
					} else {
						wv = this.createWebView(this.homeUrl);
					}

					this.resetWebview();
					this.wvPause()
					wv.resume()
				});
				// 关闭某个窗口
				uni.$on('CLOSE-WINDOW', index => {
					this.webviewList.splice(index, 1).forEach(_wv => {
						_wv.close()
					})
					if (this.webviewList.length == 0) {
						clearLastPage()
						uni.redirectTo({
							url: '../main/main',
							animationType: 'fade-in'
						});
						return;
						// this.createWebView(this.newWebview);
					}
					let wv = this.webviewList[this.webviewList.length - 1];
					wv.show();

					this.resetWebview();
					this.wvPause()
					wv.resume()
				});
				// 关闭所有窗口
				uni.$on('CLOSE-WINDOW-ALL', () => {
					clearLastPage()
					this.webviewList.length = 0;
					uni.redirectTo({
						url: '../main/main',
						animationType: 'fade-in'
					});
					// this.createWebView(this.homeUrl);
					// this.resetWebview();
				});
				// 创建快捷方式
				uni.$on('CREATE-SHORTCUT', () => {
					let wv = this.webviewList[this.WVindex];
					plus.navigator.createShortcut({
							name: wv.getTitle(),
							icon: this.convertTemp(wv.getURL()) + '/favicon.ico',
							toast: '',
							extra: {
								url: wv.getURL()
							}
						},
						e => {
							if (e.sure) {
								plus.nativeUI.toast(this.$t("browser.tips.7"));
							} else {
								plus.nativeUI.toast(this.$t("browser.tips.8"));
							}
						}
					);
				});



				// 快捷方式打开
				uni.$on('OPEN-Shortcut', e => {
					this.webviewList[this.WVindex].loadURL(e.url);
				});
				// 历史操作
				uni.$on('HISTORY-MAKE', e => {
					if (e.type == 0) {
						if (this.webviewList.length > this.maxWebview) {
							plus.nativeUI.toast(this.$t("browser.tips.5"));
							return;
						}
						this.createWebView(e.url);
						this.resetWebview();
					} else if (e.type == 1) {
						if (this.webviewList.length > this.maxWebview) {
							plus.nativeUI.toast(this.$t("browser.tips.5"));
							return;
						}
						plus.nativeUI.toast(this.$t("browser.tips.6"));
						this.createWebView(e.url);
					} else if (e.type == -1) {
						this.webviewList[this.WVindex] ? this.webviewList[this.WVindex].loadURL(e.url) : this
							.webviewList[this.webviewList.length - 1].loadURL(e.url)
					}
				});
				// 点击书签
				uni.$on('BOOK-MARK', e => {

					if (this.webviewList.length > 0) {
						this.webviewList[this.WVindex].loadURL(e.url);
					}
				});
				// 切换后台窗口
				uni.$on('SWITCH-WEBVIEW', e => {
					this.wvPause()
					let index = e.index;
					let lenIndex = this.webviewList.length - 1;
					this.webviewList.forEach((item, _index) => {
						if (_index == index) {
							item.show();
							item.resume()
						} else {
							this.webviewList.length;
						}
					});
					this.webviewList[index] = this.webviewList.splice(lenIndex, 1, this.webviewList[index])[0];
					this.WVindex = lenIndex;
					this.resetWebview();

				});

				// 设置搜索栏信息
				this.currentWebview.addEventListener(
					'titleNViewSearchInputFocusChanged',
					e => {
						if (e.focus) {
							this.currentWebview.setTitleNViewSearchInputText(this.webviewList[this.WVindex].getURL());
						} else {
							this.currentWebview.setTitleNViewSearchInputText('');
						}
					},
					false
				);
				// 全屏
				uni.$on('FULL', full => {
					fullScreen = full;
					this.backPress = true;
					this.fullState(full);
				});

				// 搜索
				this.currentWebview.addEventListener(
					'titleNViewSearchInputConfirmed',
					e => {
						let link = this.to_link(e.text);
						this.webviewList[this.WVindex].loadURL(link);
						uni.hideKeyboard();
					},
					false
				);
				uni.$on('LOAD-URL', e => {
					let url = this.to_link(e.url);
					this.webviewList[this.WVindex].loadURL(url);
				});
				// 搜索栏点击事件
				this.currentWebview.addEventListener('titleNViewSearchInputClicked', e => {
					app.globalData.searUrl = this.webviewList[this.WVindex].getURL().indexOf('file:///') >= 0 ?
						'' : this.webviewList[this.WVindex].getURL();
					uni.navigateTo({
						url: '/pages/search/search',
						animationType: 'fade-in'
					});
				});

				uni.$on('AD', () => {
					this.removeDom(this.webviewList[this.WVindex]);
				});
				let downloadCurrent = this.settingConfig.downloadCurrent;

				let allowableDonwload = true;

				const action = {
					download: 'download',
					dlnaSearch: 'Dlan-search',
					dlnaPlay: 'Dlan-play',
					statistics: 'statistics'
				}

				// 监听网页返回的信息
				uni.$on('WEB-MESSAGE', e => {
					let actionType = e.action
					switch (actionType) {
						case action.download:
							// 拦截自动下载
							if (this.settingConfig.autoDownload) {

								uni.showToast({
									icon: 'none',
									title: this.$t("browser.tips.12")
								});
								return;
							}
							// 调用IDM+进行下载
							let url = decodeURIComponent(e.url);
							url = url.replace(/^(https:\/\/|http:\/\/)/g, '');
							if (downloadCurrent == 1) {
								let isInstallADM = plus.runtime.isApplicationExist({
									pname: 'com.dv.adm.pay'
								});
								if (!isInstallADM) {
									uni.showToast({
										icon: 'none',
										title: this.$t("setting.tips.1")
									});
									return;
								}
								this.downloadADM(url);
							} else if (downloadCurrent == 2) {
								let isInstallIDM = plus.runtime.isApplicationExist({
									pname: 'idm.internet.download.manager.plus'
								});
								if (!isInstallIDM) {
									uni.showToast({
										icon: 'none',
										title: this.$t("setting.tips.2")
									});
									return;
								}
								this.downloadIDM(url);
							}
							break;
						case action.dlnaSearch:
							// dlan播放
							let devList = [];
							Dlan.search(result => {
								if (result.type === 'add') {
									devList.push({
										id: result.id,
										name: result.name
									});
								} else {
									devList = devList.filter(x => x.id != result.id);
								}
								this.webviewList[this.WVindex].evalJS(`Dlan(${devList})`);
							});
							break;
						case action.dlnaPlay:
							url = decodeURIComponent(e.url),
								id = e.id,
								title = e.title;
							Dlan.play({
								id,
								url,
								title
							}, res => {
								this.webviewList[this.WVindex].evalJS(`DlanComplate(${res})`);
							});
							break;
						case action.statistics:
							let statiData = e.data;
							app.globalData.statiData = statiData;
							break;
					}
				});
				
				uni.$on('READ-MODE', () => {
					app.globalData.read = !app.globalData.read
					this.readMode(this.webviewList[this.WVindex])
				})
				uni.$on('CLEAR-CACHE', () => {
					this.webviewList[this.WVindex].evalJS(`
					localStorage.clear();
					var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
					if (keys) {
						for (var i = keys.length; i--;) {
							document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
						}
					};`);
				})

				// 监听资源加载
				this.webviewList[this.WVindex].listenResourceLoading('', evt => {
					if (this.settingConfig.resLog) {
						this.allRes.unshift(evt.url);
					}
				});
			},
			// read mode
			readMode(wv) {
				if(!wv)return;
				if (app.globalData.read) {
					wv.evalJS(`
					(function() {
						let readNodes = {
							score: 0,
						};
						const nodes = document.body.getElementsByTagName('p');
						for (var i = 0, len = nodes.length; i < len; i++) {
							const node = nodes[i];
							let score = 1;
							const text = node.innerText;
							const reg = ${new RegExp(/(：|。|；|，|,|\.|\?|”)/,'g')};
							score += text.split(reg).length;
							score += Math.min(Math.floor(text.length / 100), 3);
							typeof node.score !== 'number' && (node.score = 0);
							node.score += score;
							node.setAttribute('score', node.score);
							(node.score > readNodes.score) && (readNodes = node);
							let index = 0;
							let tempNode = node.parentElement;
							while (tempNode && tempNode.tagName !== 'BODY') {
								if (/div|article|section/i.test(tempNode.tagName)) {
									(typeof tempNode.score !== 'number') && (tempNode.score = 0);
									tempNode.score += (score / (index < 2 ? index + 2 : index * 3));
									tempNode.setAttribute('score', tempNode.score);
									(tempNode.score > readNodes.score) && (readNodes = tempNode);
									if (++index >= 3) {
										break;
									}
								}
								tempNode = tempNode.parentElement;
							}
						};
						if (readNodes) {
							readNodes.style.cssText = 'background:#e6cea0;color:#000;display: block; position: fixed; inset: 0;z-index:999999;overflow-y:auto;padding:12px;';
							document.querySelectorAll('header,footer').forEach(function(n){
								n.style.display = 'none';
							});
							
							window.readNodes = readNodes;
						}
					})()
					`)
					
				} else {
					wv.evalJS(`
					if(window.readNodes){
						window.readNodes.style.cssText = 'display: block;';
						document.querySelectorAll('header,footer').forEach(function(n){
							n.style.display = 'initial';
						});
					}
					`)
				}

			},
			// AMD下载
			downloadADM(url) {
				let uri = Uri.parse(url);
				let name = url.split('/');
				intent.setAction(Intent.ACTION_MAIN);
				intent.setData(uri);
				intent.setComponent(new ComponentName('com.dv.adm.pay', 'com.dv.adm.pay.AEditor'));
				intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
				intent.putExtra('filename', name[name.length - 1].split('?')[0]);
				main.startActivity(intent);
			},
			// IDM下载
			downloadIDM(url) {
				let uri = Uri.parse(url);
				let name = url.split('/');
				intent.setAction(Intent.ACTION_VIEW);
				intent.setData(uri);
				intent.setComponent(new ComponentName('idm.internet.download.manager.plus',
					'idm.internet.download.manager.Downloader'));
				intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
				intent.putExtra('extra_filename', name[name.length - 1].split('?')[0]);
				main.startActivity(intent);
			},

			// 拦截跳转请求
			overrideUrlLoading(wv) {
				wv.overrideUrlLoading({
					match: '^(?!http|file|ftp).*',
					mode: 'reject'
				}, e => {
					let url = e.url;
					this.alertCount++;
					if (this.alertCount > 1) {
						return;
					}
					uni.showModal({
						title: this.$t("browser.tips.10"),
						content: this.$t("browser.tips.11"),
						success: res => {
							if (res.confirm) {
								let a =
									`var s_a = document.createElement('a');s_a.setAttribute('href','${url}');s_a.click();`;
								if (!this.openurlwebview) {
									this.openurlwebview = plus.webview.create(url);
								}
								this.openurlwebview.evalJS(a);
							}
						}
					});
				});
			},
			fullState(full) {
				if (full) {
					// 隐藏导航栏
					this.currentWebview.getTitleNView().hide();

					this.webviewList[this.WVindex].setStyle({
						top: 0,
						height: '100%'
					});
					plus.navigator.setFullscreen(true);
				} else {
					this.currentWebview.getTitleNView().show();
					this.webviewList[this.WVindex].setStyle({
						top: this.top,
						height: uni.getSystemInfoSync().screenHeight - this.top
					});
					plus.navigator.setFullscreen(false);
					setTimeout(() => {
						this.backPress = false;
					}, 1000);
				}
			},
			// 删除被拦截的元素
			removeDom(wv) {
				let adList = uni.getStorageSync('adList') || [];
				let url = wv.getURL();
				setTimeout(() => {
					adList.forEach(e => {
						if (url.indexOf(e.hostname) > 0) {
							wv.evalJS(`var adList = ${JSON.stringify(e.classList)};
						adList.forEach(function(e){
							document.querySelectorAll('.'+e.split(' ').join('.')).forEach(function(a){
								a.style.display = 'none';
							})
						})`);
						}
					});
				}, 2000)

			},
			setWVIndex() {
				this.WVindex = this.webviewList.length - 1;
			},
			// 后台窗口
			bgWindow() {
				app.globalData.webviewList = this.webviewList;
				uni.navigateTo({
					url: '../popup/popup?from=nav'
				});
			},
			// 记录历史
			setHistory(res) {
				let history = uni.getStorageSync('history') || [];

				history.unshift(res);
				uni.setStorageSync('history', history);

				let wv = this.webviewList[this.WVindex];
				app.globalData.webviewList = this.webviewList;
				app.globalData.bookmarkObj = {
					title: wv.getTitle(),
					url: wv.getURL(),
					time: Date.now(),
					ico: this.convertTemp(wv.getURL()) + '/favicon.ico'
				};
			},
			convertTemp(the_url) {
				let lead_slashes = the_url.indexOf('//');
				let domain_start = lead_slashes + 2;
				let without_resource = the_url.substring(domain_start, the_url.length);
				let next_slash = without_resource.indexOf('/');
				let domain = without_resource.substring(0, next_slash);
				return 'http://' + domain;
			},
			// 生成链接
			to_link(txtContent) {
				let domainArr = txtContent.split('.');
				let text = this.searchEngine + txtContent;
				let reg = /^(http|HTTP)/;
				if (domainArr.length == 1) {
					return text;
				}
				if (domainArr.length == 2) {
					if (!reg.test(domainArr[0])) {
						text = 'https://www.' + txtContent;
					} else {
						text = txtContent;
					}
				}
				if (domainArr.length > 2) {
					if (!reg.test(domainArr[0])) {
						text = 'https://' + txtContent;
					} else {
						text = txtContent;
					}
				}
				uni.removeStorageSync('lastPage')
				return text;
			},
			// 设置标题
			setTitltData() {
				this.webviewList.forEach(item => {
					if (!item.isVisible()) {
						item.pause();
					} else {
						item.resume();
					}
				});
				this.currentWebview.setStyle({
					titleNView: {
						searchInput: {
							placeholder: this.webviewList[this.WVindex].getTitle()
						}
					}
				});
			}
		}
	};
</script>

<style></style>