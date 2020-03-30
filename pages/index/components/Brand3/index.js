// pages/index/components/Brand3/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    brand: {
      type: Array,
      default: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItem (e, item) {
      const {dataset: {good}} = e.target;
      console.log(e)
    }
  }
})
