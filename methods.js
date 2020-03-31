function toPath (path) {
  // 商品详情页、
  // webview打开H5链接
  // 话题页
  // 分类页
  return wx.navigateTo({
    url: path,
  });
}

export default {
  toPath
}