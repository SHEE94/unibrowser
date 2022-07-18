let commands = document.getElementById("commands");
let editor = CodeMirror.fromTextArea(commands, {
	lineNumbers: true,
	matchBrackets: true,
	continueComments: "Enter",
	theme: 'material',
	lint: true,
	autofocus: true,
	mode: {
		name: "javascript",
		globalVars: true
	},
	hintOptions: { // 自定义提示选项
		completeSingle: false
	}
});
document.addEventListener('UniAppJSBridgeReady', function() {
	editor.focus()
	let notKey = [13, 32, 8, 186, 16, 222, 187];
	document.onkeyup = (evt) => {
		// 如果不存在数组中将触发
		if (notKey.indexOf(evt.keyCode) == -1 && editor.hasFocus()) {
			editor.showHint();
			CodeMirror.hint.javascript(editor);
		}
	}
	let saveState = window.localStorage.savestate;
	if (saveState) {
		editor.setValue(saveState)
	}
	let _postMessage = plus.storage.getItem('postMessage');
	let _postMessageData = {};
	if (_postMessage) {
		let _postMessageJson = JSON.parse(_postMessage);
		if (_postMessageJson.type == 'edit') {
			_postMessageData = _postMessageJson.data;
			editor.setValue(_postMessageData.script)
		}
	}

	let ul = document.querySelector('.A-shortcut .ul').children;

	let selectEvent = (sel) => {
		switch (sel) {
			case 'Revoke':
				editor.undo();
				break;
			case 'Redo':
				editor.redo()
				break;
			case 'clearAll':
				editor.setValue('')
				break;
			default:
				break;
		}
		editor.focus()
	}


	let keyEvent = (sel) => {
		let pos = editor.getCursor()
		let pos2 = {};
		pos2.line = pos.line;
		pos2.ch = pos.ch;
		editor.replaceRange(sel, pos2);
		editor.focus()
	}

	let barEvent = (e) => {
		let target = e.target,
			_type = target.dataset.type,
			sel = target.dataset.sel;
		switch (_type) {
			case 'select':
				selectEvent(sel)
				break;
			case 'key':
				keyEvent(sel)
				break;
		}
	}
	for (let i = 0, len = ul.length; i < len; i++) {
		ul[i].addEventListener('click', barEvent)
	}

	// 打开调式网页
	document.querySelector('#test-webview').addEventListener('click', (e) => {
		plus.storage.setItem('debug_script', JSON.stringify({
			type: 'debug',
			data: editor.getValue()
		}))
		let debugurl = window.localStorage.debugurl != 'undefined' ? window.localStorage.debugurl : '';

		mui.prompt('输入你要调式的网页', debugurl, '提示', '', function(e) {
			if (e.index != 1) return;

			let url = '/pages/test-webview/test-webview';
			if (e.value) {
				url = url + '?url=' + e.value
			}
			if (!e.value && debugurl) {
				url = url + '?url=' + debugurl
			}
			window.localStorage.debugurl = e.value || debugurl;
			uni.navigateTo({
				url: url
			})

		})

	})
	// 定时保存
	let stoptime = setInterval(() => {
		window.localStorage.savestate = editor.getValue();
	}, 15000)

	window.addEventListener("beforeunload", function(event) {
		window.localStorage.savestate = editor.getValue();
		if (stoptime) {
			clearInterval(stoptime);
		}
	});

	// 初始化
	document.querySelector('#init').addEventListener('click', (e) => {
		keyEvent('')
	})

	// 保存脚本
	document.querySelector('#savedb').addEventListener('click', (e) => {
		let target = e.target;
		mui.prompt('保存你的脚本名称', '', '提示', '', function(e) {
			if (e.index == 1 && e.value != '') {
				let codeData = editor.getValue();
				let obj = {
					name: e.value,
					script: codeData,
					active: false
				}
				uni.postMessage({
					data: {
						action: 'message',
						script: obj
					}
				})
				window.localStorage.savestate = codeData;
				mui.toast('保存成功: ' + e.value)
			}
		})
	})
})
