// pages/article/article.js
const util = require('../../utils/util.js')
const main = require('../../public/main.js')
const app = getApp()
Page({
  data: {
    articleList:[]
  },
  onLoad: function (options) {
    this.articleList(1)
  },
  toArticleList(e){
    main.toDetails(e,"details")
  },
  articleList(page_number) {
    wx.showLoading({
      title: '加载中'
    });
    var list = this.data.articleList;
    util.http('blog/index ', { page_size: 10, page_current: page_number}, 'post').then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          articleList: list
        })
      } else {
        wx.showToast({
          title: '没有数据啦！',
          icon: 'none',
          duration: 1000
        })
        this.data.onBottom = false;
      }
      wx.hideLoading()
    })
  }
})