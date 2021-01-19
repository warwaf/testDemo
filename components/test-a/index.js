// components/test-a/index.js
import {
    createComponent, useParent
  } from "../../reactivity/index"
  
  createComponent({
    relation: useParent("v-page"),
    data: {
        type:"test-a"
    },
    created() {
    },
    methods: {
      // 获取 test a 数据
      getTestAData() {
        console.log(this.parent);
      },
      // 设置 test a 数据
      setTestADate() {
  
      }
    }
  })
