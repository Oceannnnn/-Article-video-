const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//request请求
const http = (url, data = {}, method = 'get') => {
  var u = "https://video.fqwlkj.cn/api.php/api/" + url;
  return new Promise(function (resolve, reject) {
    wx.request({
      url: u,
      data: data,
      method: method ? method : 'get',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        resolve(res.data)
      },
      fail: (res) => {
        reject(res.data)
      }
    })
  })
} 

module.exports = {
  formatTime: formatTime,
  http: http
}
