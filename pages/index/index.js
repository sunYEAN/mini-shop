//index.js
//获取应用实例
const app = getApp()

import {getHomeData} from '../../services/home.js'

Page({
  data: {
    banner: [],
    channel: [],
  },
  onLoad (e) {
    getHomeData().then(res => {
      if (res.errno === 0) {
        this.setData({
          ...res.data
        })
      }
      console.log(this.data)
    })
  }
})
