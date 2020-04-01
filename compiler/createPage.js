import { runHooks } from './hooks.js';
export function createPage(...args) {

  const uses = args.slice(0, -1);
  const options = args[args.length - 1];

  const { onLoad, onUnload, data = {} } = options;


  // 整合所有的使用了的store
  const useStores = uses.filter(item => item.type === 'useStore');
  useStores.forEach(item => {
    item.use(options);
  })

  // 整合所有的computed
  const useComputeds = uses.filter(item => item.type === 'useComputed');
  useComputeds.forEach(item => {
    item.use(options);
  })

  // 整合所有的watch


  // 重写onLoad方法
  options.onLoad = function (...args) {
    // 执行onLoad队列
    runHooks.call(this, 'onLoad', ...args);
    onLoad && onLoad.apply(this, ...args);
  }

  // 重写onUnload方法
  options.onUnload = function (...args) {
    // 执行onLoad队列
    runHooks.call(this, 'onUnload', ...args);
    onUnload && onUnload.apply(this, ...args);
  }

  return Page(options);
}