var listDatas = require('../../../data/local-data.js')  // 导入local-data.js中的数据
var app = getApp()  // 导入全局app.js中的数据
Page({

  data: {
    listId: null,
    bIsPlaying: false,  // 音乐是否播放
    animationData: {},  //定义动画效果
  },

  onLoad: function (options) {  // options是页面跳转时传的参数
     this.setData({
       listId: options.id
     })
     this.watchMusicPlay()
  },

// 监听总键的音乐播放
  watchMusicPlay () {
    var that = this
    // 监听音乐播放
    wx.onBackgroundAudioPlay(() => {
      that.setData({
        bIsPlaying: true
      })
      app.globalData.g_isPlaying = true
    })

    // 监听音乐暂停
    wx.onBackgroundAudioPause(() => {
      that.setData({
        bIsPlaying: false
      })
      app.globalData.g_isPlaying = false
    })

    // 监听音乐停止
    wx.onBackgroundAudioStop(() => {
      that.setData({
        bIsPlaying: false
      })
      app.globalData.g_isPlaying = false
    })
  },

  // 假设缓存中的数据格式
  // var textCollect = {
  //   1: true,
  //   2: false,
  //   3: true,
  //   ...
  // }
  
  onShow: function () {
      var oIsCollected = wx.getStorageSync('textCollect')   // 取到所有缓存
      if (oIsCollected) {   // 当已经有缓存
        var collectState = oIsCollected[this.data.listId]   // 当前文章的缓存状态
      }else {   // 当没有缓存时
        var oIsCollected = {}   // 所有缓存为空
        oIsCollected[this.data.listId] = false  // 当前文章的缓存状态
        wx.setStorageSync('textCollect', oIsCollected)   // 设置缓存
      }

      // 判断全局中音乐是否是播放状态从而改变图片
      if (app.globalData.g_isPlaying) {
        this.setData({
          bIsPlaying: true
        })
      }

      this.setData({
        listDetail: listDatas.localData[this.data.listId],
        collectState: collectState
      })
      console.log(oIsCollected)
  },

  // 点击收藏
   collectText (event) {
     var collectsState = wx.getStorageSync('textCollect')
     var collectState = collectsState[this.data.listId]   // 当前文章的收藏状态
     collectState = !collectState   // 取反
     collectsState[this.data.listId] = collectState
     wx.setStorageSync('textCollect', collectsState)
     this.setData({
       collectState: collectState
     })

     // 弹窗提示
     wx.showToast({
       title: collectState?'收藏成功':'取消成功'
     })
   },

   // 点击分享
    shareText (event) {
      wx.showActionSheet({
        itemList: ['分享到微信', '分享到朋友圈','分享到QQ','分享到微博'],
        itemColor: '#003853',
        success (res) {
          console.log(res.tapIndex)
        }
      })
    },

    // 音乐播放
    onMusicTap (event) {
      var playState = this.data.bIsPlaying  // 音乐播放状态
      if (playState) {
        wx.pauseBackgroundAudio()  // 音乐暂停
        playState = false
      }else { // 音乐暂停状态
        wx.playBackgroundAudio({  // 点击播放
          dataUrl: listDatas.localData[this.data.listId].music.url,
          title: listDatas.localData[this.data.listId].music.tittle
        })
        playState = true

      // 音乐播放按钮旋转
      //   var animation = wx.createAnimation({})
      //   this.data.animationData = animation
      //   animation.rotate(180)
      }
      this.setData ({
        bIsPlaying: playState
        // animationData: this.data.animationData.export()  // 导出音乐播放动画
      })
    }
})