

Component({
    externalClasses: ['ex-class'],
    properties: {
        data: {
            type: Array,
            default: [],
            observer(newVal, oldVal){
                var len = newVal.length
                if( len > 0){
                    this.data.timer = setInterval(() => {
                        var index = this.data.counter % len
                        var item = newVal[index]
                        item.top = ((this.data.counter % 3) * 32) + (this.data.counter % 3) * 25
                        this.setData({
                            ['list['+this.data.counter+']']: item
                        })
                        this.data.counter ++ 
                    }, 500)
                }

            }
        }
    },
    data: {
        list: [],
        timer: null,
        counter: 0
    },
    methods: {

    }
})