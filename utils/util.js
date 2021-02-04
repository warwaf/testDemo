//公共函数库
import {
    Home
} from '../pages/album/home/home-model.js'
import regeneratorRuntime from './runtime.js'
import {
    isNumber,
    isBoolean
} from 'util';

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTime1 = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const isLogin = () => {
    if (!getApp().globalData.userInfo.mobileNo) {
        wx.navigateTo({
            url: '/pages/common/userPhone/userPhone'
        })
        return false
    }
    return true
}

const isRegistered = () => {
    var homeModel = new Home()
    return new Promise((resolve, reject) => {
        if (JSON.stringify(getApp().globalData.userInfo) == '{}' || !getApp().globalData.userInfo) {
            homeModel.getUnionid().then(() => {
                homeModel.getUserPhoneByUnionId().then(res => {
                    if (res.result) {
                        resolve(true)
                    }
                }).catch(err => {
                    // wx.navigateTo({
                    //     url: '/pages/common/userinfo/userinfo'
                    // })
                    // resolve(false)
                    reject(err)
                })
            }).catch(() => {
                reject()
            })
        } else {
            resolve(true)
        }
    })
}

const isExpired = () => {
    return new Date(getApp().globalData.activityInfo.endTime) > new Date()
}

const btoa = function (str) { // 编码，配合encodeURIComponent使用
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var i = 0,
        len = str.length,
        strin = '';
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
            strin += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
            strin += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        strin += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return strin
}

const safeBtoa = function (str) {
    return btoa(str).replace('/', '_').replace('+', '-')
}

function getAstro(month, day) {
    var s = "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
    var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
    return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2);
}

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }

        } catch (e) {
            return false;
        }
    }
}

function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 >= num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}

var downloadImage = function (url) {
    // wx.showToast({
    //     image: "",
    //     title: "下载中"
    // })
    wx.showLoading({
        title: '下载中',
        mask: true
    });
    wx.downloadFile({
        url,
        success: res => {
            wx.hideLoading();
            wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: res => {
                    wx.showToast({
                        title: '保存成功'
                    })
                },
                fail: function (err) {
                    if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                        // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                        wx.showModal({
                            title: '提示',
                            content: '需要您授权保存相册',
                            showCancel: false,
                            success: modalSuccess => {
                                wx.openSetting({
                                    success(settingdata) {
                                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                            wx.showModal({
                                                title: '提示',
                                                content: '获取权限成功,再次点击图片即可保存',
                                                showCancel: false,
                                            })
                                        } else {
                                            wx.showModal({
                                                title: '提示',
                                                content: '获取权限失败，将无法保存到相册哦~',
                                                showCancel: false,
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    }
                },
            })
        },
        fail: () => {
            wx.showToast({
                title: '下载失败',
                icon: 'none',
                image: "/resources/1.10.2/error.png"
            })
        }
    })
}
/**
 * @param {province:'441000', city:'441900', area:'441901'}
 * @return {province:'广东省', city:'东莞市', area:'虎门镇'}
 */
var codeToRegion = function (addressInfo) {
    var list = JSON.parse(JSON.stringify(addressInfo))
    var homeModel = new Home()
    return new Promise((resolve, reject) => {
        homeModel.getAddressMap().then(data => {
            if (list instanceof Array) {
                list.forEach((element, addressIndex) => {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].RegionCode == list[addressIndex].province) {
                            list[addressIndex].province = data[i].description
                            for (let j = 0; j < data[i].CityItems.length; j++) {
                                if (list[addressIndex].city == data[i].CityItems[j].RegionCode) {
                                    list[addressIndex].city = data[i].CityItems[j].description
                                    for (let k = 0; k < data[i].CityItems[j].AreaItems.length; k++) {
                                        if (list[addressIndex].area == data[i].CityItems[j].AreaItems[k].RegionCode) {
                                            list[addressIndex].area = data[i].CityItems[j].AreaItems[k].description
                                            break
                                        }
                                    }
                                    break
                                }
                            }
                            break
                        }
                    }
                });
            } else {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].RegionCode == list.province) {
                        list.province = data[i].description
                        for (let j = 0; j < data[i].CityItems.length; j++) {
                            if (list.city == data[i].CityItems[j].RegionCode) {
                                list.city = data[i].CityItems[j].description
                                for (let k = 0; k < data[i].CityItems[j].AreaItems.length; k++) {
                                    if (list.area == data[i].CityItems[j].AreaItems[k].RegionCode) {
                                        list.area = data[i].CityItems[j].AreaItems[k].description
                                        break
                                    }
                                }
                                break
                            }
                        }
                        break
                    }
                }
            }
            resolve(list)
        })
    })
}

