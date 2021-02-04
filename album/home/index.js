// album//home/index.js
import { createPage } from "../../reactivity/index";
import albumConfig from "../../album";
console.log(albumConfig);
createPage()({
    $data(){
        return {
            backgroundList: albumConfig.plugins.backgrounds,
            coreList: albumConfig.plugins.cores,
            toolList: albumConfig.plugins.tools,
            alertList: albumConfig.plugins.alerts
        }
    },
    onLoad: function(){
        wx.setNavigationBarTitle({
            title: albumConfig.title
        })
    }
})