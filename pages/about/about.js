const app = getApp()
Page({
  data: {},
  onLoad: function () {
    this.setData({
      name: app.s_globalData.s_info,
      phone: app.s_globalData.s_phone,
      address: app.s_globalData.s_address,
      latitude: app.s_globalData.s_latitude,
      longitude: app.s_globalData.s_longitude,
      logo: app.s_globalData.s_logo,
      domain: app.s_globalData.s_domain
    })
  },
  toCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  toPosition: function () {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      name: this.data.address,
      scale: 15
    })
  }
})