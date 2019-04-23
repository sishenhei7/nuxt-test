import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enLang from 'element-ui/lib/locale/lang/en';
import zhLang from 'element-ui/lib/locale/lang/zh-CN';
import locales from '../locales';

Vue.use(VueI18n);

// Separate each language from locales
const getLocale = (lang, lcs) => {
  let locale = {};

  if (Object.prototype.hasOwnProperty.call(lcs, lang)) {
    locale = lcs[lang];
  } else {
    Object.keys(lcs).forEach((key) => {
      locale[key] = getLocale(lang, lcs[key]);
    });
  }

  return locale;
};

// assemble locales
const enLocale = Object.assign({}, getLocale('en', locales), enLang);
const zhLocale = Object.assign({}, getLocale('zh', locales), zhLang);
const messages = {
  en: enLocale,
  zh: zhLocale,
};

// Set i18n instance on app
/* eslint-disable no-param-reassign */
export default ({ app }) => {
  app.i18n = new VueI18n({
    locale: process.env.myLocale,
    messages,
  });
};