/**
 * 
 * @param {province:'广东省', city:'东莞市', area:'虎门镇'}
 * @return {province:'441000', city:'441900', area:'441901'}
 */
var regionToCode = function (region) {
    var homeModel = new Home()
    return new Promise((resolve, reject) => {
        homeModel.getAddressMap().then(data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].description == region.province) {
                    region.province = data[i].RegionCode
                    for (let j = 0; j < data[i].CityItems.length; j++) {
                        if (data[i].CityItems[j].description == region.city) {
                            region.city = data[i].CityItems[j].RegionCode
                            for (let k = 0; k < data[i].CityItems[j].AreaItems.length; k++) {
                                if (data[i].CityItems[j].AreaItems[k].description == region.area) {
                                    region.area = data[i].CityItems[j].AreaItems[k].RegionCode;
                                    break
                                }
                            }
                            break
                        }
                    }
                    break
                }
            }
            resolve(region)
        })
    })
}
/**
 * 
 * @param '441901'
 * @return {province:'广东省', city:'东莞市', area:'虎门镇'}
 */
var codeToAddress = function (code) {
    var homeModel = new Home()
    return new Promise((resolve, reject) => {
        homeModel.getAddressMap().then(data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].RegionCode == code) {
                    resolve({
                        province: data[i].description,
                        city: '',
                        area: ''
                    })
                    return
                }
                for (let j = 0; j < data[i].CityItems.length; j++) {
                    if (data[i].CityItems[j].RegionCode == code) {
                        resolve({
                            province: data[i].description,
                            city: data[i].CityItems[j].description,
                            area: ''
                        })
                        return
                    }
                    for (let k = 0; k < data[i].CityItems[j].AreaItems.length; k++) {
                        if (data[i].CityItems[j].AreaItems[k].RegionCode == code) {
                            resolve({
                                province: data[i].description,
                                city: data[i].CityItems[j].description,
                                area: data[i].CityItems[j].AreaItems[k].description
                            })
                            return
                        }
                    }
                }

            }
            resolve(region)
        })
    })
}


var isPhone = function (phone) {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(phone)) {
        return false;
    } else {
        return true;
    }
}

var getLocaltion = function () {
    return new Promise((resolve, reject) => {
        //获取用户地理位置
        wx.getSetting({
            success: res => {
                if (!res.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success: () => {
                            wx.getLocation({
                                type: 'wgs84',
                                altitude: true,
                                success: result => {
                                    wx.request({
                                        url: `https://api.map.baidu.com/reverse_geocoding/v3/?language_auto=1&extensions_town=true&coordtype=gcj02ll&location=${result.latitude},${result.longitude}&output=json&ak=PgXDi0DAHfnGnfCi7GgZAey87o4cPHmA`,
                                        header: {
                                            'content-type': 'application/json'
                                        },
                                        method: 'GET',
                                        dataType: 'json',
                                        responseType: 'text',
                                        success: (res) => {
                                            console.log(res)
                                            resolve(res.data.result.addressComponent.city)
                                        },
                                        fail: (err) => {
                                            reject(err)
                                        }
                                    })
                                }
                            })
                        },
                        fail: (err) => {
                            reject(err)
                        }
                    })
                } else {
                    wx.getLocation({
                        type: 'wgs84',
                        altitude: true,
                        success: result => {
                            wx.request({
                                url: `https://api.map.baidu.com/reverse_geocoding/v3/?language_auto=1&extensions_town=true&coordtype=gcj02ll&location=${result.latitude},${result.longitude}&output=json&ak=PgXDi0DAHfnGnfCi7GgZAey87o4cPHmA`,
                                header: {
                                    'content-type': 'application/json'
                                },
                                method: 'GET',
                                dataType: 'json',
                                responseType: 'text',
                                success: (res) => {
                                    console.log(res);

                                    resolve(res.data.result.addressComponent.city)
                                },
                                fail: (err) => {
                                    reject(err)
                                }
                            })
                        }
                    })
                }
            },
            fail(err) {
                reject(err)
            }
        })
    })
}
/**
 * 获取用户经纬度坐标
 */
var getCoordinate = function () {
    return new Promise((resolve, reject) => {
        //获取用户地理位置
        wx.getSetting({
            success: res => {
                if (!res.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success: () => {
                            wx.getLocation({
                                type: 'wgs84',
                                altitude: true,
                                success: result => {
                                    resolve(result)
                                }
                            })
                        },
                        fail: err => {
                            reject(err)
                        }
                    })
                } else {
                    wx.getLocation({
                        type: 'wgs84',
                        altitude: true,
                        success: result => {
                            resolve(result)
                        }
                    })
                }
            }
        })
    })
}
var getLocaltionByCoordinate = function (latitude, longitude) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://api.map.baidu.com/reverse_geocoding/v3/?language=local&extensions_town=true&coordtype=gcj02ll&location=${latitude},${longitude}&output=json&ak=PgXDi0DAHfnGnfCi7GgZAey87o4cPHmA`,
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
                if (res.data.result) {
                    resolve(res.data.result.addressComponent.city)
                } else {
                    reject()
                }
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}
/**
 * 合成二维码
 */
