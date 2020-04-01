// pages/category/index.js
import { getCategories, getCategoryData } from "../../services/detail.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    position: 0, // 位置
    currentIndex: 0, // 当前页面索引
    categoriesData: [], // 所有类目的数据构成的数组
    brotherCategories: [],  // 所有的类目构成的数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id} = options;
    id && this.initialData(id);
  },

  onReady () {
    this.__scroll = {
      width: 0,
      length: 0,
      wrapper: 0,
    };
    setTimeout(async () => {
      const res = await this.initialNav();
      const [view, Nodes] = res;
      this.__scroll.length = Nodes.length;
      this.__scroll.wrapper = view.width;
      this.__scroll.width = Nodes.reduce((prev, next) => {
        return prev + next.width;
      }, 0);
    }, 16)
  },


  /**
   * 计算展示到中间需要滚动多少距离
   */
  calculateCenter(index) {
    let { width, wrapper, length } = this.__scroll,
      step = width / length,
      half = wrapper / 2,
      p = step * index;

    // p点居中时中心的位置 小于wrapper的中心位置
    if ((p + step / 2) <= half) return 0;
    else {
      p = p - half + step / 2
    }
    return p;
  },

  /**
   * 初始化nav模块
   */

  initialNav() {
    return new Promise((resolve, reject) => {
      const query = this.createSelectorQuery();
      query.select('#nav').boundingClientRect();
      query.selectAll('.nav-item').boundingClientRect();
      query.exec(res => {
        if (res) {
          return resolve(res);
        }
        reject(res);
      })
    })
  },

  /**
   * 初始化页面数据
   */
  initialData (id) {
    getCategories(id).then(res => {
      if (res.errno === 0) {
        let { currentCategory, brotherCategory } = res.data,
            index = brotherCategory.findIndex(item => item.id === currentCategory.id);
        
        this.setData({
          currentIndex: index,
          brotherCategories: brotherCategory
        })

        this.requestCategoryData(currentCategory.id);
      }
    })
  },

  handleLoadMore (e) {
    const {dataset: {current}} = e.target;
    const id = this.data.brotherCategories[current].id;
    this.requestCategoryData(id, 'more');
  },

  /**
   * event handler nav change
   */
  handleNavTap (e) {
    this.__navChanged = true; // nav改变

    const {dataset: {item, index}} = e.target;

    this.scrollTo(index);
  },
  
  /**
   * method sroll to position
   */
  scrollTo(index) {
    const position = this.calculateCenter(index);

    // 设置下一个为当前索引
    this.setData({
      position,
      currentIndex: index,
    })

    const { currentIndex, brotherCategories } = this.data;
    const currentCategory = brotherCategories[index];
    this.requestCategoryData(currentCategory.id);
  },

  /**
   * event handler swiper change
   */
  handlSwiperChange (e) {
    const { current } = e.detail;
    const { brotherCategories } = this.data;
    const item = brotherCategories[current];
    !this.__navChanged && this.handleNavTap({
      target: {
        dataset: {
          item, index: current
        }
      }
    });
    this.__navChanged = false;
  },

  /**
   * 请求当前分类的数据
   */
  requestCategoryData (id, more = false) {
    if (this.__loading) return;
    let { categoriesData, currentIndex } = this.data,
        currentCategoryData = categoriesData[currentIndex] || {};

    if (!id) return console.error('请传入类别ID');

    // 不是加载更多，已经有数据 return
    if (!more && currentCategoryData.page) return;

  
    let page = currentCategoryData.page || 1;
    let list = currentCategoryData.data || [];
    let isEnd = currentCategoryData.isEnd || false;

    if (isEnd) return;

    if (more) {
      page++;
    }

    this.__loading = true;
    return getCategoryData({
      id: id,
      page: page,
    }).then(res => {
      const {count, pageSize, data} = res.data;
      categoriesData[currentIndex] = {
        page,
        data: list.concat(data),
        isEnd: page * pageSize >= count,
      }
      this.__loading = false;
      this.setData({
        categoriesData: categoriesData
      })
    });
  }
})