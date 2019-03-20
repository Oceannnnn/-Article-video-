//app.js
App({
  onLaunch: function() {
    wx.login({
      success: res => {
        var code = res.code;
        this.s_globalData.code = code;
        wx.setStorage({
          key: "code",
          data: code
        })
      }
    });
    if (wx.getStorageSync('httpClient')) {
      this.s_globalData.state = wx.getStorageSync('httpClient').state
      this.s_globalData.s_user_id = wx.getStorageSync('httpClient').user_id
    }
  },
  s_globalData: {
    s_userInfo: null,
    code: '',
    encryptedData: '',
    iv: '',
    state: 0, //0为未登录，1为登录
    s_user_id: ''
  },
})