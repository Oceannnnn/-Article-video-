// pages/collect/collect.js
const util = require('../../utils/util.js')
const main = require('../../public/main.js')
const app = getApp()
Page({
  data: {
    pageNumber: 1,
    onwBottom: true,
    onsBottom: true,
    tab: [{ title: '文章' }, { title: '视频' }],
    hoverIndex: 1, 
    videoList:[],
    articleList:[]
  },
  onLoad: function (options) {
    this.List(1, 1)
    this.List(1, 2)
  },
  tabClick: function (e) {
    this.setData({
      hoverIndex: e.target.dataset.num + 1
    })
  },
  toDetails(e) {
    main.toDetails(e, "details")
  },
  onReachBottom: function () {
    var pageNumber = this.data.pageNumber + 1;
    this.setData({
      pageNumber: pageNumber
    })
    if (this.data.onwBottom) {
      this.List(this.data.pageNumber, 1);
    } 
    if (this.data.onsBottom) {
      this.List(this.data.pageNumber, 2);
    }
  },
  List(page, type){
    wx.showLoading({
      title: '加载中'
    });
    var list = [];
    if (type == 1) {//文章
      list = this.data.articleList;
    } else {
      list = this.data.videoList;
    }
    var json = {
      page_size: 10,
      page_current: page,
      user_id: app.s_globalData.s_user_id,
      type: type
    }
    util.http('My/collectList', json, 'post').then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        if (type == 1) {//文章
          this.setData({
            articleList: list
          })
        }else{
          this.setData({
            videoList: list
          })
        }
      } else {
        wx.showToast({
          title: '没有数据啦！',
          icon: 'none',
          duration: 1000
        })
        if (type == 1) {
          this.data.onwBottom = false;
        } else {
          this.data.onsBottom = false;
        }
      }
    })
    wx.hideLoading()
  }
})