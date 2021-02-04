import { createComponent, event } from "../../reactivity/index";
import Popup from "../v-popup/Popup";
createComponent()({
    props:{
        type: String, // 
        config: Object,
        actionType: String,
        actionConfig: Object
    },
    data: {
        radioType: true
    },
    methods: {
        tapAction(){
            const { type, actionType, actionConfig, radioType } = this.data; 
            if(type === 'img-radio'){
                this.set({
                    radioType: !radioType
                })
            }
            switch (actionType) {
                case "business":
                    const temp = this.getComponent(actionConfig.target);
                    temp[actionConfig.method](actionConfig.args)
                    break;
                case "jump":
                    this.jump(actionConfig.url);
                    break;
                case "go":
                    this.go(actionConfig.url);
                    break;
                case "alert":
                    Popup({})
                    break;
                default:
                    break;
            }
           
        }
    }
})
