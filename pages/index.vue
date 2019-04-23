<template>
  <div class="flex-box align-top space-btw">
    <div class="aside">
      <el-row
        @click.native="handleOpenCart()"
      >
        <el-row
          class="total"
          :class="{ on: isCartShow }"
        >
          <p>
            <span class="text-primary">{{ thirdCategorySum }}</span>{{ $t('price.common.thirdCategories') }}
          </p>
          <p>
            {{ $t('price.common.price') }}
            <span class="text-primary total-price">
              <countTo :startVal="priceStart" :endVal="priceEnd" :duration="1500" /></span>
            {{ $t('price.common.unit') }}
          </p>
        </el-row>
      </el-row>
      <el-row class="category-tab">
        <h4>{{ $t('price.goods.categories') }}</h4>
        <el-menu
          v-loading="isHotCatLoading"
          :default-active="`hot-${selectedHotCat.id}`"
        >
          <template v-for="(hotCategory, index) in allHotAndFirstCat">
            <el-menu-item
              :key="index"
              :index="`hot-${hotCategory.id}`"
              @click="handleSelectHotCategory(hotCategory)"
            >
              {{ getHotCategoryName(hotCategory) }}
            </el-menu-item>
          </template>
        </el-menu>
      </el-row>
    </div>

    <div class="wrap">
      <div class="wrap-header flex-box space-btw">
        <div
          v-if="!isCartShow"
          class="flex-box"
        >
          <span>
            {{ $t('price.goods.all') }} >
            {{ getHotCategoryName(selectedHotCat) }} >
            {{ selectedFirstCat.name }} >
            {{ selectedSecondCat.name }} >
          </span>
          <el-input
            v-model="searchCategory"
            :placeholder="$t('price.goods.search')"
            size="small"
          />
        </div>
        <el-button
          v-else
          size="small"
          icon="el-icon-arrow-left"
          @click="handleCloseCart"
        >
          {{ $t('price.goods.pickUpCart') }}
        </el-button>
        <el-button
          v-if="selectedCats.length !== 0"
          type="primary"
          size="small"
          @click="handleGoToPayment"
        >
          {{ $t('price.goods.checkDetails') }}
        </el-button>
      </div>

      <div class="wrap-con">
        <goods-content
          v-if="!isCartShow"
          ref="goodsContent"
          :selectedHotCat="selectedHotCat"
          :selectedFirstCat="selectedFirstCat"
          :selectedSecondCat="selectedSecondCat"
          :selectedCats="selectedCats"
          :searchCategory="searchCategory"
          @selectFirstCat="selectFirstCat"
          @selectSecondCat="selectSecondCat"
          @operateSelectedCats="operateSelectedCats"
          @selectAll="addTheWholeSecondCatToSelectedCats"
          @cancelSelectAll="deleteTheWholeSecondCatInSelectedCats"
        />
        <goods-cart
          v-else
          :selectedCats="selectedCats"
          @deleteOne="operateSelectedCats"
          @deleteAll="deleteTheWholeSecondCatInSelectedCats"
        />
      </div>
    </div>
  </div>
</template>
<script>
import countTo from 'vue-count-to';
import { mapState, mapActions } from 'vuex';
import GoodsContent from '@/components/goods/GoodsContent';
import GoodsCart from '@/components/goods/GoodsCart';

