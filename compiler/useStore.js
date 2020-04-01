import Store from '../store/index.js';
import { addHooks } from '../compiler/hooks.js';
export function useStore(storeName, callback) {
  return {
    type: 'useStore',
    use: options => {
      const { store } = Store[storeName];

      // 每次的useStore都要向这个store实例添加一个订阅去修改page中的data
      addHooks('onLoad', function (options) {

        // 每个useStore都会订阅一次，只更新useStore中的数据。可以优化，只setData改变了的数据
        const updateState = (state) => {
          this.setData({
            ...callback(state)
          })
        }

        store.subscribe(updateState);
      });


      Object.assign(options.data, callback(store.state));
    }
  }
}


export function useComputed(params = {}) {
  return {
    type: 'useComputed',
    use: options => {

    }
  }
}