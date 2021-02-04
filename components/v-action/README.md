# 名称：action 组件
## 描述： 更加不同的用户行为，触发不同的事件
### 参数：
- type 类型
    - img
    - img-radio
    - text
    - button
- config 组件配置    
    - url  图片地址（类型为img时必须） 
    - beforeUrl 图片地址（类型为img-radio时必须） 
    - afterUrl 图片地址（类型为img-radio时必须） 
    - text 文本（类型为text/button时必须）
- actionType 事件类型
    - alert    弹窗 
    - go       跳转内部页面
    - jump     跳转到tabBar页面
    - business 目标业务组件
- actionConfig 事件配置
    参数：
    - url      要跳转的地址   （actionType 为 go/jump 是必须）
    - target   目标业务组件id （actionType为business时）
    - method   要调用的方法   （actionType为business时）
    - args     方法的参数     （actionType为business时）
### 对外暴露的方法
- 无