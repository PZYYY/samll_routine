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
  successCallback(data) {
    if (!data.subjects.length) {  // 当没有数据以后将不再请求
      this.setData({isreq: true})
      return
    }
    wx.showLoading({
      title: '正在加载，请稍候...'
    })
    var totalMovies = []
    // var aMovieList = []
    for (var idx in data.subjects) {
      var doubanData = data.subjects[idx]  // 取data数组中具体的每一个数据，遍历
      if (doubanData.title.length > 6) {
        doubanData.title = doubanData.title.substr(0, 6) + '...'
      }
      var stars = doubanData.rating.stars // 星星
      doubanData.rating.aStars = getstars.toStarsArray(stars)
      this.data.aMovieList.push(doubanData)
    }
    console.log('aMovieList', this.data.aMovieList)
    if (!this.data.isEmpty) {
      totalMovies = this.data.totalMovies.concat(this.data.aMovieList) // 数组元素累加，返回一个新数组
    }else{
      this.data.totalMovies = this.data.aMovieList
      totalMovies = this.data.totalMovies
      this.data.isEmpty = false
    }
    this.data.startIndex += 20    // 滚动到底部累加 
    this.setData({totalMovies})
      wx.hideLoading()
      wx.stopPullDownRefresh()
  },

  // 滚动到底部加载更多
  onReachBottom () {
    if (this.data.isreq) return
    var moreData = this.data.dataURL + '?start=' + this.data.startIndex + '&count=20'
    this.getMovieListData(moreData)
  },

  // 下拉刷新 （重新加载数据）
  onPullDownRefresh () {
    var refreshMovies = this.data.dataURL + '?start=0&count=20'
    this.getMovieListData(refreshMovies)
    this.data.aMovieList = []
    this.data.isEmpty = true
  },
  /**
  * 跳转到电影详情
  */
  onMovieDetailTap(event) {
    let movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: `movie-detail/movie-detail?id=${movieId}`
    })
  }
})