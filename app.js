//app.js
import {getGoodsCount} from './services/common.js'
import './compiler/store.js';

App({
    onLaunch: async function () {
        const res = await getGoodsCount();
        this.globalData.goodsCount = res.data.goodsCount;

        // 初始化store 将localStorage的数据读取出来
    },
    globalData: {
        goodsCount: 0,
        userInfo: null,
    }
})
