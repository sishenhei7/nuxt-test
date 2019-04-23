export default ({ $axios }) => {
  /* eslint-disable no-param-reassign  */
  // 基本配置
  $axios.defaults.timeout = 10000;
  $axios.defaults.headers = { 'Content-Type': 'application/json;charset=UTF-8' };


  // 请求回调
  $axios.onRequest((config) => {
    /* eslint-disable no-underscore-dangle  */
    const __randNum = Math.random();
    config.params = { __randNum };
    return config;
  });

  // 返回回调
  // $axios.onResponse(res => {})

  // 错误回调
  // $axios.onError(error => {})
};