// var generateCover = async function(activityInfo, ctx, canvasId='qrcode'){
//     wx.showLoading()
//     var app = getApp()
//     var niackName = app.globalData.userInfo.nickName.length > 10 ? app.globalData.userInfo.nickName.slice(0,10) + '...' : app.globalData.userInfo.nickName
//     var activityName = activityInfo.activityName.length > 20 ?  activityInfo.activityName.slice(0,20) + '...' : activityInfo.activityName
//     var browseCount = activityInfo.browseCount
//     if(browseCount > 9999){
//         browseCount = '9999+'
//     }else if(browseCount > 999){
//         browseCount = '999+'
//     }
//     var bg = await getImageInfo('https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190403/C0003763920190403/origin/173af047f9a34ccab3dbb95b3038d3ca.png')
//     ctx.drawImage(bg.path, 0, 0, 750, 1334)
//     var qrcode = await getImageInfo(activityInfo.qrcodeImg)
//     ctx.drawImage(qrcode.path, 100, 1070, 170, 170)
//     var banner = await getImageInfo(activityInfo.bannerImg.replace('http://','https://'))
//     ctx.drawImage(banner.path, 52, 176, 644, 323)
//     var diolog = await getImageInfo('https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190403/C0003763920190403/origin/0378ef56a6f9410cb5e7e3e4d6caf6a2.png')
//     ctx.drawImage(diolog.path, 438, 136, 294, 170)
//     ctx.setFontSize(42)
//     ctx.setFillStyle('#240101')
//     ctx.setTextAlign('left')
//     ctx.fillText(niackName, 70, 100)
//     ctx.strokeText(niackName, 70, 100)
//     ctx.setFontSize(36)
//     ctx.setFillStyle('#FFDE00')
//     ctx.setStrokeStyle('#FFDE00')
//     ctx.fillText(activityInfo.total, 460, 200)
//     ctx.strokeText(activityInfo.total, 460, 200)
//     ctx.fillText(browseCount, 460, 250)
//     ctx.strokeText(browseCount, 460, 250)
//     var textWidth1 = ctx.measureText(activityInfo.total).width
//     var textWidth2 = ctx.measureText(browseCount).width
//     ctx.setFontSize(32)
//     ctx.setFillStyle('#FFFFFF')
//     ctx.setStrokeStyle('#FFFFFF')
//     ctx.fillText('张照片', 570, 195)
//     ctx.strokeText('张照片', 570, 195)
//     ctx.fillText('次浏览', 570, 245)
//     ctx.strokeText('次浏览', 570, 245)
//     ctx.setFillStyle('#240101')
//     ctx.setStrokeStyle('#240101')
//     ctx.fillText(activityName, 70, 560)
//     ctx.strokeText(activityName, 70, 560)
//     wx.hideLoading()
//     ctx.draw(true, () => {
//         wx.canvasToTempFilePath({
//             x: 0,
//             y: 0,
//             canvasId: canvasId,
//             fileType: 'png',
//             success: (result)=>{
//                 // downloadImage(result.tempFilePath)
//                 wx.saveImageToPhotosAlbum({
//                     filePath: result.tempFilePath,
//                     success: (result)=>{
//                         wx.showToast({
//                             title: '保存成功',
//                             icon: 'none'
//                         });
//                         console.log(result);
//                     }
//                 })
//             }
//         }, this)
//     })
// }
var generateCover = async function (activityInfo, ctx, canvasId = 'qrcode') {
    wx.showLoading()
    var app = getApp()
    var niackName = app.globalData.userInfo.nickName.length > 10 ? app.globalData.userInfo.nickName.slice(0, 10) + '...' : app.globalData.userInfo.nickName
    var activityName = activityInfo.activityName.length > 20 ? activityInfo.activityName.slice(0, 20) + '...' : activityInfo.activityName
    ctx.clearRect(0, 0, 750, 750)
    ctx.setFillStyle('#FFE329')
    ctx.fillRect(0, 0, 750, 592)
    ctx.setFillStyle('#FFFFFF')
    ctx.fillRect(0, 592, 750, 750)
    ctx.setTextAlign('left')
    ctx.setTextBaseline('top')
    ctx.setFontSize(36)
    ctx.setStrokeStyle('#240101')
    ctx.setFillStyle('#240101')
    ctx.fillText(niackName, 28, 36)
    ctx.strokeText(niackName, 28, 36)
    ctx.setFontSize(30)
    ctx.fillText('邀你查看相册', 36 * (niackName.length || 0) + 44, 38)
    var logo = await getImageInfo('https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/8323346e0cf348878ec7e6665f28b28d.png')
    ctx.drawImage(logo.path, 556, 36, 164, 36)
    var banner = await getImageInfo(activityInfo.bannerImg.replace('http://', 'https://'))
    ctx.drawImage(banner.path, 0, 104, 750, 374)
    ctx.setFontSize(40)
    ctx.fillText(activityName, 28, 526)
    ctx.strokeText(activityName, 28, 526)
    ctx.setFontSize(28)
    ctx.fillText('长按或扫描识别二维码', 28, 626)
    ctx.fillText('查看相册内照片', 28, 672)
    var qrcode = await getImageInfo(activityInfo.qrcodeImg)
    ctx.drawImage(qrcode.path, 602, 604, 132, 132)
    wx.hideLoading()
    ctx.draw(true, () => {
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: canvasId,
            fileType: 'png',
            success: (result) => {
                // downloadImage(result.tempFilePath)
                wx.saveImageToPhotosAlbum({
                    filePath: result.tempFilePath,
                    success: (result) => {
                        wx.showToast({
                            title: '保存成功',
                            icon: 'none'
                        });
                    }
                })
            }
        }, this)
    })
}

