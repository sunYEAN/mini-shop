import Store from '../store/index.js';
export function useStore(pageName, callback) {
  return {
    type: 'useStore',
    data: callback(Store[pageName].store.state)
  }
}
