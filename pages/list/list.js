// 引入模拟数据
var localDatas = require('../../data/local-data.js')  // 只能使用相对路径

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示   onShow每次页面加载都会执行
   */
  onShow: function () {
    for (var i = 0; i < localDatas.localData.length; i++) {
      if (localDatas.localData[i].text.length > 60) {
        var stringCut = localDatas.localData[i].text.substr(0, 60)
        localDatas.localData[i].textShort = stringCut + '...'
      }
    }
    // setData多用于点击后改变页面信息或者刷新后与后台交互获取最新的信息
     this.setData({
       dataList: localDatas.localData
     })
  },

    // 跳转到详情页
  itemDetail (event) {
    var listId = event.currentTarget.dataset.listid; // 每个模板的id
    wx.navigateTo({
      url: 'list-detail/list-detail?id=' + listId,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})