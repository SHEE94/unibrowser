<template>
	<view></view>
</template>

<script>
const app = getApp();
let that;
let fullScreen = false;
export default {
	data() {
		return {
			webviewList: [],
			currentWV: 0,
			WVindex: 0, //当前处于哪个页面
			maxWebview: 5,
			newWebview:'_www/static/html/home/index8.html',
			homeUrl: '',
			searchEngine: 'https://www.baidu.com/s?wd=',
			allRes: [],
			initResArr: { js: [], css: [], img: [], iframe: [], video: [] },
			settingConfig: {}
		};
	},
	beforeCreate() {
		that = this;
	},
	onShow() {
		this.settingConfig = uni.getStorageSync('settingConfig');
		
	},
	onLoad(options) {
		this.settingConfig = uni.getStorageSync('settingConfig');
		this.homeUrl = this.to_link(options.url);
		// this.webviewList[this.WVindex].resume();
	},
	mounted() {
		this.Resource = [];
		this.top = uni.getSystemInfoSync().statusBarHeight + 44;
		this.currentWebview = this.$scope.$getAppWebview();

		this.currentWebview.setStyle({
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
				],
				progress: {
					color: '#008585'
				}
			}
		});
		

		this.createProgress();
		this.createWebView(this.homeUrl);
		this.onWebview();
	},
	async onBackPress() {
		if (fullScreen) {
			uni.$emit('FULL', false);
			return true;
		}
		let canClose = await this.canback();

		if (canClose) {
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
		}
	},
	methods: {
		toHome() {
			// this.webviewList[this.WVindex].loadURL(this.homeUrl);
			let fqa = uni.getStorageSync('backhomefqa')
			this.progressView.hide()
			if(!fqa){
				uni.showModal({
					content:'点击主页将关闭所有窗口',
					success: (res) => {
						if(res.confirm){
							uni.reLaunch({
								url: '/pages/main/main',
								animationType: 'fade-out'
							});
							uni.setStorageSync('backhomefqa',true)
						}
					}
				})
				return;
			}
			uni.reLaunch({
				url: '/pages/main/main',
				animationType: 'fade-out'
			});
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
		createProgress() {
			this.progressView = new plus.nativeObj.View(
				'progress',
				{
					top: this.top,
					height: '2px',
					width: '100%'
				},
				[{ tag: 'rect', id: 'rect-pregress', color: '#008585', position: { top: '0px', left: '0px', width: '0%', height: '2px' } }]
			);
		},
		canback() {
			return new Promise((res, rej) => {
				let wv = this.webviewList[this.WVindex];
				this.webviewList[this.WVindex].canBack(e => {
					console.log(e);
					if (e.canBack) {
						wv.back();
						res(false);
					} else {
						res(true);
					}
				});
			});
		},
	
		createWebView(url) {
			uni.navigateTo({
				url: '../popup/popup?from=back'
			});
			let scriptFiles = uni.getStorageSync('script_dir_file') || [];
			let scriptList = uni.getStorageSync('script_list') || [];
			let onlineScript = uni.getStorageSync('installOnlineScript')||[]
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
					cachemode: 'cacheElseNetwork'
				},
				{ index: this.currentWV, data: { name: 'web' } }
			);

			this.overrideResourceRequest(wv);
			this.currentWV++;
			wv.loadURL(url);
			var currentWebview = this.currentWebview;
			currentWebview.append(wv);
			this.webviewList.push(wv);

			wv.appendJsFile('_www/static/webview.js');
			wv.appendJsFile('_www/static/web-sdk.js');
			
			
			this.overrideUrlLoading(wv);
			setTimeout(() => {
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
				wv.addEventListener('loading', e => {
					// 重新加载时清空资源记录
					if(pullLoad){
						wv.setPullToRefresh({
							support:false
						});
					}
					wv.endPullToRefresh();
					this.allRes = [];
				});
				// wv.appendJsFile('_www/static/resload.js')
				if (onlineScript.length > 0) {
					for (let i = 0; i < onlineScript.length; i++) {
						if (onlineScript[i].active) {
							let path = onlineScript[i].installPath;
							wv.appendJsFile(path);
						}
					}
				}
				wv.addEventListener('loaded', e => {
					wv.appendJsFile('_www/static/script/m3u8download.js')
					this.setTitltData();
					this.setHistory({
						title: wv.getTitle(),
						url: wv.getURL()
					});
					this.removeDom(wv);
					// 加载脚本
					if (scriptFiles.length > 0) {
						for (let i = 0; i < scriptFiles.length; i++) {
							if (scriptFiles[i].active) {
								let path = scriptFiles[i].path;
								console.log(path)
								wv.appendJsFile(path);
							}
						}
					}
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
			});
			this.dragWebview();
			// #endif
		},
		// 拦截跳转
		// overrideUrlLoading(wv) {
		// 	let overriUrl = uni.getStorageSync('overriUrl') || {};
		// 	if (!overriUrl.open) return;
		// 	wv.overrideUrlLoading({ effect: overriUrl.effect, mode: overriUrl.mode, match: overriUrl.match, exclude: overriUrl.exclude }, e => {
		// 		uni.showToast({
		// 			icon:'none',
		// 			title:'已拦截链接：'+e.url
		// 		})
		// 	});
		// },
		// 拦截请求的资源
		overrideResourceRequest(wv) {
			let resRequest = uni.getStorageSync('overrideResourceRequest') || [];
			// 拦截资源
			let overrideResourceRequest = [];
			let overrideHostname = [];
			for (let i of resRequest) {
				let obj = {
					match: '(' + i + ')',
					redirect: '_www/static/red.jpeg',
					mime: '(image/jpeg)'
				};
				overrideResourceRequest.push(obj);
			}
			wv.overrideResourceRequest(overrideResourceRequest);
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
			if (!this.dragWindow) {
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
			this.Resource = this.initResArr;
			for (let i = 0, len = this.allRes.length; i < len; i++) {
				if (/.*\.(jpg|png|jpeg|bmp|ico)\b/.test(this.allRes[i])) {
					let obj = {
						type: 'img',
						url: this.allRes[i]
					};
					this.Resource.img.unshift(obj);
				}
				if (/.*\.(js)\b/.test(this.allRes[i])) {
					let obj = {
						type: 'js',
						url: this.allRes[i]
					};
					this.Resource.js.unshift(obj);
				}
				if (/.*\.(css)\b/.test(this.allRes[i])) {
					let obj = {
						type: 'css',
						url: this.allRes[i]
					};
					this.Resource.css.unshift(obj);
				}
				if (/.*\.(html)\b/.test(this.allRes[i])) {
					let obj = {
						type: 'iframe',
						url: this.allRes[i]
					};
					this.Resource.iframe.unshift(obj);
				}

				if (/.*\.(mp4|m4v|m3u8)\b/.test(this.allRes[i])) {
					let obj = {
						type: 'video',
						url: this.allRes[i]
					};
					this.Resource.video.unshift(obj);
				}
			}
			app.globalData.LoadResource = this.Resource;
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
					this.createWebView(this.homeUrl);
				}
				this.resetWebview();
			});
			// 关闭所有窗口
			uni.$on('CLOSE-WINDOW-ALL', () => {
				this.webviewList.length = 0;
				this.createWebView(this.homeUrl);
				this.resetWebview();
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
				this.webviewList[this.WVindex].loadURL(e.url);
			});
			// 切换后台窗口
			uni.$on('SWITCH-WEBVIEW', e => {
				let index = e.index;
				let lenIndex = this.webviewList.length - 1;
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
				app.globalData.searUrl = this.webviewList[this.WVindex].getURL().indexOf('file:///')>=0?'':this.webviewList[this.WVindex].getURL();
				uni.navigateTo({
					url: '/pages/search/search',
					animationType: 'fade-in'
				});
			});

			uni.$on('AD', () => {
				this.removeDom(this.webviewList[this.WVindex]);
			});
			// 监听资源加载
			this.webviewList[this.WVindex].listenResourceLoading('', evt => {
				if(this.settingConfig.resLog){
					this.allRes.unshift(evt.url);
				}
				// this.allRes.unshift(evt.url);
			});
		},
		// 拦截跳转请求
		overrideUrlLoading(wv) {
			wv.overrideUrlLoading({ match: '^(?!http|file).*', mode: 'reject' }, e => {
				let url = e.url;
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
					height:'100%'
				});
				plus.navigator.setFullscreen(true);
			} else {
				this.currentWebview.getTitleNView().show();
				this.webviewList[this.WVindex].setStyle({
					top: this.top,
					height: uni.getSystemInfoSync().screenHeight - this.top
				});
				plus.navigator.setFullscreen(false);
			}
		},
		// 删除被拦截的元素
		removeDom(wv) {
			let adList = uni.getStorageSync('adList') || [];
			let url = wv.getURL();
			adList.forEach(e => {
				if (url.indexOf(e.hostname) > 0) {
					wv.evalJS(`var adList = ${JSON.stringify(e.classList)};
					adList.forEach(function(e){
						document.querySelectorAll('.'+e.split(' ').join('.')).forEach(function(a){
							a.remove()
						})
					})`);
				}
			});
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
			var lead_slashes = the_url.indexOf('//');
			var domain_start = lead_slashes + 2;
			var without_resource = the_url.substring(domain_start, the_url.length);
			var next_slash = without_resource.indexOf('/');
			var domain = without_resource.substring(0, next_slash);
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
			} else if (domainArr.length > 2) {
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

			// 设置进度条
			this.webviewList[this.WVindex].addEventListener('progressChanged', e => {
				console.log(e.progress);
				this.progressView.show();
				this.progressView.draw([
					{ tag: 'rect', id: 'rect-pregress', rectStyles: { color: '#008585' }, position: { top: '0px', left: '0px', width: e.progress + '%', height: '2px' } }
				]);
				if (e.progress >= 100) {
					this.progressView.hide();
				}
			});
		}
	}
};
</script>

<style></style>
