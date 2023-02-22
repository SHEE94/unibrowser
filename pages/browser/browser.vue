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
let matchstr = [];

// setTimeout(()=>{
// 	for (let i = 0, len = newrequest.length; i < len; i++) {
// 		if (newrequest[i].length != 0) {
// 			let obj = {
// 				match: newrequest[i],
// 				// redirect: '_www/static/red.jpeg',
// 				// mime: '(image/jpeg)'
// 			};
// 			matchstr = matchstr.concat([obj])
// 		}
// 	}
// },0)
export default {
	data() {
		return {
			webviewList: [],
			currentWV: 0,
			WVindex: 0, //当前处于哪个页面
			maxWebview: 5,
			newWebview: '', //'_www/static/html/home/index8.html',
			homeUrl: '',
			searchEngine: 'https://cn.bing.com/search?q=',
			allRes: [],
			initResArr: { js: [], css: [], img: [], iframe: [], video: [] },
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
		}
		// this.webviewList[this.WVindex].resume();
	},
	onHide() {
		this.offResize();
	},
	deactivated() {
		this.offResize();
	},
	destroyed() {
		this.offResize();
	},
	onShow() {
		this.windowResize();
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
				buttons: [
					{ type: 'menu', float: 'right', onclick: this.clickMenu }, //菜单
					{ fontSrc: '_www/static/iconfont.ttf', text: '\ue612', fontSize: '18px', float: 'right', color: '#515151', onclick: this.bgWindow }, //后台
					{ fontSrc: '_www/static/iconfont.ttf', text: '\ue617', fontSize: '18px', float: 'left', color: '#515151', onclick: this.toHome }, //主页
					{ fontSrc: '_www/static/iconfont.ttf', text: '\ue608', fontSize: '18px', float: 'right', onclick: this.clickForward } //前进
					// { float: 'right', fontSrc: '_www/static/iconfont.ttf', text: '\ue609', fontSize: '18px' ,onclick:this.canback}
				]
			}
		});
		this.createWebView(this.homeUrl);
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
					content: '点击主页将关闭所有窗口',
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
				wv.canBack(e => {
					console.log(e);
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
		createWebView(url) {
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
				'',
				{
					height: uni.getSystemInfoSync().screenHeight - this.top,
					left: left,
					top: this.top,
					bounce: 'vertical',
					userSelect: true,
					cachemode: 'cacheElseNetwork',
					hardwareAccelerated: true,
					plusrequire: 'ahead',
					progress: {
						color: '#A0EEE1',
						height: '1px'
					},
					scalable: true
				},
				{ index: this.currentWV, data: { name: 'web' } }
			);

			this.currentWV++;
			wv.loadURL(url);

			let currentWebview = this.currentWebview;
			currentWebview.append(wv);
			this.webviewList.push(wv);

			// wv.appendJsFile('_www/static/jq.js');
			wv.appendJsFile('_www/static/clearAd.js');
			wv.appendJsFile('_www/static/touch.js');
			wv.appendJsFile('_www/static/webview.js');
			wv.appendJsFile('_www/static/web-sdk.js');
			
			document.addEventListener('touchstart',function(evt){
				evt.stopPropagation()
				evt.preventDefault();
			})
			
			
			wv.evalJS(`
			var createElement = document.createElement;
			    document.createElement = function (tag,opts) {
					if(opts&&opts.pass){
						return createElement.apply(this, arguments);
					}
			        switch (tag) {
			            case 'script':
			                console.log('禁用动态添加脚本');
			                break;
			            default:
			                return createElement.apply(this, arguments);
			        }
			    }
			`);
			this.overrideUrlLoading(wv);

			setTimeout(() => {
				// 拦截资源加载
				this.overrideResourceRequest(wv);

				let nwv = wv.nativeInstanceObject();

				// wv.appendJsFile('_www/static/script/videoBtn.js');

				wv.addEventListener('loading', e => {
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
						wv.setPullToRefresh(
							{
								support: true,
								height: '50px',
								range: '200px',
								contentdown: {
									caption: '下拉可以刷新'
								},
								contentover: {
									caption: '释放立即刷新'
								},
								contentrefresh: {
									caption: '正在刷新...'
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
					// 重新加载时清空资源记录

					this.allRes = [];
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
					this.removeDom(wv);
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
								console.log(script);
								wv.evalJS(script);
							}
						}
					}
				});
				this.setWebviewClient(nwv);
			});
			this.dragWebview();

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
						item.drag({ direction: 'left', moveMode: 'followFinger', callbackStep: 10 }, { view: nextWv, moveMode: 'follow' }, function(e) {
							if (e.type == 'end' && e.result) {
								that.WVindex++;
								that.setTitltData();
							}
						});
						// 右滑隐藏新窗口
						nextWv.drag({ direction: 'right', moveMode: 'followFinger', callbackStep: 10 }, { view: item, moveMode: 'follow' }, function(e) {
							if (e.type == 'end' && e.result) {
								that.WVindex--;
								that.setTitltData();
							}
						});
					}
				});
			}
		},
		// 资源嗅探
		getResourceList() {
			let Resource = this.initResArr;
			for (let i = 0, len = this.allRes.length; i < len; i++) {
				if (/.*\.(jpg|png|jpeg|bmp|ico)\b/.test(this.allRes[i])) {
					let obj = {
						type: 'img',
						url: this.allRes[i]
					};
					Resource.img.unshift(obj);
				}
				if (/.*\.(js)\b/.test(this.allRes[i])) {
					let obj = {
						type: 'js',
						url: this.allRes[i]
					};
					Resource.js.unshift(obj);
				}
				if (/.*\.(css)\b/.test(this.allRes[i])) {
					let obj = {
						type: 'css',
						url: this.allRes[i]
					};
					Resource.css.unshift(obj);
				}
				if (/.*\.(html)\b/.test(this.allRes[i])) {
					let obj = {
						type: 'iframe',
						url: this.allRes[i]
					};
					tResource.iframe.unshift(obj);
				}

				if (/.*\.(mp4|m4v|m3u8)\b/.test(this.allRes[i])) {
					let obj = {
						type: 'video',
						url: this.allRes[i]
					};
					Resource.video.unshift(obj);
				}
			}
			app.globalData.LoadResource = Resource;
		},

		// 事件监听
		onWebview() {
			uni.$on('OPEN-BG', e => {
				if (this.webviewList.length > this.maxWebview) {
					plus.nativeUI.toast('已打开最大窗口数量');
					return;
				}
				plus.nativeUI.toast('已在后台打开');
				this.createWebView(e.url);
			});
			uni.$on('RELOAD', () => {
				this.webviewList[this.WVindex].reload();
			});
			// 打开新窗口
			uni.$on('OPEN-NEW-WINDOW', () => {
				if (this.webviewList.length > this.maxWebview) {
					plus.nativeUI.toast('已打开最大窗口数量');
					return;
				}
				this.homeUrl = this.newWebview;
				this.createWebView(this.homeUrl);
				this.resetWebview();
			});
			// 关闭某个窗口
			uni.$on('CLOSE-WINDOW', index => {
				this.webviewList.splice(index, 1);
				if (this.webviewList.length == 0) {
					uni.redirectTo({
						url: '../main/main',
						animationType: 'fade-in'
					});
					// this.createWebView(this.newWebview);
				}
				this.webviewList[this.webviewList.length - 1].show();
				this.resetWebview();
			});
			// 关闭所有窗口
			uni.$on('CLOSE-WINDOW-ALL', () => {
				uni.redirectTo({
					url: '../main/main',
					animationType: 'fade-in'
				});
				// this.webviewList.length = 0;
				// this.createWebView(this.homeUrl);
				// this.resetWebview();
			});
			// 创建快捷方式
			uni.$on('CREATE-SHORTCUT', () => {
				let wv = this.webviewList[this.WVindex];
				plus.navigator.createShortcut(
					{
						name: wv.getTitle(),
						icon: this.convertTemp(wv.getURL()) + '/favicon.ico',
						toast: '',
						extra: {
							url: wv.getURL()
						}
					},
					e => {
						if (e.sure) {
							plus.nativeUI.toast('快捷方式已创建');
						} else {
							plus.nativeUI.toast('已尝试创建快捷方式');
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
						plus.nativeUI.toast('已打开最大窗口数量');
						return;
					}
					this.createWebView(e.url);
					this.resetWebview();
				} else if (e.type == 1) {
					if (this.webviewList.length > this.maxWebview) {
						plus.nativeUI.toast('已打开最大窗口数量');
						return;
					}
					plus.nativeUI.toast('已在后台打开');
					this.createWebView(e.url);
				} else if (e.type == -1) {
					this.webviewList[this.WVindex].loadURL(e.url);
				}
			});
			// 点击书签
			uni.$on('BOOK-MARK', e => {
				console.log('BOOK-MARK', this.webviewList);
				if (this.webviewList.length > 0) {
					this.webviewList[this.WVindex].loadURL(e.url);
				}
			});
			// 切换后台窗口
			uni.$on('SWITCH-WEBVIEW', e => {
				let index = e.index;
				let lenIndex = this.webviewList.length - 1;
				this.webviewList.forEach((item, _index) => {
					if (_index == index) {
						item.show();
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
				app.globalData.searUrl = this.webviewList[this.WVindex].getURL().indexOf('file:///') >= 0 ? '' : this.webviewList[this.WVindex].getURL();
				uni.navigateTo({
					url: '/pages/search/search',
					animationType: 'fade-in'
				});
			});

			uni.$on('AD', () => {
				this.removeDom(this.webviewList[this.WVindex]);
			});
			let downloadCurrent = this.settingConfig.downloadCurrent;
			// 监听网页返回的信息
			uni.$on('WEB-MESSAGE', e => {
				console.log('WEB-MESSAGE', e);
				if (e.action == 'download') {
					// 调用IDM+进行下载
					let url = decodeURIComponent(e.url);
					url = url.replace(/^(https:\/\/|http:\/\/)/g, '');
					if (downloadCurrent == 1) {
						let isInstallADM = plus.runtime.isApplicationExist({ pname: 'com.dv.adm.pay' });
						if (!isInstallADM) {
							uni.showToast({
								icon: 'none',
								title: '你的手机似乎未安装ADM Pro'
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
								title: '你的手机似乎未安装IDM+'
							});
							return;
						}
						this.downloadIDM(url);
					}
				} else if (e.action == 'Dlan-search') {
					// dlan播放
					let devList = [];
					Dlan.search(result => {
						if (result.type === 'add') {
							devList.push({ id: result.id, name: result.name });
						} else {
							devList = devList.filter(x => x.id != result.id);
						}
						this.webviewList[this.WVindex].evalJS(`Dlan(${devList})`);
					});
				} else if (e.action == 'Dlan-play') {
					let url = decodeURIComponent(e.url),
						id = e.id,
						title = e.title;
					Dlan.play({ id, url, title }, res => {
						this.webviewList[this.WVindex].evalJS(`DlanComplate(${res})`);
					});
				}
			});
			let overrideUrl = [];
			// 监听资源加载
			this.webviewList[this.WVindex].listenResourceLoading('', evt => {
				if (this.settingConfig.resLog) {
					this.allRes.unshift(evt.url);
				}
			});
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
			intent.setComponent(new ComponentName('idm.internet.download.manager.plus', 'idm.internet.download.manager.Downloader'));
			intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
			intent.putExtra('extra_filename', name[name.length - 1].split('?')[0]);
			main.startActivity(intent);
		},

		// 拦截跳转请求
		overrideUrlLoading(wv) {
			wv.overrideUrlLoading({ match: '^(?!http|file|ftp).*', mode: 'reject' }, e => {
				let url = e.url;
				this.alertCount++;
				if (this.alertCount > 1) {
					return;
				}
				uni.showModal({
					title: '提示',
					content: '该网页想跳转其他应用是否允许？',
					success: res => {
						if (res.confirm) {
							let a = `var s_a = document.createElement('a');s_a.setAttribute('href','${url}');s_a.click();`;
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
			setTimeout(()=>{
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
			},2000)
			
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
