const URL = plus.android.importClass('java.net.URL')
const Uri = plus.android.importClass('android.net.Uri')
let AD_HOSTS_FILE = '_www/static/host.txt';
let FILE_RESULT = '';
let AD_HOSTS = [];
let events = {}
class ADBlock {

	static init() {
		this.loadFromAssets();
	}
	static loadFromAssets() {
		let that = this;
		AD_HOSTS = this.hostlist = uni.getStorageSync('host') || [];
		
		plus.io.resolveLocalFileSystemURL(AD_HOSTS_FILE, (entry) => {
			// 可通过entry对象操作test.html文件 
			entry.file(function(file) {
				var fileReader = new plus.io.FileReader();
				console.log("getFile:" + JSON.stringify(file));
				fileReader.readAsText(file, 'utf-8');

				fileReader.onloadend = function(evt) {
					// console.log("evt.target" + evt.target);
					// console.log(evt.target.result)
					AD_HOSTS = evt.target.result.split('\n')
					if (fileReader.readyState == fileReader.DONE) {
						// fileReader.abort()
						clearInterval(that.stopPutHost)
						that.emit('LOADED', {
							AD_HOSTS
						})
					}
				}
				fileReader.onload = function(){
					if (fileReader.readyState == fileReader.DONE) {
						// fileReader.abort()
						clearInterval(that.stopPutHost)
						that.emit('LOADED', {
							AD_HOSTS
						})
					}
				}
				that.stopPutHost = setInterval(() => {
					if (that.hostlist.length < AD_HOSTS.length) {
						that.hostlist = [...that.hostlist, ...AD_HOSTS];
						uni.setStorage({
							key: 'host',
							data: that.hostlist
						})
					} else {
						clearInterval(that.stopPutHost)
					}
				}, 3000)
				setTimeout(() => {
					// fileReader.abort()
					that.emit('LOADED', {
						AD_HOSTS
					})
				}, 10000)

				console.log(file.size + '--' + file.name);
			});
		}, (err) => {
			console.log('文件打开失败', err)
		})
	}
	static on(event, listener) {
		if (typeof events[event] !== 'object') {
			events[event] = [];
		}
		events[event].push(listener);
		return () => this.removeListener(event, listener);
	}
	static emit(event, ...args) {
		if (typeof events[event] === 'object') {
			events[event].forEach(listener => listener.apply(this, args));
		}
	}
	static removeListener(event, listener) {
		if (typeof events[event] === 'object') {
			const idx = events[event].indexOf(listener);
			if (idx > -1) {
				events[event].splice(idx, 1);
			}
		}
	}
	static isAd(url) {
		try {
			return this.isAdHost(this.getHost(url)) || AD_HOSTS.includes(Uri.parse(url).getLastPathSegment())
		} catch (e) {
			//TODO handle the exception
			console.log(e)
			return false;
		}
	}
	static isAdHost(host) {
		if (!host) {
			return false;
		}
		let index = host.indexOf(".");
		return index >= 0 && (AD_HOSTS.includes(host) ||
			index + 1 < host.length && this.isAdHost(host.substring(index + 1)));
	}
	static getHost(url) {
		return new URL(url).getHost();
	}
}

export {
	ADBlock
}
