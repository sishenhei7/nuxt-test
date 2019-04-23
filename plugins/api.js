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

export default ({ $axios }, inject) => {
  inject('api', {
    readHotCategories: () => $axios.$get(urls.readHotCategories),
    readSecondCategories: id => $axios.$get(urls.readSecondCategories.replace('<id>', id)),
    readThirdCategories: id => $axios.$get(urls.readThirdCategories.replace('<id>', id)),
    submitForm: params => $axios.$get(urls.submitForm, params),
  });
};
