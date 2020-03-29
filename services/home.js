import API from './api.js';
import request from './request.js';

export function getHomeData () {
  return request.get(API.IndexUrl);
}