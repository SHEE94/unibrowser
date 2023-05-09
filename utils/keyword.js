export default (keyword) => {
	return new Promise((resolve, reject) => {
		var xhr = new plus.net.XMLHttpRequest();
		xhr.onreadystatechange = function() {
			switch (xhr.readyState) {
				case 4:
					if (xhr.status == 200) {
						let func = new Function(` 
						 function sug(p){
							 return p
						 };
						 return ${xhr.responseText};`)
						resolve(func())
					} else {
						reject( xhr.readyState)
					}

					break;
				default:
					break;
			}
		}
		xhr.open("GET", 'http://suggestion.baidu.com/su?wd=' + keyword + '&cb=sug');
		xhr.send();
	})

}