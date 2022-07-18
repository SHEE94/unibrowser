!(function() {
	document.addEventListener('touchstart', function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		document.execCommand = null;
	})
	setInterval(function() {
		document.execCommand = null;
	}, 1000)
})()
