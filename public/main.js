const toDetails = (e, url) => {
  var id = e.currentTarget.dataset.id;
  var type = e.currentTarget.dataset.type;
  wx.navigateTo({
    url: '../' + url + '/' + url + '?id=' + id + '&type=' + type
  })
}
const goLogin = () => {
  wx.showModal({
    title: '提示', 
    confirmText: '去登录',
    content: '请先前往个人中心登录',
    success: function(res) {
      if (res.confirm) {
        wx.switchTab({
          url: '../my/my'
        })
      }
    }
  })
}

const titleMath = () =>{
  var title = ['哇！神秘科学简单化，带您玩转科学','实践出真知，和孩子一起做实验吧'];
  return title[Math.floor(Math.random() * title.length)]
}


module.exports = {
  toDetails: toDetails,
  goLogin: goLogin,
  titleMath: titleMath
}