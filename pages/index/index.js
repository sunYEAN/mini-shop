//index.js
//获取应用实例
const app = getApp();
import Methods from '../../methods.js';
import { createPage } from "../../compiler/createPage.js"
import { useStore } from '../../compiler/useStore.js';
import { getHomeData } from '../../services/home.js';

createPage(
  useStore('Home', (state) => ({
    number: state.number
  })),
  useStore('Home', (state) => ({
    num: state.num
  })),
  {
    data: {
      count: 0,
      banner: [],
      channel: [],
      topicList: [],
      brandList: [],
      categoryList: [],
      newGoodsList: [],
      hotGoodsList: []
    },

    onLoad (e) {
      getHomeData().then(res => {
        this.setData({
          ...res.data
        })
      });
    }
  }
);
