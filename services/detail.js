import API from './api.js';
import request from './request.js';

/**
 * 获取分类列表
 */
export function getCategories (id) {
  return request.get(API.GoodsCategory, {id});
}

/**
 * 获取分类数据
 */
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

/**
 * 获取商品详情
 */
export function getGoodDetail (id) {
  return request.get(API.GoodsDetail, {id});
}