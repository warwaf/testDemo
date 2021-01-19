// components/test.js
import { createComponent } from "../reactivity/index"

createComponent({
  data:{
    test: "asdf",
    page:"page"
  },
  created(){
    console.log(this);
  }
})