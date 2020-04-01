//index.js
//获取应用实例
const app = getApp();
import { createPage } from "../../compiler/createPage.js"
import {getHomeData} from '../../services/home.js'
import Methods from '../../methods.js';
import {useStore} from '../../compiler/useStore.js';

createPage(
  useStore('Home', (state) => {
    count: state.count
  }),
  {
    data: {
      count: 0,
      banner: [],
      channel: [],
    },
    initialData () {
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
  }
);
