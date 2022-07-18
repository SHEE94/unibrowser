/* 

 */

var overridingDomai = function(){
	var web = webSDK.current;
	web.overrideUrlLoading({}, callback);
}

if (window.webSDK) {
	overridingDomai();
} else {
	document.addEventListener('SDK-READY', overridingDomai, false);
}
