import Store from '../compiler/store.js';
import { getHomeData } from '../services/home.js'

export const store = new Store({
  number: 0,
  num: 1
});

export function addCount() {
  let {number, num} = store.get();
  store.set({
    number: ++number,
    num: ++num
  })
};