var getImageInfo = function (url) {
    return new Promise((resolve, reject) => {
        wx.getImageInfo({
            src: url,
            success: (result) => {
                resolve(result)
            }
        });
    })
}

var isEmpty = function (arr) {
    return !(Boolean(arr) && Boolean(arr.length))
}

/**
 * query 转换为json对象
 * @param {*}   
 * @param {*} isQM query 中是否有问号 默认没有
 */
var queryObject = function (query, isQM = false) {
    if (typeof query !== "undefined") {
        if (isQM) query = query.substr(1);
        var arr = query.split("&"),
            obj = {},
            newarr = [];
        arr.map((v) => {
            newarr = v.split("=");
            if (typeof obj[newarr[0]] === "undefined") {
                obj[newarr[0]] = newarr[1];
            }
        })
        return obj;
    };
    return {}
}

var parseQueryString = function (str) {
    console.log(str);
    var arr = [],
        length = 0,
        res = {};
    arr = str.split('&');
    length = arr.length;
    for (var i = 0; i < length; i++) {
        res[arr[i].split('=')[0]] = arr[i].split('=')[1];
    }
    return res;
}

function js_date_time(unixtime) {
    var date = new Date(unixtime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '/' + m + '/' + d + ' ' + h + ':' + minute + ':' + second; //年月日时分秒
    // return y + '-' + m + '-' + d + ' ' + h + ':' + minute;

}
function sharePyq () {
    wx.showShareMenu({
        menus: ['shareAppMessage', 'shareTimeline'],
        success(res) {
          console.log(res)
        },
        fail(e) {
          console.log(e)
        }
      })
}
// 格式（1為年-月-日 時-分-秒，2為年-月-日）
function toDate(number, type) {
    var date = new Date(number);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    if (type == '1') {
      return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
    } else if (type == '2') {
      return Y + '-' + M + '-' + D;
    }
  }
  
//取倒计时（天时分秒）
function getTimeLeft(datetimeTo, time) {
    // 计算目标与现在时间差（毫秒）
    let time1 = new Date(datetimeTo).getTime();
    let time2 = new Date(time).getTime();
    let mss = time1 - time2;
    // 将时间差（毫秒）格式为：天时分秒
    let days = parseInt(mss / (1000 * 60 * 60 * 24));
    let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = parseInt((mss % (1000 * 60)) / 1000);
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    if (hours < 10) {
        hours = `0${hours}`
    }
    if (days < 10) {
        days = `0${days}`
    }
    return {
        text: days + "天" + hours + "时" + minutes + "分" + seconds + "秒",
        day: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    }
}

// 节流函数
const delay = (function () {
    let timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

module.exports = {
    formatTime: formatTime,
    formatTime1: formatTime1,
    getTimeLeft: getTimeLeft,
    js_date_time: js_date_time,
    toDate: toDate,
    sharePyq,
    isLogin,
    btoa,
    safeBtoa,
    isExpired,
    getAstro,
    isRegistered,
    isJSON,
    compareVersion,
    downloadImage,
    codeToRegion,
    regionToCode,
    codeToAddress,
    isPhone,
    getLocaltion,
    generateCover,
    getCoordinate,
    isEmpty,
    queryObject,
    getLocaltionByCoordinate,
    parseQueryString,
    delay
}