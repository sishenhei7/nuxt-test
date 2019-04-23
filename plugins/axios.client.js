import { Message } from 'element-ui';

export default ({ $axios }) => {
  // 请求回调
  // $axios.onRequest(config => {});

  // 返回回调
  // $axios.onResponse(res => {});

  // 错误回调
  $axios.onError((error) => {
    let errMsg = '';
    const code = parseInt(error.response && error.response.status, 10);
    if (code === 401) {
      errMsg = '您无权访问该页面';
    } else if (code === 403) {
      errMsg = '禁止访问';
    } else if (code === 404) {
      errMsg = '您访问的页面不存在了';
    } else if (code === 500) {
      errMsg = '服务器出了一点问题，请联系管理员';
    }

    if (errMsg) {
      Message.error(errMsg);
    }
  });
};
