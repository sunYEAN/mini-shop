let id = 1;

// 异步更新队列 连续修改store，只修改一次
let stack = {};

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

    if (!stack[this.id]) stack[this.id] = [];
    stack[this.id].concat(this.quer)

    // 修改完store的状态后，需要通知所有用到了当前store实例的页面更新对应的数据
    this.queue.forEach(function (callback) {
      callback(ob);
    });
  }

  // 订阅当前store实例，回调函数去通过setData修改页面中的data
  subscribe(updateState) {
    this.queue.push(updateState);
  }

  // 取消订阅 （页面销毁的时候）
  unSubscribe(u) {
    const index = this.queue.findIndex(updateState => updateState === u);
    if (index > -1) {
      this.queue.splice(index, 1);
    }
    console.log(this.queue, '取消订阅后')
  }
}


export default Store;