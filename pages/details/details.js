// pages/articleDetails/articleDetails.js
const util = require('../../utils/util.js')
const main = require('../../public/main.js')
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({
  data: {
    isVideo:true,
    pinList: [],
    zanList:[],
    hidden: "hidden"
  },
  onLoad: function (options) {
    var id = options.id;
    var url = '';
    var type = '';
    this.setData({
      id:id,
      type:type,
      state:app.s_globalData.state
    })
    if (options.type == 1) {//文章
      url = 'blog/detail';
      this.setData({
        isVideo:false,
        type:1
      })
    } else if (options.type == 2){//视频
      url = 'movie/detail';
      this.setData({
        isVideo: true,
        type: 2
      })
    }
    this.init(id, url, options.type);
  },
  onShareAppMessage(ops) {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var type = this.data.type;
    var shareObj = {
      title: ops.from === 'button' ? ops.target.dataset.title : main.titleMath(),
      path: ops.from === 'button' ? "/pages/details/details?id=" + ops.target.dataset.id + "&type=" + type + "&type=" + type : "/" + currentPage.route
    }
    if (ops.from === 'button') {
      var id = ops.target.dataset.id;
      var zhuan = ops.target.dataset.zhuan;
      util.http('Blog/zhuanBlog', { user_id: app.s_globalData.s_user_id, zhuan_id: id, type: type }, 'post').then(res => {
        if (res.code == 200) {
          this.setData({
            zhuan: zhuan + 1
          })
        }
      })
    }
    return shareObj
  },
  comment(){
    wx.navigateTo({
      url: '../comment/comment?id=' + this.data.id + '&type=' + this.data.type
    })
  },
  zan(e) {
    if (app.s_globalData.state == 1) {
      var type = this.data.type;
      var id = e.currentTarget.dataset.id;
      var like = e.currentTarget.dataset.like; 
      var list = this.data.zanList;
      var url = type == 1 ? "Blog/likeBlog" : "movie/likeMovie";
      util.http(url, { user_id: app.s_globalData.s_user_id, like_id: id, type: type}, 'post').then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 1000
          })
          list.unshift(res.data);
          this.setData({
            like: like + 1,
            is_liked: true,
            zanList: list
          })
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
  collect(e) {
    if (app.s_globalData.state == 1) {
      var type = this.data.type;
      var id = e.currentTarget.dataset.id;
      var url = type == 1 ? "Movie/collectMovie" :"Blog/collectBlog";
      util.http(url, { user_id: app.s_globalData.s_user_id, collect_id: id, type: type }, 'post').then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 1000
          })
          this.setData({
            is_collectd: true
          })
        } else {
          wx.showToast({
            title: '已取消收藏',
            icon: 'none',
            duration: 1000
          })
          this.setData({
            is_collectd: false
          })
        }
      })
    } else {
      main.goLogin();
    }
  },
  init(id, url,type){
    util.http(url, { user_id: app.s_globalData.s_user_id, id: id, type: type}, 'post').then(res => {
      if(res.code==200){
        var data = res.data;
        this.setData({
          comment: data.comment,
          collect: data.collect,
          is_liked: data.is_liked,
          is_collectd: data.is_collectd,
          like: data.like,
          zhuan: data.zhuan,
          image: data.image,
          read: data.read,
          zanList: data.likeduser,
          likeduserList: data.likeduser,
          id: data.id,
          hidden:""
        })
        var likeList = data.likeduser;
        if (likeList.length >= 16){
          for (var i = 16; i > likeList.length; i--) {
            likeList.push(likeList[i])
          }
          this.setData({
            zanlist: likeList
          })
        }
        if(type==1){
          this.setData({
            title: data.title,
            create_time: data.create_time
          })
        }else{
          let src = '';
          if (data.outside_src){
            src = data.outside_src
          }else{
            src = data.src
          }
          this.setData({
            name: data.name,
            length: data.length,
            src: src
          })
        }
        WxParse.wxParse('details', 'html', data.content, this, 0)
      }
    })
    this.pinList(id, type);
  },
  onItemShareTap () {
    let state = app.s_globalData.state;
    if (!state) {
      main.goLogin();
      return false;
    }
  },
  pinList(mb_id, type){
    util.http("Comment/index", { page_size: 5, page_current: 1, mb_id: mb_id, type: type}, 'post').then(res => {
      if(res.code == 200){
        this.setData({
          pinList:res.data
        })
      }else{
        this.setData({
          pinList: []
        })
      }
    })
  },
  toZanList(e){
    wx.navigateTo({
      url: '../zan/zan'
    })
  }
})