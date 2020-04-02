// pages/cate/index.js
import {getCatalogList, getCatalogCurrent} from "../../services/cate.js"
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
    cates: {},
    cateList: [],
    triggered: false,
    currentCateId: null,
  },

  /**
   * initial data
   */
  initialData () {
    getCatalogList().then(res => {
      if (res.errno === 0) {
        const { categoryList, currentCategory} = res.data;
        const cates = Object.assign({}, this.data.cates);
        cates[currentCategory.id] = currentCategory;
        this.setData({
          count: app.globalData.goodsCount,
          cates: cates,
          cateList: categoryList,
          currentCateId: currentCategory.id,
        })
      }
    })
  },

  /**
   * method 改变当前的分类
   */
  async changeNav (cate) {
    const { cates, cateList} = this.data; 

    const index = cateList.findIndex(item => item.id === cate.id);
    this.__prevCate = index > 1 ? cateList[index - 1] : cateList[0];

    this.setData({
      currentCateId: cate.id
    });

    if (cates[cate.id]) return;
    // // 请求选中分类的数据列表

    return getCatalogCurrent({ id: cate.id}).then(res => {
      if (res.errno === 0) {
        this.setData({
          cates: {
            ...cates,
            [cate.id]: res.data.currentCategory
          }
        })
      }
    });
  },

  /**
   * event (nav click)
   */
  hanleNavTap (e) {
    const {dataset:{cate}} = e.target;
    this.changeNav(cate);
  },

  /**
   * event (pulling)
   */
  handlePulling (e) {
    // console.log(e, 'pulling');
  },

  /**
   * event refresh
   */
  async handleRefresh (e) {
    this.setData({
      triggered: true
    });

    // 判断是否
    if (this.__prevCate.id && this.__prevCate.id !== this.currentCateId) {
      await this.changeNav(this.__prevCate);
      setTimeout(() => {
        this.setData({
          triggered: false,
        });
      }, 500);
    } else {
      this.setData({
        triggered: false,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initialData();
    this.__prevCate = {};
  },
})