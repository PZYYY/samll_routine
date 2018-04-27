var app = getApp()    // 引入全局变量
var getstars = require('../../../utils/util.js') // 引入util.js模块

Page({
  data:{
    dataURL: {},
    typeName: '',
    aMovieList: [],
    totalMovies: [],
    startIndex: 0,
    isEmpty: true,
    isreq: false,
    scrollHeight: 0
  },

  onLoad (options) {
    this.setData({
      typeName: options.typeid
    })
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        wx.setStorage({
          key: 'windowHeight',
          data: res.windowHeight
        })
      }
    })
  },

  onReady () {
    wx.setNavigationBarTitle({  // 设置头部标题，只能写在onReady函数内
      title: this.data.typeName
    })
  },

  onShow () {
    switch (this.data.typeName) {
      case '正在热映':
        // this.data.dataURL = app.globalData.g_getMovieUrl + '/v2/movie/in_theaters'
        this.data.dataURL = app.globalData.g_getMovieUrl + '/in_theaters'
        break
      case '即将上映':
        // this.data.dataURL = app.globalData.g_getMovieUrl + '/v2/movie/coming_soon'
        this.data.dataURL = app.globalData.g_getMovieUrl + '/coming_soon'
        break
      case '豆瓣TOP250':
        // this.data.dataURL = app.globalData.g_getMovieUrl + '/v2/movie/top250'
        this.data.dataURL = app.globalData.g_getMovieUrl + '/top250'
        break
    }
    this.getMovieListData(this.data.dataURL)
  },

  // 获取电影数据
  getMovieListData(url) {
    var that = this
    wx.request({  // 请求网络数据
      url: url,
      header: {
        'Content-Type': 'application/xml'  // 不可以使用application/json，否则会报未知错误
      },
      success(res) {
        that.successCallback(res.data)
      },
      fail(error) {
        console.log(error)
      }
    })
  },

  // 当请求成功时执行的回调函数
  successCallback(response) {
    // console.log('response', response.subjects)
    if (response.subjects.length == 0) {  // 当没有数据以后将不再请求
      this.setData({isreq: true})
      return
    } else {
      // this.data.isEmpty = false
      wx.showLoading({
        title: '正在拼命加载'
      })
      response.subjects.forEach((item, index) => { // 一次返回20条数据
        if (item.title.length > 6) {
          item.title = item.title.substr(0, 6) + '...'
        }
        let stars = item.rating.stars // 星星
        item.rating.aStars = getstars.toStarsArray(stars)
        this.data.aMovieList.push(item)
      })
      console.log('aMovieList', this.data.aMovieList)
      this.data.isreq = false
      this.data.startIndex += 20 // 滚动到底部累加 
      this.setData({
        totalMovies: this.data.aMovieList
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }
  },

  // 滚动到底部加载更多
  onReachBottom () {
    if (this.data.isreq) return
    var moreDataUrl = this.data.dataURL + '?start=' + this.data.startIndex + '&count=20'
    this.getMovieListData(moreDataUrl)
  },

  // 下拉刷新 （重新加载数据）
  onPullDownRefresh () {
    var refreshMovies = this.data.dataURL + '?start=0&count=20'
    this.getMovieListData(refreshMovies)
    this.data.aMovieList = []
    // this.data.isEmpty = true
  },

  // 点击跳转电影详情页
  onMovieDetailTap(event) {
    let movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: `../movie-detail/movie-detail?id=${movieId}`
    })
  }
})