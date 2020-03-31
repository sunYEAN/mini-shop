import API from './api.js';
import request from './request.js';

export function getCatalogList() {
  return request.get(API.CatalogList);
}

export function getCatalogCurrent({id}) {
  return request.get(API.CatalogCurrent, {id});
}