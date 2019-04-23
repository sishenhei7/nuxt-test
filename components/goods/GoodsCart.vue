<template>
  <el-row class="cards-wrap">
    <el-collapse>
      <div
        v-for="firstCat in selectedCats"
        :key="firstCat.id"
      >
        <el-collapse-item
          v-for="secondCat in firstCat.children"
          :key="secondCat.id"
        >
          <template slot="title">
            <span>{{ `${firstCat.name}>${secondCat.name}` }}</span>
            <div>
              已选{{ secondCat.children.length }}个，
              总价 <span class="text-primary">¥{{ judgeSecondCatPriceNegotiation(secondCat.finalPrice) }}</span>
            </div>
            <span
              class="clear-btn"
              @click="handleDeleteAll(firstCat, secondCat)"
            >
              清除该品类
            </span>
          </template>
          <el-row :gutter="20">
            <template v-for="item in secondCat.children">
              <goods-card
                :key="item.id"
                :isCartCard="true"
                :catItem="item"
                :priceLimit="thirdCatPriceLimit"
                @deleteCard="handleDeleteOne(firstCat, secondCat, item)"
              />
            </template>
          </el-row>
        </el-collapse-item>
      </div>
    </el-collapse>
  </el-row>
</template>
<script>
import { mapState } from 'vuex';
import GoodsCard from '../GoodsCard';

export default {
  name: 'GoodsCart',
  components: {
    GoodsCard,
  },
  props: {
    selectedCats: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapState({
      secondCatPriceLimit: state => state.price.secondCatPriceLimit,
      thirdCatPriceLimit: state => state.price.thirdCatPriceLimit,
    }),
  },
  methods: {
    judgeSecondCatPriceNegotiation(secondCatPrice) {
      if (secondCatPrice === this.secondCatPriceLimit) {
        return this.$t('price.common.negotiation');
      }
      return secondCatPrice;
    },
    handleDeleteAll(firstCat, secondCat) {
      const secondCatItemWrap = {
        ...firstCat,
        children: Array({ ...secondCat }),
      };
      this.$emit('deleteAll', secondCatItemWrap);
    },
    handleDeleteOne(firstCat, secondCat, thirdCat) {
      const thirdCatItemWrap = {
        ...firstCat,
        children: Array({
          ...secondCat,
          children: Array({ ...thirdCat }),
        }),
      };
      this.$emit('deleteOne', thirdCatItemWrap);
    },
  },
};
</script>
