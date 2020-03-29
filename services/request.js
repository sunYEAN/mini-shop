var api = require('./api.js')
/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Nideshop-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(`${url} - ${JSON.stringify(data)} - success`);
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

request.get = function (url, data = {}) {
  return request(url, data, 'GET')
}

request.post = function (url, data = {}) {
  return request(url, data, 'POST')
}

export default request;