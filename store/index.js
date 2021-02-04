import { Store } from '../reactivity/index';

export default new Store({
  state: {
    token: null,
    student: {
      name: '张三'
    },
    count: 0
  },
  getters:{
    getToken(){
        return this.state.token
    }
  },
  mutations: {
    changeState: (state, data) => {
      Object.keys(data).forEach(key => (state[key] = data[key]));
    }
  }
});