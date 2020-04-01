import Store from '../compiler/store.js';

export const store = new Store({
  count: 100
});

export function addCount() {
  let { count } = store.get();
  count++;
  store.set({
    count
  })
}