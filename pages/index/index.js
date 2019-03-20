//index.js
const util = require('../../utils/util.js');
const main = require('../../public/main.js');
const app = getApp();
Page({
  data: {
    pageNumber: 1,
    onBottom: true,
    recommendList: [],
    user_id: ''
  },
  onLoad: function(options) {
    this.init()
  },
  init(){
    let user_id = app.s_globalData.s_user_id;
    this.setData({
      user_id: user_id, // 你这里不应该用app里面的s_user_id, 因为重新编译app.s_globalData会被重置，应该用缓存里的
      recommendList: [],
      state: app.s_globalData.state
    })
    this.recommendList(1, user_id);
  },
  onReachBottom: function() {
    var pageNumber = this.data.pageNumber + 1;
    this.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      this.recommendList(this.data.pageNumber, this.data.user_id);
    }
  },
  zan(e) {
    if (app.s_globalData.state == 1) {
      var id = e.currentTarget.dataset.id;
      var like = e.currentTarget.dataset.like;
      util.http('movie/likeMovie', {
        user_id: this.data.user_id,
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
  videoPlay(e, url) {
    main.toDetails(e, "details");
  },
  onItemShareTap: function(e) {
    let state = app.s_globalData.state;
    if (!state) {
      main.goLogin();
      return false;
    }
  },
  /**
   * SB 腾讯
   */
  onShareAppMessage(ops) {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    // shareObj 赋值函数 start
    var shareObj = {
      title: ops.from === 'button' ? ops.target.dataset.title : main.titleMath(),
      path: ops.from === 'button' ? "/pages/details/details?id=" + ops.target.dataset.id + "&type=2" : "/" + currentPage.route
    }
    if (ops.from === 'button') {
      var id = ops.target.dataset.id;
      var zhuan = ops.target.dataset.zhuan;
      util.http('movie/zhuanMovie', {
        user_id: this.data.user_id,
        zhuan_id: id,
        type: 2
      }, 'post').then(res => {
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
    // shareObj 赋值函数 end
    // 赋值函数调用   ->   shareObj
    return shareObj
  },
  recommendList(page_number, user_id) {
    wx.showLoading({
      title: '加载中'
    });
    var list = this.data.recommendList;
    util.http('movie/index', {
      page_size: 10,
      page_current: page_number,
      user_id: user_id,
      type: 2
    }, 'post').then(res => {
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
  onReady() {
    this.Info()
  },
  Info(){
    util.http('My/getCompnayConfig', {}, 'get').then(res => {
      if (res.code == 200) {
        app.s_globalData.s_phone = res.data.phone;
        app.s_globalData.s_email = res.data.email;
        app.s_globalData.s_info = res.data.name;
        app.s_globalData.s_address = res.data.address;
        app.s_globalData.s_logo = res.data.image;
        app.s_globalData.s_domain = res.data.domain;
        app.s_globalData.s_latitude = Number(res.data.latitude);
        app.s_globalData.s_longitude = Number(res.data.longitude);
      } 
    })
  },
  onPullDownRefresh() {
    this.init();
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },50)
  }
})