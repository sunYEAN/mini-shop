let id = 1;
class Store {
  constructor(state) {
    this.id = id++;
    this.queue = [];
    this.state = state;
  }
  get() {
    return this.state;
  }
  set(ob) {
    const state = this.state;
    // 设置state中对应的字段的值
    Object.keys(ob).forEach(key => {
      // 当state存在且原始值和现在的值不同时
      if (key in state && state[key] !== ob[key]) {
        this.state[key] = ob[key];
      }
    });

    // 修改完store的状态后，需要通知所有用到了当前store实例的页面更新对应的数据
    this.queue.forEach(function ({id, callback}) {
      callback(state);
    });
  }

  // 订阅当前store实例，回调函数去通过setData修改页面中的data
  subscribe(updateState) {
    console.log(updateState);
    this.queue.push(updateState);
  }

  // 取消订阅 （页面销毁的时候）
  unSubscribe(callback) {
    const index = this.queue.findIndex(callback);
    if (index > -1) {
      this.queue.splice(index, 1);
    }
  }
}


export default Store;