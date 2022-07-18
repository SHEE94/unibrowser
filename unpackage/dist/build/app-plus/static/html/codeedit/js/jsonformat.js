//格式化代码函数,已经用原生方式写好了不需要改动,直接引用就好
 var formatJson = function(json) {
 	var formatted = '', //转换后的json字符串
 		padIdx = 0, //换行后是否增减PADDING的标识
 		PADDING = '    '; //4个空格符
 	/**
 	 * 将对象转化为string
 	 */
 	if (typeof json !== 'string') {
 		json = JSON.stringify(json);
 	}
 	/** 
 	 *利用正则类似将{'name':'ccy','age':18,'info':['address':'wuhan','interest':'playCards']}
 	 *---> \r\n{\r\n'name':'ccy',\r\n'age':18,\r\n
 	 *'info':\r\n[\r\n'address':'wuhan',\r\n'interest':'playCards'\r\n]\r\n}\r\n
 	 */
 	json = json.replace(/([\{\}])/g, '\r\n$1\r\n')
 		.replace(/([\[\]])/g, '\r\n$1\r\n')
 		.replace(/(\,)/g, '$1\r\n')
 		.replace(/(\r\n\r\n)/g, '\r\n')
 		.replace(/\r\n\,/g, ',');
 	/** 
 	 * 根据split生成数据进行遍历，一行行判断是否增减PADDING
 	 */
 	(json.split('\r\n')).forEach(function(node, index) {
 		var indent = 0,
 			padding = '';
 		if (node.match(/\{$/) || node.match(/\[$/)) indent = 1;
 		else if (node.match(/\}/) || node.match(/\]/)) padIdx = padIdx !== 0 ? --padIdx : padIdx;
 		else indent = 0;
 		for (var i = 0; i < padIdx; i++) padding += PADDING;
 		formatted += padding + node + '\r\n';
 		padIdx += indent;
 		console.log('index:' + index + ',indent:' + indent + ',padIdx:' + padIdx + ',node-->' + node);
 	});
 	return formatted;
 };
