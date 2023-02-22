export default function() {
	// #ifdef APP-PLUS
	return new Promise((resolve, reject) => {
		let appid = plus.runtime.appid == "HBuilder"?"__UNI__E587B13":plus.runtime.appid;
		plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
			uniCloud.callFunction({
				name: 'check-version',
				data: {
					appid: appid,
					appVersion:plus.runtime.version,
					wgtVersion:widgetInfo.version
				},
				success: (e) => {
					resolve(e)
				},
				fail: (error) => {
					reject(error)
				}
			})
		})
	})
	// #endif
	// #ifndef APP-PLUS
	return new Promise((resolve, reject) => {
		reject({
			message: '请在App中使用'
		})
	})
	// #endif
}
