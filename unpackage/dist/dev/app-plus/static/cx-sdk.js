
var cx = {
	init(){
		console.log(123)
	}
}
var cxReady = new CustomEvent('cx_ready', cx);
// 随后在对应的元素上触发该事件
if(window.dispatchEvent) {  
    window.dispatchEvent(cxReady);
} else {
    window.fireEvent(cxReady);
}