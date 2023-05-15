export function debounce(func, wait = 1000, immediate = false) {
	let timer;

	return function() {
		let context = this;
		let args = arguments;

		if (timer) clearTimeout(timer);
		if (immediate) {
			var callNow = !timer;
			timer = setTimeout(() => {
				timer = null;
			}, wait)
			if (callNow) func.apply(context, args)
		} else {
			timer = setTimeout(function() {
				func.apply(context, args)
			}, wait);
		}
	}
}
