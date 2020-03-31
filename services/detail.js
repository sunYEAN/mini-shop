import API from './api.js';
import request from './request.js';

export function getCategories (id) {
  return request.get(API.GoodsCategory, {id});
}

export function getCategoryData({
  id,
  page
}) {
  return request.get(API.GoodsList, {
    categoryId: id,
    page: page,
    size: 20
  })
}