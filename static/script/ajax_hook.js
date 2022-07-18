const xhr_prototype = XMLHttpRequest.prototype;

xhr.onload = function(){
	if(xhr.readyState == 4 && xhr.status == 200){
		console.log('responseText',this.responseText)
	}
	
}