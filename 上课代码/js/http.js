// 验证是否为纯粹的对象
const isPlainObject = function isPlainObject (obj) {
  let proto, Ctor;
  if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
  proto = Object.getPrototypeOf(obj);
  if (!proto) return true;
  Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
  return typeof Ctor === "function" && Ctor === Object;
};

axios.defaults.baseURL = 'http://127.0.0.1:3300';
axios.defaults.transformRequest = data => {
  if (isPlainObject(data)) return Qs.stringify(data);
  return data;
};
axios.defaults.timeout = 60000;
axios.defaults.withCredentials = true;
axios.defaults.validateStatus = status => {
  return status >= 200 && status < 400;
};
axios.interceptors.request.use(config => {
  return config;
});
axios.interceptors.response.use(response => {
  return response.data;
}, reason => {
  if (reason && reason.response) {
    // @1 有返回结果，只不过状态码不对
    let {
      status
    } = reason.response;
    switch (+status) {
      case 403:
        alert('服务器不爱搭理你~~');
        break;
      case 404:
        alert('你傻啊，地址都错了~~');
        break;
      case 500:
        alert('服务器开小差了~~');
        break;
    }
  } else {
    // @2 请求超时或者中断 
    if (reason && reason.code === "ECONNABORTED") {
      alert('请求超时或者被中断了~~');
    }
    // @3 断网
    if (!navigator.onLine) {
      alert('当前网络出问题了~~');
    }
  }
  return Promise.reject(reason);
});