export default {
  name: 'PriceGoods',
  components: {
    countTo,
    GoodsContent,
    GoodsCart,
  },
  data() {
    return {
      isCartShow: false,
      selectedHotCat: {},
      selectedFirstCat: {},
      selectedSecondCat: {},
      selectedCats: [],
      searchCategory: '',
      priceStart: 0,
      priceEnd: 0,
    };
  },
  computed: {
    ...mapState({
      isHotCatLoading: state => state.price.isHotCatLoading,
      allHotAndFirstCat: state => state.price.allHotAndFirstCat,
      allSecondCat: state => state.price.allSecondCat,
      allThirdCat: state => state.price.allThirdCat,
      secondCatPriceLimit: state => state.price.secondCatPriceLimit,
      thirdCatPriceLimit: state => state.price.thirdCatPriceLimit,
      allThirdCatPriceLimit: state => state.price.allThirdCatPriceLimit,
    }),
    thirdCategorySum() {
      let thirdCatSum = 0;
      this.selectedCats.forEach((firstCatItem) => {
        firstCatItem.children.forEach((secondCatItem) => {
          thirdCatSum += secondCatItem.children.length;
        });
      });
      return thirdCatSum;
    },
  },
  asyncData({ store }) {
    return store.dispatch('price/readHotCat');
  },
  mounted() {
    this.initDataFromStorage();
    this.initDataFromApi();
    this.getAllPriceSum();
  },
  methods: {
    ...mapActions({
      readHotCat: 'price/readHotCat',
      readSecondCat: 'price/readSecondCat',
      readThirdCat: 'price/readThirdCat',
      setAllHotCat: 'price/setAllHotCat',
    }),
    setSelectedHotCat(value) {
      this.selectedHotCat = value;
      sessionStorage.setItem('selectedHotCat', JSON.stringify(value));
    },
    setSelectedFirstCat(value) {
      this.selectedFirstCat = value;
      sessionStorage.setItem('selectedFirstCat', JSON.stringify(value));
    },
    setSelectedSecondCat(value) {
      this.selectedSecondCat = value;
      sessionStorage.setItem('selectedSecondCat', JSON.stringify(value));
    },
    sessionStorageGet(name) {
      return sessionStorage.getItem(name) && JSON.parse(sessionStorage.getItem(name));
    },
    sessionStorageSet(name, value) {
      sessionStorage.setItem(name, JSON.stringify(value));
    },
    initDataFromStorage() {
      const allHotAndFirstCat = this.sessionStorageGet('allHotAndFirstCat');
      const selectedHotCat = this.sessionStorageGet('selectedHotCat');
      const selectedFirstCat = this.sessionStorageGet('selectedFirstCat');
      const selectedSecondCat = this.sessionStorageGet('selectedSecondCat');
      const selectedCats = this.sessionStorageGet('selectedCats');

      if (allHotAndFirstCat) this.setAllHotCat(allHotAndFirstCat);
      if (selectedHotCat) this.setSelectedHotCat(selectedHotCat);
      if (selectedFirstCat) this.setSelectedFirstCat(selectedFirstCat);
      if (selectedSecondCat) this.setSelectedSecondCat(selectedSecondCat);
      if (selectedCats) this.selectedCats = selectedCats;
    },
    initHotCatApi() {
      if (this.allHotAndFirstCat.length !== 0) {
        return Promise.resolve();
      }

      return this.readHotCat()
        .catch((res) => {
          this.$message.error({
            showClose: true,
            message: this.$t('price.common.failToReadHotCategories'),
          });
          console.log('readHotCat---error', res);
        });
    },
    initSecondCatApi() {
      return this.readSecondCat(this.selectedFirstCat.id)
        .catch((res) => {
          this.$message.error({
            showClose: true,
            message: this.$t('price.common.failToReadSecondClassCategory'),
          });
          console.log('readSecondCat---error', res);
        });
    },
    initThirdCatApi() {
      return this.readThirdCat(this.selectedSecondCat.id)
        .catch((res) => {
          this.$message.error({
            showClose: true,
            message: this.$t('price.common.failToReadThirdClassCategory'),
          });
          console.log('readThirdCat---error', res);
        });
    },
    initDataFromApi() {
      // 初始化选中的品类
      if (Object.keys(this.selectedHotCat).length === 0) {
        this.setSelectedHotCat(this.allHotAndFirstCat[0]);
      }
      if (Object.keys(this.selectedFirstCat).length === 0) {
        this.setSelectedFirstCat(this.selectedHotCat.children[0]);
      }

      this.initSecondCatApi()
        .then(() => {
          if (Object.keys(this.selectedSecondCat).length === 0) {
            this.setSelectedSecondCat(this.allSecondCat[0]);
          }
          this.initThirdCatApi();
        })
        .catch((res) => {
          this.$message.error({
            showClose: true,
            message: '品类初始化失败',
          });
          console.log('initDataFromApi---error', res);
        });

      // this.initHotCatApi()
      //   .then(() => {
      //     // 初始化选中的品类
      //     if (Object.keys(this.selectedHotCat).length === 0) {
      //       this.setSelectedHotCat(this.allHotAndFirstCat[0])
      //     }
      //     if (Object.keys(this.selectedFirstCat).length === 0) {
      //       this.setSelectedFirstCat(this.selectedHotCat.children[0])
      //     }

      //     this.initSecondCatApi()
      //       .then(() => {
      //         if (Object.keys(this.selectedSecondCat).length === 0) {
      //           this.setSelectedSecondCat(this.allSecondCat[0])
      //         }
      //         this.initThirdCatApi()
      //       })
      //   })
      //   .catch((res) => {
      //     this.$message.error({
      //       showClose: true,
      //       message: '品类初始化失败'
      //     })
      //     console.log('initDataFromApi---error', res)
      //   })
    },
    handleSelectHotCategory(category) {
      this.isCartShow = false;
      this.setSelectedHotCat(category);
      this.setSelectedFirstCat(this.selectedHotCat.children[0]);
      this.initSecondCatApi()
        .then(() => {
          this.setSelectedSecondCat(this.allSecondCat[0]);
          this.initThirdCatApi();
        });
    },
    handleGoToPayment() {
      this.$router.push({ name: 'payment' });
    },
    handleOpenCart() {
      this.isCartShow = true;
    },
    handleCloseCart() {
      this.isCartShow = false;
    },
    selectFirstCat(firstCat) {
      this.setSelectedFirstCat(firstCat);
      this.initSecondCatApi()
        .then(() => {
          this.setSelectedSecondCat(this.allSecondCat[0]);
          this.initThirdCatApi();
        });
    },
    selectSecondCat(secondCat) {
      this.setSelectedSecondCat(secondCat);
      this.initThirdCatApi();
    },
    findMatchedCat(catArr, goalCatId) {
      let matchedCat = null;
      let matchedCatIndex = -1;
      catArr.forEach((catItem, index) => {
        if (catItem.id === goalCatId) {
          matchedCat = catItem;
          matchedCatIndex = index;
        }
      });
      return { matchedCat, matchedCatIndex };
    },
    getFinalPrice(secondCategory) {
      // 计价规则一：二级价格是999999则为面议
      // 计价规则二：三级价格是99999则为面议，不计算在最终价格
      // 计价规则三：三级品类总价格没超过二级品类价格，则用三级品类总价格
      // 计价规则四：三级品类总价格超过二级品类价格，则用二级品类价格
      // 计价规则五：二级品类面议时，三级品类总价格超过5w则用5w
      // 计价规则六：全选的时候用二级品类价格
      let price = 0;
      secondCategory.children.forEach((thirdCatItem) => {
        if (thirdCatItem.price === this.thirdCatPriceLimit) return;
        price += thirdCatItem.price;
      });

      if (secondCategory.price === this.secondCatPriceLimit) {
        if (secondCategory.selectAll) {
          return this.secondCatPriceLimit;
        }

        if (price > this.allThirdCatPriceLimit) {
          return this.allThirdCatPriceLimit;
        }
      }

      if (price > secondCategory.price) return secondCategory.price;

      return price;
    },
    operateSelectedCats(thirdCatItemWrap) {
      // 购物车核心逻辑
      const firstCatInWrap = thirdCatItemWrap;
      const secondCatInWrap = firstCatInWrap.children[0];
      const thirdCatInWrap = secondCatInWrap.children[0];

      // 增加1级
      const {
        matchedCat: matchedFirstCatInStore,
        matchedCatIndex: matchedFirstCatIndex,
      } = this.findMatchedCat(this.selectedCats, firstCatInWrap.id);
      if (matchedFirstCatIndex === -1) {
        secondCatInWrap.finalPrice = this.getFinalPrice(secondCatInWrap);
        this.selectedCats.push(firstCatInWrap);
        this.getAllPriceSum();
        this.sessionStorageSet('selectedCats', this.selectedCats);
        return;
      }

      // 增加2级
      const {
        matchedCat: matchedSecondCatInStore,
        matchedCatIndex: matchedSecondCatIndex,
      } = this.findMatchedCat(matchedFirstCatInStore.children, secondCatInWrap.id);
      if (matchedSecondCatIndex === -1) {
        secondCatInWrap.finalPrice = this.getFinalPrice(secondCatInWrap);
        matchedFirstCatInStore.children.push(secondCatInWrap);
        this.getAllPriceSum();
        this.sessionStorageSet('selectedCats', this.selectedCats);
        return;
      }

      // 增加3级
      const { matchedCatIndex: matchedThirdCatIndex } = this.findMatchedCat(
        matchedSecondCatInStore.children,
        thirdCatInWrap.id,
      );
      if (matchedThirdCatIndex === -1) {
        matchedSecondCatInStore.children.push(thirdCatInWrap);
        matchedSecondCatInStore.finalPrice = this.getFinalPrice(matchedSecondCatInStore);
        this.getAllPriceSum();
        this.sessionStorageSet('selectedCats', this.selectedCats);
        return;
      }

      if (matchedSecondCatInStore) matchedSecondCatInStore.selectAll = false;
      if (matchedSecondCatInStore.children.length > 1) {
        // 删除3级
        matchedSecondCatInStore.children.splice(matchedThirdCatIndex, 1);
        matchedSecondCatInStore.finalPrice = this.getFinalPrice(matchedSecondCatInStore);
      } else if (matchedFirstCatInStore.children.length > 1) {
        // 删除2级
        matchedFirstCatInStore.children.splice(matchedSecondCatIndex, 1);
      } else {
        // 删除1级
        this.selectedCats.splice(matchedFirstCatIndex, 1);
      }
      this.getAllPriceSum();
      this.sessionStorageSet('selectedCats', this.selectedCats);
    },
    deleteTheWholeSecondCatInSelectedCats(secondCatItemWrap) {
      const firstCatInWrap = secondCatItemWrap;
      const secondCatInWrap = firstCatInWrap.children[0];

      const {
        matchedCat: matchedFirstCatInStore,
        matchedCatIndex: matchedFirstCatIndex,
      } = this.findMatchedCat(this.selectedCats, firstCatInWrap.id);
      if (matchedFirstCatIndex === -1) return;

      const { matchedCatIndex: matchedSecondCatIndex } = this.findMatchedCat(
        matchedFirstCatInStore.children,
        secondCatInWrap.id,
      );

      if (matchedSecondCatIndex === -1) return;

      if (matchedFirstCatInStore.children.length > 1) {
        // 删除2级
        matchedFirstCatInStore.children.splice(matchedSecondCatIndex, 1);
      } else {
        // 删除1级
        this.selectedCats.splice(matchedFirstCatIndex, 1);
      }

      this.getAllPriceSum();
      this.sessionStorageSet('selectedCats', this.selectedCats);
    },
    addTheWholeSecondCatToSelectedCats(secondCatItemWrap) {
      const firstCatInWrap = secondCatItemWrap;
      const secondCatInWrap = firstCatInWrap.children[0];
      secondCatInWrap.selectAll = true;
      secondCatInWrap.finalPrice = this.getFinalPrice(secondCatInWrap);

      // 增加1级
      const {
        matchedCat: matchedFirstCatInStore,
        matchedCatIndex: matchedFirstCatIndex,
      } = this.findMatchedCat(this.selectedCats, firstCatInWrap.id);
      if (matchedFirstCatIndex === -1) {
        this.selectedCats.push(firstCatInWrap);
        this.getAllPriceSum();
        this.sessionStorageSet('selectedCats', this.selectedCats);
        return;
      }

      // 增加2级
      const { matchedCatIndex: matchedSecondCatIndex } = this.findMatchedCat(
        matchedFirstCatInStore.children,
        secondCatInWrap.id,
      );
      if (matchedSecondCatIndex === -1) {
        matchedFirstCatInStore.children.push(secondCatInWrap);
        this.getAllPriceSum();
        this.sessionStorageSet('selectedCats', this.selectedCats);
        return;
      }

      // 替换2级
      matchedFirstCatInStore.children.splice(matchedSecondCatIndex, 1, secondCatInWrap);
      this.getAllPriceSum();
      this.sessionStorageSet('selectedCats', this.selectedCats);
    },
    getAllPriceSum() {
      let price = 0;
      this.selectedCats.forEach((firstCatItem) => {
        firstCatItem.children.forEach((secondCatItem) => {
          if (secondCatItem.finalPrice !== this.secondCatPriceLimit) {
            price += secondCatItem.finalPrice;
          }
        });
      });

      if (price !== this.priceEnd) {
        this.priceStart = this.priceEnd;
        this.priceEnd = price;
      }
    },
    getHotCategoryName(hotCatItem) {
      if (this.$i18n.locale !== 'zh') {
        return hotCatItem.name_en;
      }
      return hotCatItem.name_cn;
    },
  },
};
</script>
