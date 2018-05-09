var app = getApp()    // 引入全局变量
var getstars = require('../../../utils/util.js') // 引入util.js模块
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
    var movieId = options.id
    // var movieDetailUrl = app.globalData.g_getMovieUrl + '/subject2/' + movieId
    var movieDetailUrl = app.globalData.g_getMovieUrl + '/v2/movie/subject/' + movieId
    this.getMovieDetail(movieDetailUrl)
  },

  onShow () {},

  getMovieDetail (url) {
    wx.showLoading({ title: '正在拼命加载' })
    var that = this
    wx.request({  // 网络请求
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

  // 当请求成功执行的回调
  successCallback (data) {
    wx.hideLoading()
    console.log(data)
    let movieDetailData = {}
    let casts = []
    let countries = []
    let directors = []
    let movieType = []
    // 影人
    for (let i = 0; i < data.casts.length; i++) {
      casts.push(data.casts[i].name + ' ')
      data.casts[i].images = data.casts[i].avatars
      data.casts[i].title = data.casts[i].name
    }
    // 上映国家
    for (let i = 0; i < data.countries.length; i++) {
      countries.push(data.countries[i])
    }
    // 导演
    for (let i = 0; i < data.directors.length; i++) {
      directors.push(data.directors[i].name)
    }
    // 类型
    for (let i = 0; i < data.genres.length; i++) {
      movieType.push(data.genres[i])
    }
    // 星星
    let stars = data.rating.stars
    data.rating.aStars = getstars.toStarsArray(stars) // 返回一个数组 eg.三颗星[1, 1, 1, 0, 0]
    this.setData ({
      movieDetailData: data,
      item: data,
      casts: casts,
      countries: countries,
      directors: directors,
      movieType: movieType
    })
  },
  /**
   * 模板中的跳转事件
   */
  onMovieDetailTap () {
    return
  }
})