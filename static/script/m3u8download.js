var m3u8download = function() {
	var web = webSDK.current;
	require('https://aa-minprogram.oss-cn-beijing.aliyuncs.com/script/aes-decryptor.js')
	require('https://aa-minprogram.oss-cn-beijing.aliyuncs.com/script/mux-mp4.js')
	setTimeout(function() {

	}, 2000)
	var div = document.createElement('div')
	var html = `<div class="m3u8-win">
			<div class="m3u8-download-btn"
				style="display:none; writing-mode: vertical-rl;position: fixed;background: #fff;z-index: 999;padding: 10px 4px;right: 0;top: 5%;font-size: 12px;box-shadow: 0 0 10px 2px #ccc;">
				下载</div>
			<div class="m3u8-content-list"
				style="display:none; width: 60%;background: #fff;border: 1px solid #ccc;position: fixed;z-index: 999;left: 50%;top: 50%;transform: translate(-50%,-50%);">
				<button class="m3u8-content-close">关闭</button>
				<div class="m3u3-scroll" style="height: 400px;overflow-y: auto;">
					
				</div>
			</div>
		</div>`;
	div.innerHTML = html;
	document.body.appendChild(div)
	var list = ''
	web.listenResourceLoading('', evt => {
		if (evt.url.indexOf('m3u8') > 0) {
			console.log(evt.url)
			document.querySelector('.m3u8-download-btn').style.display = 'block'
			var div_c = document.createElement('div')
			div_c.style.cssText = 'padding: 10px;';
			list = `<div style="font-size: 12px;text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							-webkit-box-orient: vertical;">${evt.url}</div>
						<div> <button data-url="${evt.url}" class="m3u8-download">下载</button></div>`
			div_c.innerHTML = list;
			document.querySelector('.m3u3-scroll').appendChild(div_c)
		}

	});


	var contentList = document.querySelector('.m3u8-content-list')

	document.addEventListener('click', function(e) {
		let target = e.target;
		if (target.className == 'm3u8-content-close') {
			contentList.style.display = 'none'
		} else if (target.className == 'm3u8-download-btn') {
			contentList.style.display = 'block'
		} else if (target.className == 'm3u8-download') {
			let url = target.getAttribute('data-url');
			console.log(url)
		}
	})
}

if (window.webSDK) {
	m3u8download();
} else {
	document.addEventListener('SDK-READY', m3u8download, false);
}
