// pages/video/video.js
const util = require('../../utils/util.js');
const main = require('../../public/main.js');
const app = getApp();
Page({
  data: {
    currentId: 1,
    videoHeaderList: [],
    videoList: [],
    pageNumber: 1,
    hidden: "hidden"
  },
  onLoad: function (options) {
    this.videoHeaderList()
  },
  toVideoList(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      currentId: id,
      videoList:[]
    })
    this.videoList(id, 1)
  },
  toListDetails(e, url) {
    main.toDetails(e, "videoList")
  },
  videoHeaderList() {
    util.http('Category/index', {}, 'post').then(res => {
      if(res.code==200){
        this.setData({
          videoHeaderList:res.data,
          currentId: res.data[0].id
        })
        this.videoList(this.data.currentId)
      }else{
        wx.showToast({
          title: '获取失败！',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  videoList(id) {
    var list = this.data.videoList;
    util.http('Category/getChildList', {id: id}, 'post').then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          videoList: list,
          hidden: ""
        })
      } else {
        wx.showToast({
          title: '暂无数据！',
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
})