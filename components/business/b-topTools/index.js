import {
    createComponent
} from "../../../reactivity/index"
createComponent()({
    props: {
        props: Object
    },
    data: {},
    mounted(){
        console.log(this.data.props);
    },
})