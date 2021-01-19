// components/test-b/index.js
import {
  createComponent,
  useParent
} from "../../reactivity/index"

createComponent({
  relation: useParent("v-page"),
  data: {
    type: "test-b"
  },
  created() {
    console.log(this.page);
    
  },
  methods: {
    // 获取 test a 数据
    getTestAData() {
      console.log(this.parent.children);
    },
    // 设置 test a 数据
    setTestADate() {

    }
  }
})