import { runHooks } from './hooks.js';
export function createPage(...args) {
  const uses = args.slice(0, -1);
  const options = args[args.length - 1];

  const { onLoad, onUnload, data = {} } = options;


  // 整合所有的使用了的store
  const useStores = uses.filter(item => item.type === 'useStore');
  useStores.forEach(item => {
    Object.assign(data, item.data);
  })

  // 整合所有的computed


  // 整合所有的watch


  // 重写onLoad方法
  options.onLoad = function (...args) {
    // 执行onLoad队列
    runHooks('onLoad', ...args);
    onLoad && onLoad.apply(this, ...args);
  }

  // 重写onUnload方法
  options.onUnload = function (...args) {
    // 执行onLoad队列
    runHooks('onUnload', ...args);
    onUnload && onUnload.apply(this, ...args);
  }

  return Page(options);
}