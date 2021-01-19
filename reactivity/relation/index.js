console.log(require.context);

const Custom =  Behavior({
		data: {
			_test: "ggggg"
		},
		created(){
			console.log(this.getRelationNodes("../test-a/index"));
			// Object.defineProperty(this, 'children', {
			// 	get: () => this.getRelationNodes(path) || [],
			// });
		}
	})
export function useParent(name, onEffect) {
	const path = `../${name}/index`;
	return {
		relations: {
			[path]: {
				type: 'ancestor',
				linked: function (target) {
					onEffect && onEffect.call(target);
				},
				linkChanged: function (target) {
					onEffect && onEffect.call(target);
				},
				unlinked: function (target) {
					onEffect && onEffect.call(target);
				},
			}
		},
		mixin: Custom
	}
}

export function useCustom(name, onEffect){
	const path = `../${name}/index`;
	return {
		relations: {
			[path]: {
				type: "descendant",
				target: Custom,
				linked: function(target) {
					console.info(target)
				}
			}
		},
		mixin: Behavior({
			created() {
				Object.defineProperty(this, 'children', {
					get: () => this.getRelationNodes(path) || [],
				});
			},
		}),
	}
}

export function useChildren(name, onEffect) {
	const path = `../${name}/index`;
	return {
		relations: {
			[path]: {
				type: 'descendant',
				linked: function(o,target) {
					onEffect && onEffect.call(o, target);
				},
				linkChanged: function (target) {
					onEffect && onEffect.call(o, target);
				},
				unlinked: function (target) {
					onEffect && onEffect.call(o, target);
				},
			},
		},

		mixin: Behavior({
			created() {
				Object.defineProperty(this, 'children', {
					get: () => this.getRelationNodes(path) || [],
				});
			},
		}),
	};
}