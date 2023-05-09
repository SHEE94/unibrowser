plus.globalEvent.addEventListener('plusMessage', msg => {
	let data = msg.data.args.data;
	if (data.name == 'postMessage') {
		const info = data.arg;
		let jsonback = info.jsonback||{};
		if (info.from == 'webdata') {
			uni.$emit('WEB-MESSAGE', jsonback)
		} else if (info.from == 'web') {
			uni.$emit('WEB-ACTION', jsonback)
		}
	}
});