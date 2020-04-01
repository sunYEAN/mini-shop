import Store from '../compiler/store.js';

export const store = new Store({
  cate: [1, 2, 3]
});

export function addCate() {
  let { cate } = store.get();
  cate.push(Math.floor(Math.random() * 10));
  store.set({
    cate
  })
}