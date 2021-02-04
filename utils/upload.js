
const baseUrl = 'https://image.hucai.com'

function upload(url, filePath, name, data) {
    let promise = new Promise(function (resolve, reject) {
        wx.uploadFile({
            url: baseUrl+url,
            filePath: filePath,
            name: name,
            formData: {
                ...data
            },
            success: function (res) {
                resolve(res);
            },
            fail: reject,
            complete: function () { }
        });
    });
    return promise;
}

module.exports = {
    upload: function (url, filePath, name, data) {
        return upload(url, filePath, name, data);
    }
}