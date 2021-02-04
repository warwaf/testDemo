import basic from "../mixins/basic";
import { event, request } from '../index';
/**
 * 替换 object 的key值
 * @param {*} source 源数据
 * @param {*} target 目标数据
 * @param {*} map 对应值
 */
function mapKeys(source, target, map) {
	Object.keys(map).forEach((key) => {
		if (source[key]) {
			target[map[key]] = source[key];
		}
	});
}
/**
 * @description 空函数
 * @returns {number}
 */
const EMPTY_FN = () => {};
/**
 * 
 * @param {*} Options 
 */
function createComponent() {
	return function (Options) {
		const { $store } = getApp();
		const options = {};
		options.$event = event;
		const created = Options.created || EMPTY_FN;
		Options.created = function(...args){
			this.$event = event;
			this.$store = $store;
			this.fetch = request;
			created.apply(this, args);
		}
		mapKeys(Options, options, {
			data: 'data',
			props: 'properties',
			mixins: 'behaviors',
			methods: 'methods',
			beforeCreate: 'created',
			created: 'attached',
			mounted: 'ready',
			destroyed: 'detached',
			classes: 'externalClasses',
		})
		options.externalClasses = options.externalClasses || [];
		options.externalClasses.push('custom-class');
		// add default behaviors
		options.behaviors = options.behaviors || [];
		options.behaviors.push(basic);

		// add relations
		const {
			relation
		} = Options;
		if (relation) {
			options.relations = relation.relations;
			options.behaviors.push(relation.mixin);
		}

		// map field to form-field behavior
		if (Options.field) {
			options.behaviors.push('wx://form-field');
		}

		// add default options
		options.options = {
			multipleSlots: true,
			addGlobalClass: true,
		};

		Component.call(null, options);
	}
}

export {
	createComponent
};