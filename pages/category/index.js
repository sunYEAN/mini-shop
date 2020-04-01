// pages/category/index.js
import { getCategories, getCategoryData } from "../../services/detail.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    position: 0, // 位置
    currentIndex: 0, // 当前页面索引
    categoriesData: [{}], // 所有类目的数据构成的数组
    brotherCategories: [],  // 所有的类目构成的数组
  },

  /**
   * 生命周期函数--监听页面加载完成
   */
  async onReady () {
    this.__scroll = {
      widths: [],
      length: 0,
      wrapper: 0,
    };

    const {id} = this.options;
    if (!id) return console.warn('请传入categoryId');

    // 请求分类列表
    const { current, parentCategory, currentCategory } = await this.initialCategories(id);

    // 设置头部标题为当前父级分类名称
    wx.setNavigationBarTitle({
      title: parentCategory.name || '' + "分类",
    })

    // 请求当前类别id下的列表数据
    await this.requestCategoryData(id);

    // 异步去获取query
    setTimeout(async () => {
      const res = await this.initialNav()
      const [view, Nodes] = res;
      this.__scroll.widths = Nodes.map(item => item.width);
      this.__scroll.length = Nodes.length;
      this.__scroll.wrapper = view.width;

      // 头部导航栏滚动到指定的index的位置
      this.handleNavTap({
        target: {
          dataset: {
            index: current
          }
        }
      });
    }, 16);
  },


  /**
   * 计算展示到中间需要滚动多少距离
   */
  calculateCenter(index) {
    let { widths, wrapper, length } = this.__scroll,
      step = widths[index],
      half = wrapper / 2,
      p = widths.slice(0, index).reduce((prev, next) => prev + next, 0);

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
      const query = this.createSelectorQuery().in(this);
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
  initialCategories (id) {
    return getCategories(id).then(res => {
      if (res.errno === 0) {
        let { currentCategory, brotherCategory } = res.data,
            index = brotherCategory.findIndex(item => item.id === currentCategory.id);
        this.setData({
          currentIndex: index,
          brotherCategories: brotherCategory
        })
        return {
          ...res.data,
          current: index
        };
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
  async handleNavTap (e) {
    this.__navChanged = true; // nav改变

    const {dataset: {index}} = e.target;

    await this.scrollTo(index);

    this.__navChanged = false;
  },
  
  /**
   * method sroll to position
   */
  async scrollTo(index) {
    const position = this.calculateCenter(index);

    // 设置下一个为当前索引
    this.setData({
      position,
      currentIndex: index,
    })

    const { currentIndex, brotherCategories } = this.data;
    const currentCategory = brotherCategories[index];
    await this.requestCategoryData(currentCategory.id);
  },

  /**
   * event handler swiper change
   */
  handlSwiperChange (e) {
    console.log('cahnge')
    const { current } = e.detail;
    const { brotherCategories } = this.data;
    !this.__navChanged && this.handleNavTap({
      target: {
        dataset: {
          index: current
        }
      }
    });
    this.__navChanged = false;
  },

  /**
   * 请求当前分类的数据
   */
  requestCategoryData (id, more = false) {
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

    if (this.__loading) return;
    this.__loading = true;
    return getCategoryData({
      id: id,
      page: page,
    }).then(res => {
      const {count, pageSize, data} = res.data;
      categoriesData[currentIndex] = {
        page,
        data: list.concat(data),
        isEnd: page * pageSize >= count  
      }
      this.setData({
        categoriesData: categoriesData
      });
      this.__loading = false;
      return res.data;
    });
  }
})