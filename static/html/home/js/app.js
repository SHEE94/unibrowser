var mySwiper = new Swiper('.swiper-container', {
	direction: 'horizontal', // 垂直切换选项
	loop: false, // 循环模式选项
	initialSlide: 1,
	// 如果需要分页器
	pagination: {
		el: '.swiper-pagination',
	},

})
let searchEngine = 'https://www.baidu.com/s?wd='

function to_link(txtContent) {
	let domainArr = txtContent.split('.');
	let text = searchEngine + txtContent;
	let reg = /^(http|HTTP)/;
	if (domainArr.length == 1) {
		return text;
	}
	if (domainArr.length == 2) {
		if (!reg.test(domainArr[0])) {
			text = 'https://www.' + txtContent;
		} else {
			text = txtContent;
		}
	} else if (domainArr.length > 2) {
		if (!reg.test(domainArr[0])) {
			text = 'https://' + txtContent;
		} else {
			text = txtContent;
		}
	}
	return text;
}
let history = localStorage.searchHistory || '[]';
history = JSON.parse(history);
history.forEach(function(item) {
	$('.history-list').append('<span style="margin-right:10px">' + item + '</span>')
})
$('.clear-history').on('click', function() {
	console.log(1)
	history = [];
	localStorage.searchHistory = '[]';
	$('.history-list').html('')
})

function onsearchs(e) {
	let val = $('.search__input').val()
	if (history.length > 30) {
		history = history.slice(0, 28)
	}
	history.unshift(val)
	localStorage.searchHistory = JSON.stringify(history);
	let link = to_link(val);
	console.log(val)
	location.href = link;
}

window.addEventListener('SDK-READY', function() {
	// webSDK.sendMessage({
	// 	current: 'home'
	// })
	// 设置首页书签
	let homebookmark = plus.storage.getItem('homebookmark');
	if (typeof homebookmark == 'string') {
		homebookmark = JSON.parse(homebookmark).data
	} else {
		homebookmark = homebookmark.data;
	}
	console.log(JSON.stringify(homebookmark))
	let str = '';
	for (let i = 0; i < homebookmark.length; i++) {
		str += `<div class="web-card"  data-url="${homebookmark[i].url}">
							<img src="${homebookmark[i].ico}" class="banner"/>
							<div class="title">${homebookmark[i].title}</div>
						</div>`


	}
	$('.apps').html(str)

	$(document).on('click', '.web-card', function() {
		let url = $(this).attr('data-url');
		location.href = url;
	})
})
