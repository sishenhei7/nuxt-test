/* eslint-disable camelcase */
/* eslint-disable max-len  */
import request from './utils';

const urlPrefix = '/api/common';
const urls = {
  // price
  readHotCategories: '/raw/categories',
  readSecondCategories: '/raw/second_categories/<id>',
  readThirdCategories: '/raw/third_categories/<id>',
  submitForm: '/order',
};

Object.keys(urls).map((url) => {
  urls[url] = urlPrefix + urls[url];
  return url;
});

export default new function API() {
  // price
  this.readHotCategories = () => request.get(urls.readHotCategories);
  this.readSecondCategories = id => request.get(urls.readSecondCategories.replace('<id>', id));
  this.readThirdCategories = id => request.get(urls.readThirdCategories.replace('<id>', id));
  this.submitForm = params => request.post(urls.submitForm, params);
}();
