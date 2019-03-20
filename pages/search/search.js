// pages/search/search.js
const util = require('../../utils/util.js')
const main = require('../../public/main.js')
const app = getApp()
Page({
  data: {
    searchValue:'',
    histroyList:[],
    searchList: [],
    recommendList: [],
    pageNumber: 1,
    onBottom: true,
  },
  onLoad: function (options) {
    this.init()
  },
  searchList(e) {
    main.toDetails(e, "details");
  },
  searchValue(e) {
    let value = e.detail.value;
    this.setData({
      searchValue: value
    })
    if (value == '') {
      this.setData({
        recommendList: []
      })
    }
  },
  s_search(){
    var value = this.data.searchValue.replace(/(^\s*)|(\s*$)/g, '');
    if (value == "") {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1000
      })
      this.setData({
        searchValue: ''
      })
    }else{
      this.setData({
        recommendList:[]
      })
      this.data.onBottom = true;
      this.recommendList(1)
    }
  },
  onReachBottom: function () {
    var pageNumber = this.data.pageNumber + 1;
    this.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      this.recommendList(this.data.pageNumber);
    }
  },
  recommendList(page_current) {
    wx.showLoading({
      title: '加载中'
    });
    var list = this.data.recommendList;
    var json = {
      user_id: app.s_globalData.s_user_id,
      search_word: this.data.searchValue,
      page_size: 10,
      page_current: page_current
    }
    util.http('Movie/search', json, 'post').then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          recommendList: list
        })
      } else {
        wx.showToast({
          title: '暂无数据',
          icon: 'none',
          duration: 1000
        })
        this.data.onBottom = false;
      }
    })
    wx.hideLoading()
  },
  searchHistroy(e) {
    this.setData({
      recommendList: [],
      searchValue:e.target.dataset.word
    })
    this.recommendList(1)
  },
  deleteHistroy(){
    util.http('movie/delHistory', { user_id: app.s_globalData.s_user_id }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          histroyList: []
        })
      }
    })
  },
  histroyList() {
    util.http('movie/history', { user_id: app.s_globalData.s_user_id}, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          histroyList: res.data
        })
      }
    })
  },
  init(){
    this.histroyList();
    util.http('movie/index', {
      page_size: 10,
      page_current: 1,
      user_id: app.s_globalData.s_user_id,
      type: 2
    }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          searchList: res.data
        })
      }
    })
  }
})