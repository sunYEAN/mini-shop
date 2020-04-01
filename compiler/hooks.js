const hooks = {};

export function addHooks(type, callback) {
  if (!hooks[type]) hooks[type] = [];
  hooks[type].push(callback);
}

export function runHooks(type, ...args) {

  // 绑定一下this， runHooks的上下文是指向的页面实例
  const targetPage = this;

  // 该type不存在hooks return
  if (!hooks[type]) return;

  hooks[type].forEach(function (callback) {

    // hooks中的回调函数绑定上下文到页面实例
    callback.apply(targetPage, args)
  })
}