const types = {
  READ_HOT_CATEGORIES: 'price/READ_HOT_CATEGORIES',
  READ_SECOND_CATEGORIES: 'price/READ_SECOND_CATEGORIES',
  READ_THIRD_CATEGORIES: 'price/READ_THIRD_CATEGORIES',

  SET_ALL_HOT_CATEGORIES: 'price/SET_ALL_HOT_CATEGORIES',
  SET_ALL_SECOND_CATEGORIES: 'price/SET_ALL_SECOND_CATEGORIES',
  SET_ALL_THIRD_CATEGORIES: 'price/SET_ALL_THIRD_CATEGORIES',

  MOD_HOT_CATEGORY_LOADING: 'price/MOD_HOT_CATEGORY_LOADING',
  MOD_SECOND_CATEGORY_LOADING: 'price/MOD_SECOND_CATEGORY_LOADING',
  MOD_THIRD_CATEGORY_LOADING: 'price/MOD_THIRD_CATEGORY_LOADING',
};

const state = () => ({
  allHotAndFirstCat: [],
  allSecondCat: [],
  allThirdCat: [],
  isHotCatLoading: false,
  isSecondCatLoading: false,
  isThirdCatLoading: false,
  secondCatPriceLimit: 999999,
  thirdCatPriceLimit: 99999,
  allThirdCatPriceLimit: 50000,
});

const getters = {};

const actions = {
  readHotCat({ commit }) {
    commit(types.MOD_HOT_CATEGORY_LOADING, true);
    return this.$api.readHotCategories().then((res) => {
      commit(types.READ_HOT_CATEGORIES, { res });
      commit(types.MOD_HOT_CATEGORY_LOADING, false);
      return res;
    });
  },
  readSecondCat({ commit }, id) {
    commit(types.MOD_SECOND_CATEGORY_LOADING, true);
    return this.$api.readSecondCategories(id).then((res) => {
      commit(types.READ_SECOND_CATEGORIES, { res });
      commit(types.MOD_SECOND_CATEGORY_LOADING, false);
      return res;
    });
  },
  readThirdCat({ commit }, id) {
    commit(types.MOD_THIRD_CATEGORY_LOADING, true);
    return this.$api.readThirdCategories(id).then((res) => {
      commit(types.READ_THIRD_CATEGORIES, { res });
      commit(types.MOD_THIRD_CATEGORY_LOADING, false);
      return res;
    });
  },
  setAllHotCat({ commit }, value) {
    commit(types.SET_ALL_HOT_CATEGORIES, value);
  },
  setAllSecondCat({ commit }, value) {
    commit(types.SET_ALL_SECOND_CATEGORIES, value);
  },
  setAllThirdCat({ commit }, value) {
    commit(types.SET_ALL_THIRD_CATEGORIES, value);
  },
};

const mutations = {
  [types.READ_HOT_CATEGORIES](state, { res }) {
    state.allHotAndFirstCat = res.data;
    try {
      sessionStorage.setItem('allHotAndFirstCat', JSON.stringify(res.data));
    } catch (e) {
      /* eslint-disable no-empty */
    }
  },
  [types.READ_SECOND_CATEGORIES](state, { res }) {
    state.allSecondCat = res.data;
  },
  [types.READ_THIRD_CATEGORIES](state, { res }) {
    state.allThirdCat = res.data;
  },
  [types.SET_ALL_HOT_CATEGORIES](state, value) {
    state.allHotAndFirstCat = value;
  },
  [types.SET_ALL_SECOND_CATEGORIES](state, value) {
    state.allSecondCat = value;
  },
  [types.SET_ALL_THIRD_CATEGORIES](state, value) {
    state.allThirdCat = value;
  },
  [types.MOD_HOT_CATEGORY_LOADING](state, status) {
    state.isHotCatLoading = status;
  },
  [types.MOD_SECOND_CATEGORY_LOADING](state, status) {
    state.isSecondCatLoading = status;
  },
  [types.MOD_THIRD_CATEGORY_LOADING](state, status) {
    state.isThirdCatLoading = status;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
