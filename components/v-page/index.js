// components/v-page/index.js
import {
    createComponent, 
    useChildren,
    useCustom
} from "../../reactivity/index"

createComponent({
    relation: useCustom("v-page"),
    data: {
        type: "parent"
    },
    created() { 
        console.log("test-b");
    },
    methods: {
        
    }
})