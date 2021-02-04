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
		/**
		 * 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。
		 * @param {*} url
		 */
		go(url) {
			wx.navigateTo({
				url
			})
		},
		/**
		 * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
		 * @param {*} url 
		 */
		jump(url) {
			wx.switchTab({
				url
			})
		},
		/**
		 * 获取组件坐在的页面
		 */
		getPage() {
			const pages = getCurrentPages();
			return pages[pages.length - 1];
		},
		/**
		 * 获取组件所在页面的 组件对象实例
		 * @param {*} selector 匹配选择器 
		 * 
		 *  selector类似于 CSS 的选择器，但仅支持下列语法。
		 *	ID选择器：#the-id
		 *	class选择器（可以连续指定多个）：.a-class.another-class
		 *	子元素选择器：.the-parent > .the-child
		 *	后代选择器：.the-ancestor .the-descendant
		 *	跨自定义组件的后代选择器：.the-ancestor >>> .the-descendant
		 *	多选择器的并集：#a-node, .some-other-nodes
		 */
		getComponent(selector) {
			return this.getPage().selectComponent(selector)
		}
	},
});

export default basic