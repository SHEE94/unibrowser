let ulcontent = document.querySelector('.A-shortcut .ul');

let createElenmt = (str, opts) => {
	let ele = document.createElement(str);
	if (opts) {
		Object.keys(opts).forEach(function(key) {
			ele.setAttribute(key, opts[key])
		})
	}
	return ele;
}

let keyArr = [{
		key: '=',
		type: 'key'
	},
	{
		key: '(',
		type: 'key'
	},
	{
		key: ')',
		type: 'key'
	}, {
		key: '{',
		type: 'key'
	}, {
		key: '}',
		type: 'key'
	}, {
		key: '[',
		type: 'key'
	}, {
		key: ']',
		type: 'key'
	}, {
		key: ';',
		type: 'key'
	},{
		key: '()',
		type: 'key'
	}, {
		key: '{}',
		type: 'key'
	},
	{
		key: '[]',
		type: 'key'
	},
	{
		key: '/',
		type: 'key'
	},
	{
		key: '<',
		type: 'key'
	},
	{
		key: '>',
		type: 'key'
	}
]
let frag = document.createDocumentFragment()
for(let i = 0;i<keyArr.length;i++){

	let liDom = createElenmt('li',{
		'class':'v'+i,
		'data-type':keyArr[i].type,
		'data-sel':keyArr[i].key
	})
	liDom.innerHTML = keyArr[i].key;
	frag.appendChild(liDom);
}
ulcontent.appendChild(frag)