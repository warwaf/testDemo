import { createComponent } from "../../reactivity/index"
createComponent()({
    data: {
        show: false,
        maskCancel: true
    },
    methods: {
        cancelTap(){
            if(!this.data.maskCancel) return;
            this.setData({
                show: false
            })
        }
    }
})
