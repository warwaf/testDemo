import basic from "../../mixins/basic"
/**
 * 
 * @param {*} source 
 * @param {*} target 
 * @param {*} map 
 */
function mapKeys(source, target, map) {
	Object.keys(map).forEach((key) => {
		if (source[key]) {
			target[map[key]] = source[key];
		}
	});
}

/**
 * 
 * @param {*} Options 
 */
function createComponent(Options) {
	const options = {};
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
	
	console.log(options);
	Component(options);
}

export { createComponent };