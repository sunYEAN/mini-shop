//index.js
//获取应用实例
const app = getApp()
import {getHomeData} from '../../services/home.js'
import Methods from '../../methods.js';

Page({
  data: {
    count: 0,
    banner: [],
    channel: [],
  },
  initialData () {
    console.log(app.globalData.goodsCount)
    getHomeData().then(res => {
      if (res.errno === 0) {
        this.setData({
          count: app.globalData.goodsCount,
          ...res.data
        })
      }
    })
  },

  onLoad (e) {
    this.initialData();
  }
})
