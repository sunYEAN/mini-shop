import Store from '../store/index.js';
import { addHooks } from '../compiler/hooks.js';

/**
 * targetOb中是否有originOb中的属性，
 * 有则返回这些字段  {} || false
 */

function hasProperty(originOb, targetOb) {
  let temp = {};
  for (let key in targetOb) {
    if (key in originOb) {
      temp[key] = targetOb[key];
    }
  }
  return Object.keys(temp).length ? temp : false;
}


function getComputed(computeds, initialData, ) { }

// 1、 遍历每个useStore中的数据
// 2、 将总的useStore的state通过一个方法赋予options，使其通过this.method获取整合后的state
// 3、 在onLoad生命周期给state所在的store添加一个订阅方法，来修改
// 4、 在onUnload生命周期删除这个订阅方法

/**
 * store name
 * callback // 返回页面中需要用到store的state
 */
export function useStore(storeName, callback) {
  return {
    type: 'useStore',
    use: (options) => {
      // 用带了哪个store
      let { store } = Store[storeName],
        { state } = store,
        useState = callback(state),
        { getUseStates } = options,
        useStates = getUseStates ? getUseStates() : {};

      options.getUseStates = () => {
        // 如果已经存在这个storeName，这将两个合并
        if (useStates[storeName]) {
          Object.assign(useStates[storeName], useState);
        } else {
          useStates[storeName] = useState;
        }
        return useStates;
      }

      Object.assign(options.data, useState);
    }
  }
}

/**
 * computed 计算属性
 */
export function useComputed(computeds) {
  return {
    type: 'useComputed',
    use: options => {
      options.getComputeds = () => computeds;
      const { data } = options;

      // 初始化计算属性数据
      Object.keys(computeds).forEach(function (key) {
        options.data[key] = computeds[key].call(options.data);
      })
      return options;
    }
  }
}

export function injectFirstStore(addHooks) {

  addHooks('onLoad', function (options) {
    // 重写setData方法
    const _setData = this.setData;
    this.setData = function (params, targetStore) {

      _setData.call(this, params);

      // 触发computed更新
      let computeds = this.getComputeds();

      Object.keys(computeds).forEach(key => {
        const temp = computeds[key].call(this.data);
        _setData.call(this, {
          [key]: temp
        })
      });
    };
  })

  // 给当前页面的引入的没有个store添加订阅方法
  addHooks('onLoad', function (options) {
    const useStates = this.getUseStates(); // 当前页面，所有使用了的state

    const updateMethods = {};

    Object.keys(useStates).forEach(key => {
      const store = Store[key].store; // 当前use的state是在哪个store中
      const state = useStates[key]; // 当前引用store中的哪些state
      const updateState = (changeState) => {
        const temp = hasProperty(state, changeState);
        if (!temp) return;
        this.setData({
          ...temp
        }, store)
      }

      if (!updateMethods[key]) updateMethods[key] = updateState;

      store.subscribe(updateState);

      updateState(store.state); // 用store中的state初始化一次页面中data （只改变useStore中的states）
    });

    this.getUseStates = () => updateMethods; // 给getUseStates赋值当前每个store的订阅方法
  })

  // 取消订阅
  addHooks('onUnload', function () {
    const updateStates = this.getUseStates();
    Object.keys(updateStates).forEach(key => {
      const store = Store[key].store;
      store.unSubscribe(updateStates[key]);
    })
  })
}