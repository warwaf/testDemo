const basic = Behavior({
	methods: {
		$emit: function (name, detail, options) {
			this.triggerEvent(name, detail, options);
		},
		set: function (data, callback) {
			this.setData(data, callback);
			return new Promise(function (resolve) {
				return wx.nextTick(resolve);
			});
		},

		getPage() {
			const pages = getCurrentPages();
			return pages[pages.length - 1];
		},
	},
});

export default basic