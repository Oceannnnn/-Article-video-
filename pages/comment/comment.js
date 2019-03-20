// pages/comment/comment.js
const util = require('../../utils/util.js')
const main = require('../../public/main.js');
const app = getApp()
Page({
  data: {
    commentList: [],
    pageNumber: 1,
    onBottom: true,
    disabled:false
  },
  onLoad: function (options) {
    var id = options.id;
    var type = options.type;
    this.setData({
      id:id,
      type:type
    })
    this.commentList(1, id, type)
  },
  commentValue(e) {
    let value = e.detail.value.replace(/(^\s*)|(\s*$)/g, '');
    this.setData({
      commentValue: value
    })
  },
  s_comment() {
    this.setData({
      disabled:true
    })
    if (app.s_globalData.state == 1) {
      if (this.data.commentValue == "" || this.data.commentValue == undefined) {
        wx.showToast({
          title: '评论不能为空！',
          icon: 'none',
          duration: 1000
        })
        this.setData({
          disabled: false
        })
        return
      }else{
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        var json = {
          user_id: app.s_globalData.s_user_id,
          content: this.data.commentValue,
          mb_id: this.data.id,
          type: this.data.type
        }
        var list = this.data.commentList;
        var pinList = prevPage.data.pinList;
        util.http("Comment/userComment", json, 'post').then(res => {
          if (res.code == 200) {
            if (pinList.length >= 5) {
              pinList.pop();
            }
            pinList.unshift(res.data);
            prevPage.setData({
              comment: prevPage.data.comment + 1,
              pinList: pinList
            })
            list.unshift(res.data);
            this.setData({
              commentValue: '',
              commentList: list,
              disabled: false
            })
          }
        })
      }
    } else {
      main.goLogin();
    }
  },
  onReachBottom: function () {
    var pageNumber = this.data.pageNumber + 1;
    this.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      this.commentList(this.data.pageNumber, this.data.id, this.data.type);
    }
  },
  commentList(page, id, type) {
    wx.showLoading({
      title: '加载中'
    });
    var list = this.data.commentList;
    util.http("Comment/index", { page_size: 10, page_current: page, mb_id: id, type: type }, 'post').then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          commentList: list
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