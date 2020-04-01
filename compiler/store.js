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
    })
  }
}


export default Store;