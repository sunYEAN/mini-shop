import API from './api.js';
import request from './request.js';

export function getGoodsCount() {
  return request.get(API.GoodsCount);
}