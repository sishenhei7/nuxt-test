<template>
  <div class="wrap">
    <div class="flex-box space-btw wrap-header ">
      <h4>{{ $t('price.payment.quotationDetails') }}</h4>
      <el-button size="small" @click="goToGoods">
        {{ $t('price.payment.returnToCategory') }}
      </el-button>
    </div>
    <div class="flex-box space-btw align-top">
      <payment-board :selectedCats="selectedCats" />
      <payment-form
        :selectedCatsSum="selectedCatsSum"
        :selectedNegotiatedSecondCatsSum="selectedNegotiatedSecondCatsSum"
        :selectedNegotiatedThirdCatsSum="selectedNegotiatedThirdCatsSum"
        :selectedCatsDiscount="selectedCatsDiscount"
        :selectedCatsPrice="selectedCatsPrice"
        :selectedCats="selectedCats"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import PaymentBoard from '@/components/payment/PaymentBoard';
import PaymentForm from '@/components/payment/PaymentForm';

export default {
  name: 'PricePayment',
  components: {
    PaymentBoard,
    PaymentForm,
  },
  data() {
    return {
      selectedCatsSum: 0,
      selectedNegotiatedSecondCatsSum: 0,
      selectedNegotiatedThirdCatsSum: 0,
      selectedCatsDiscount: 0,
      selectedCatsPrice: 0,
      selectedCats: [],
    };
  },
  computed: {
    ...mapState({
      secondCatPriceLimit: state => state.price.secondCatPriceLimit,
      thirdCatPriceLimit: state => state.price.thirdCatPriceLimit,
    }),
  },
  mounted() {
    const selectedCats = this.sessionStorageGet('selectedCats');
    if (selectedCats) this.selectedCats = selectedCats;
    this.init();
  },
  methods: {
    init() {
      let thirdCatsSum = 0;
      let negotiatedSecondCatsSum = 0;
      let negotiatedThirdCatsSum = 0;
      let thirdCatsPrice = 0;
      let finalPrice = 0;
      this.selectedCats.forEach((firstCatItem) => {
        firstCatItem.children.forEach((secondCatItem) => {
          thirdCatsSum += secondCatItem.children.length;

          if (secondCatItem.finalPrice === this.secondCatPriceLimit) {
            negotiatedSecondCatsSum += 1;
            return;
          }

          secondCatItem.children.forEach((thirdCatItem) => {
            if (thirdCatItem.price !== this.thirdCatPriceLimit) {
              thirdCatsPrice += thirdCatItem.price;
              return;
            }

            if (!secondCatItem.selectAll) {
              negotiatedThirdCatsSum += 1;
            }
          });
          finalPrice += secondCatItem.finalPrice;
        });
      });
      this.selectedCatsSum = thirdCatsSum;
      this.selectedNegotiatedSecondCatsSum = negotiatedSecondCatsSum;
      this.selectedNegotiatedThirdCatsSum = negotiatedThirdCatsSum;
      this.selectedCatsDiscount = thirdCatsPrice - finalPrice;
      this.selectedCatsPrice = finalPrice;
    },
    sessionStorageGet(name) {
      return sessionStorage.getItem(name) && JSON.parse(sessionStorage.getItem(name));
    },
    goToGoods() {
      this.$router.push({ name: 'index' });
    },
  },
};
</script>
