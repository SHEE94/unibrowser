const db = uniCloud.database();
export default {
	add(name, data) {
		return new Promise((resolve, reject) => {
			db.collection(name).add(data).then(res => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
		})
	},
	remove(name, where) {
		return new Promise((resolve, reject) => {
			db.collection(name).where(where).remove().then(res => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
		})
	},
	update(name, where, data) {
		return new Promise((resolve, reject) => {
			db.collection(name).where(where)
				.update(data).then(res => {
					resolve(res)
				}).catch((err) => {
					reject(err)
				})
		})
	},
	get(name) {
		return new Promise((resolve, reject) => {
			db.collection(name)
				.get()
				.then(data => {
					let res = data.result.data;
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
}
