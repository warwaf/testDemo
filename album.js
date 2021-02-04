export default {
    "title": "活动相册",
    "description": "这是一个描述",
    plugins: {
        backgrounds: [],
        cores: [
            {
                title: "顶部导航组件",
                type: "topTools",
                props: {
                    list: [
                        {
                            type: "img",
                            config: {
                                url: "https://hcmtq.oss-accelerate.aliyuncs.com/resources/new/refresh@2x.png"
                            },
                            actionType: "business",
                            actionConfig: {
                                target: "#vWaterfall",
                                method: "_reflesh",
                                args: {
                                    test: 1
                                }
                            }
                        },
                        {
                            type: "img-radio",
                            config: {
                                beforeUrl: "https://hcmtq.oss-accelerate.aliyuncs.com/resources/home-menu-3.png",
                                afterUrl: "https://hcmtq.oss-accelerate.aliyuncs.com/resources/home-menu-1.png"
                            },
                            actionType: "business",
                            actionConfig: {
                                target: "#vWaterfall",
                                method: "_toggle",
                                args: {
                                    test: 1
                                }
                            }
                        },
                        {
                            type: "img",
                            config: {
                                url: "https://hcmtq.oss-accelerate.aliyuncs.com/resources/home-menu-2.png",
                            },
                            actionType: "go",
                            actionConfig: {
                                url: "/pages/album/setting/setting"
                            }
                        }
                    ]
                },
            },
            {
                title: "瀑布流业务组件",
                type: "waterfall",
                props:{}
            }
        ],
        tools: [
            {
                title: "工具业务组件",
                type: "leftTools",
                props:{
                    list: [
                        {
                            type: "img",
                            config: {
                                width: "70px",
                                height: "100px",
                                url: "http://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/v1.9/icon9.png",
                            },
                            actionType: "alert",
                            actionConfig: {
                                url: "/pages/album/setting/setting"
                            }
                        },
                        {
                            type: "img",
                            config: {
                                width: "48px",
                                height: "48px",
                                url: "http://hcmtq.oss-cn-hangzhou.aliyuncs.com/resources/new/back-top.png",
                            },
                            actionType: "go",
                            actionConfig: {
                                url: "/pages/album/setting/setting"
                            }
                        },
                        {
                            type: "img",
                            config: {
                                width: "48px",
                                height: "48px",
                                url: "https://mtqpic.oss-cn-hangzhou.aliyuncs.com/diy-icon.png",
                            },
                            actionType: "go",
                            actionConfig: {
                                url: "/pages/album/setting/setting"
                            }
                        },
                        {
                            type: "img",
                            config: {
                                width: "48px",
                                height: "48px",
                                url: "http://hcmtq.oss-cn-hangzhou.aliyuncs.com/resources/new/face@2x.png",
                            },
                            actionType: "go",
                            actionConfig: {
                                url: "/pages/album/setting/setting"
                            }
                        },
                        {
                            type: "img",
                            config: {
                                width: "48px",
                                height: "48px",
                                url: "http://hcmtq.oss-cn-hangzhou.aliyuncs.com/resources/new/ar@2x.png",
                            },
                            actionType: "go",
                            actionConfig: {
                                url: "/pages/album/setting/setting"
                            }
                        },
                        
                        {
                            type: "img",
                            config: {
                                width: "48px",
                                height: "48px",
                                url: "http://hcmtq.oss-cn-hangzhou.aliyuncs.com/resources/new/share.png",
                            },
                            actionType: "go",
                            actionConfig: {
                                url: "/pages/album/setting/setting"
                            }
                        },
                    ]
                }
            }
        ],
        alerts: []
    },
}