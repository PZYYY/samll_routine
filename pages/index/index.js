//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  startBtn () {
    wx.navigateTo({
      url: '../list/list'
    })
  }
})
