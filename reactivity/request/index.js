import apiSettings from "../../utils/ApiSetting"
export default function request(param) {
    const app =  getApp();
    const baseUrl = apiSettings.Host;
    return new Promise((resolve, reject) => {
        if (param.url.startsWith('https') || param.url.startsWith('http')) {
            var url = param.url
        } else {
            var url = baseUrl + param.url
        }
        let header = param.header ? param.header : {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        header = Object.assign(header, {
            accessToken: app.globalData.mtq_token
        })
        wx.request({
            url,
            data: param.data,
            dataType: "json",
            header,
            method: param.method ? param.method : 'GET',
            success: function (res) {
                resolve(res.data)
            },
            fail: function (res) {
                reject(res)
            }
        })
    })
}