<template>
  <el-row class="payment-board">
    <el-collapse v-model="activeNames">
      <div
        v-for="(firstCategory, firstCategoryIndex) in selectedCats"
        :key="firstCategory.name"
      >
        <el-collapse-item
          v-for="(secondCategory, secondCategoryIndex) in firstCategory.children"
          :key="secondCategory.name"
          :name="`${firstCategoryIndex}-${secondCategoryIndex}`"
        >
          <template slot="title">
            <div>{{ firstCategory.name }}>{{ secondCategory.name }}</div>
            <div>
              {{ $t('price.common.selected') }}
              {{ secondCategory.children.length }}
              {{ $t('price.common.selectedUnit') }}，{{ $t('price.common.totalPrice') }}
              <span class="text-primary">¥{{ judgeSecondCatPriceNegotiation(secondCategory.finalPrice) }}</span>
            </div>
          </template>
          <ul>
            <li
              v-for="thirdCategory in secondCategory.children"
              :key="thirdCategory.name"
            >
              <span>{{ thirdCategory.name }}</span>
              <span>¥{{ judgeThirdCatPriceNegotiation(thirdCategory.price) }}</span>
            </li>
          </ul>
          <div class="sum">
            <div v-if="!isSecondCatNegotiation(secondCategory)">
              <label class="text-gray" for="">
                <span class="text-warning" />
                {{ secondCategory.children.length }}
                {{ $t('price.common.thirdCategories') }}，
                {{ $t('price.payment.money') }}：
              </label>
              <span class="sum-result"> ¥{{ getTotalThirdCatPrice(secondCategory) }}</span>
            </div>
            <div v-if="!isSecondCatNegotiation(secondCategory)">
              <label for="" class="text-gray">
                <el-tooltip
                  effect="dark"
                  placement="left"
                >
                  <div slot="content">{{ $t('price.payment.discountDesc') }}</div>
                  <i class="icon-help" />
                </el-tooltip>
                {{ $t('price.payment.discount') }}：
              </label>
              <span class="sum-result">{{ getPriceReduction(secondCategory) }}</span>
            </div>
            <div>
              <label for="" class="text-gray">{{ $t('price.payment.final') }}：</label>
              <span class="sum-result text-warning">
                ¥{{ judgeSecondCatPriceNegotiation(secondCategory.finalPrice) }}
              </span>
            </div>
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>
  </el-row>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'PaymentBoard',
  props: {
    selectedCats: {
      type: Array,
      requires: true,
      default: () => [],
    },
  },
  data() {
    return {
      activeNames: ['0-0'],
    };
  },
  computed: {
    ...mapState({
      secondCatPriceLimit: state => state.price.secondCatPriceLimit,
      thirdCatPriceLimit: state => state.price.thirdCatPriceLimit,
    }),
  },
  methods: {
    judgeSecondCatPriceNegotiation(secondCatPrice) {
      if (secondCatPrice === this.secondCatPriceLimit) return this.$t('price.common.negotiation');
      return secondCatPrice;
    },
    judgeThirdCatPriceNegotiation(thirdCatPrice) {
      if (thirdCatPrice === this.thirdCatPriceLimit) return this.$t('price.common.negotiation');
      return thirdCatPrice;
    },
    getTotalThirdCatPrice(secondCategory) {
      let thirdCatPriceSum = 0;
      secondCategory.children.forEach((thirdCatItem) => {
        if (thirdCatItem.price !== this.thirdCatPriceLimit) {
          thirdCatPriceSum += thirdCatItem.price;
        }
      });
      return thirdCatPriceSum;
    },
    getPriceReduction(secondCategory) {
      const totalThirdCatPrice = this.getTotalThirdCatPrice(secondCategory);
      const discount = secondCategory.finalPrice === this.secondCatPriceLimit
        ? totalThirdCatPrice : totalThirdCatPrice - secondCategory.finalPrice;

      if (discount === 0) {
        return '¥0';
      }
      return `-¥${discount}`;
    },
    isSecondCatNegotiation(secondCategory) {
      return secondCategory.finalPrice === this.secondCatPriceLimit;
    },
  },
};
</script>
