// pages/zan/zan.js
Page({
  data: {
    zanList:[]
  },
  onLoad: function (options) {
    this.init();
  },
  init(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; 
    this.setData({
      zanList: prevPage.data.likeduserList
    })
  }
})