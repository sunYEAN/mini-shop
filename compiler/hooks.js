const hooks = {};
export function addHooks(type, callback) {
  if (!hooks[type]) hooks[type] = [];
  hooks[type].push(callback);
}
export function runHooks(type, ...args) {
  if (!hooks[type]) return;
  hooks[type].forEach(function (callback) {
    callback.apply(this, args)
  })
}