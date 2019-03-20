// pages/videoList/videoList.js
const util = require('../../utils/util.js')
const main = require('../../public/main.js')
const app = getApp()
Page({
  data: {
    recommendList: [],
    pageNumber: 1,
    onBottom: true,
  },
  onLoad: function (options) {
    var case_id = options.id;
    this.setData({
      case_id:case_id,
      state:app.s_globalData.state
    })
    this.recommendList(1,case_id)
  },
  onReachBottom: function () {
    var pageNumber = this.data.pageNumber + 1;
    this.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      this.recommendList(this.data.pageNumber, this.data.case_id)
    }
  }, 
  zan(e) {
    if (app.s_globalData.state == 1) {
      var id = e.currentTarget.dataset.id;
      var like = e.currentTarget.dataset.like;
      util.http('movie/likeMovie', {
        user_id: app.s_globalData.s_user_id,
        like_id: id,
        type: 2
      }, 'post').then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 1000
          })
          for (var i = 0; i < this.data.recommendList.length; i++) {
            if (this.data.recommendList[i].id == id) {
              this.setData({
                ['recommendList[' + i + '].is_liked']: true,
                ['recommendList[' + i + '].like']: like + 1
              })
            }
          }
        } else {
          wx.showToast({
            title: '已点过赞',
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      main.goLogin();
    }
  },
  recommendList(page_number,cate_id) {
    wx.showLoading({
      title: '加载中'
    });
    var list = this.data.recommendList;
    var json = {
      page_size: 10,
      page_current: page_number,
      user_id: app.s_globalData.s_user_id,
      cate_id: cate_id
    }
    util.http('movie/getCateList', json , 'post').then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          recommendList: list
        })
      } else {
        wx.showToast({
          title: '没有数据啦！',
          icon: 'none',
          duration: 1000
        })
        this.data.onBottom = false;
      }
    })
    wx.hideLoading()
  },
  videoPlay(e, url) {
    main.toDetails(e, "details")
  },
  onShareAppMessage(ops) {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var shareObj = {
      title: ops.from === 'button' ? ops.target.dataset.title : main.titleMath(),
      path: ops.from === 'button' ? "/pages/details/details?id=" + ops.target.dataset.id + "&type=2" : "/" + currentPage.route
    }
    if (ops.from === 'button') {
      var id = ops.target.dataset.id;
      var zhuan = ops.target.dataset.zhuan;
      util.http('movie/zhuanMovie', { user_id: app.s_globalData.s_user_id, zhuan_id: id, type: 2 }, 'post').then(res => {
        if (res.code == 200) {
          for (var i = 0; i < this.data.recommendList.length; i++) {
            if (this.data.recommendList[i].id == id) {
              this.setData({
                ['recommendList[' + i + '].zhuan']: zhuan + 1
              })
            }
          }
        }
      })
    }
    return shareObj
  },
  onItemShareTap: function (e) {
    let state = this.data.state;
    if (!state) {
      main.goLogin();
      return false;
    }
  }
})