<template>
  <div>
    <goods-tags
      id="js-first-category"
      :name="$t('config.users.category_1')"
      :selectedCatId="selectedFirstCat.id"
      :tags="allFirstCat"
      @selectTag="selectFirstCat"
    />
    <goods-tags
      id="js-second-category"
      v-loading="isSecondCatLoading"
      :name="$t('config.users.category_2')"
      :selectedCatId="selectedSecondCat.id"
      :tags="allSecondCat"
      @selectTag="selectSecondCat"
    />
    <div
      v-loading="isSecondCatLoading || isThirdCatLoading"
      class="cards-wrap"
    >
      <div class="flex-box space-btw cards-wrap-header">
        <span class="text-gray">{{ $t('config.users.category_3') }}</span>
        <div>
          {{ $t('price.common.selected') }}
          <span>{{ filteredSelectedThirdCatIds.length }}</span>
          {{ $t('price.common.selectedUnit') }}，{{ $t('price.common.totalPrice') }}
          <span class="text-primary">¥{{ judgeSecondCatPriceNegotiation(filteredSelectedCatPrice) }}</span>
        </div>
        <div>
          <el-switch
            v-model="isAllSelected"
            @click.native="handleAllSelect()"
          />
          {{ $t('price.goods.checkAll') }}
          <el-tooltip
            effect="dark"
            placement="top"
          >
            <div slot="content">
              {{ $t('price.goods.selectAllInfo') }}
            </div>
            <i class="el-icon-info" />
          </el-tooltip>
        </div>
      </div>
      <el-row :gutter="20">
        <template v-for="item in currentAllThirdCat">
          <goods-card
            :key="item.id"
            :isContentCard="true"
            :catItem="item"
            :selectedCatIds="filteredSelectedThirdCatIds"
            :priceLimit="thirdCatPriceLimit"
            @selectCard="selectCard"
            @cancelCard="cancelCard"
          />
        </template>
      </el-row>
      <el-pagination
        v-show="total > 30"
        background
        class="fr"
        layout="total, prev, pager, next"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import GoodsCard from '../GoodsCard';
import GoodsTags from '../GoodsTags';

export default {
  name: 'GoodsContent',
  components: {
    GoodsCard,
    GoodsTags,
  },
  props: {
    selectedHotCat: {
      type: Object,
      required: true,
    },
    selectedFirstCat: {
      type: Object,
      required: true,
    },
    selectedSecondCat: {
      type: Object,
      required: true,
    },
    selectedCats: {
      type: Array,
      required: true,
    },
    searchCategory: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      isAllSelected: false,
      currentPage: 1,
      pageSize: 30,
    };
  },
  computed: {
    ...mapState({
      allHotAndFirstCat: state => state.price.allHotAndFirstCat,
      allSecondCat: state => state.price.allSecondCat,
      allThirdCat: state => state.price.allThirdCat,
      isSecondCatLoading: state => state.price.isSecondCatLoading,
      isThirdCatLoading: state => state.price.isThirdCatLoading,
      secondCatPriceLimit: state => state.price.secondCatPriceLimit,
      thirdCatPriceLimit: state => state.price.thirdCatPriceLimit,
    }),
    allFirstCat() {
      const filteredSelectedHotCat = this.allHotAndFirstCat.filter(hotCat => hotCat.id === this.selectedHotCat.id);
      return filteredSelectedHotCat.length === 0 ? [] : filteredSelectedHotCat[0].children;
    },
    filteredAllThirdCat() {
      if (this.searchCategory) {
        return this.allThirdCat.filter(
          thirdCat => thirdCat.name.toLowerCase().indexOf(this.searchCategory.toLowerCase()) !== -1,
        );
      }
      return this.allThirdCat;
    },
    total() {
      return this.filteredAllThirdCat.length || 1;
    },
    currentAllThirdCat() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.filteredAllThirdCat.slice(start, end);
    },
    filteredSelectedSecondCat() {
      const matchedSelectedFirstCat = this.selectedCats.filter(
        firstCatItem => firstCatItem.id === this.selectedFirstCat.id,
      );

      if (matchedSelectedFirstCat.length === 0) return {};

      const matchedSelectedSecondCat = matchedSelectedFirstCat[0].children.filter(
        secondCatItem => secondCatItem.id === this.selectedSecondCat.id,
      );

      if (matchedSelectedSecondCat.length === 0) return {};

      return matchedSelectedSecondCat[0];
    },
    filteredSelectedThirdCatIds() {
      if (!this.filteredSelectedSecondCat.children) return [];
      return this.filteredSelectedSecondCat.children.map(thirdCatItem => thirdCatItem.id);
    },
    filteredSelectedCatPrice() {
      if (!this.filteredSelectedSecondCat.finalPrice) return 0;
      return this.filteredSelectedSecondCat.finalPrice;
    },
  },
  watch: {
    allThirdCat() {
      this.judgeAllSelected();
    },
    selectedSecondCat() {
      this.currentPage = 1;
    },
  },
  methods: {
    judgeAllSelected() {
      this.isAllSelected = !!this.filteredSelectedSecondCat.selectAll;
    },
    selectFirstCat(tagItem) {
      this.$emit('selectFirstCat', tagItem);
    },
    selectSecondCat(tagItem) {
      this.$emit('selectSecondCat', tagItem);
    },
    getWrappedThirdCat(thirdCatItem) {
      return {
        ...this.selectedFirstCat,
        children: Array({
          ...this.selectedSecondCat,
          children: Array(thirdCatItem),
        }),
      };
    },
    selectCard(thirdCatItem) {
      const thirdCatItemWrap = this.getWrappedThirdCat(thirdCatItem);
      this.$emit('operateSelectedCats', thirdCatItemWrap);
      this.autoSelectAll();
      this.judgeAllSelected();
    },
    cancelCard(thirdCatItem) {
      const thirdCatItemWrap = this.getWrappedThirdCat(thirdCatItem);
      this.$emit('operateSelectedCats', thirdCatItemWrap);
      this.judgeAllSelected();
    },
    getWrappedSecondCat() {
      return {
        ...this.selectedFirstCat,
        children: Array({
          ...this.selectedSecondCat,
          children: [...this.allThirdCat],
        }),
      };
    },
    handleAllSelect() {
      const secondCatItemWrap = this.getWrappedSecondCat();
      if (this.isAllSelected) {
        this.$emit('selectAll', secondCatItemWrap);
        return;
      }
      this.$emit('cancelSelectAll', secondCatItemWrap);
    },
    autoSelectAll() {
      const isSumExceeded = this.filteredSelectedThirdCatIds.length >= this.allThirdCat.length;
      const isPriceExceeded = this.filteredSelectedCatPrice > 0
        && this.selectedSecondCat.price !== this.secondCatPriceLimit
        && this.filteredSelectedCatPrice >= this.selectedSecondCat.price;

      if (isSumExceeded || isPriceExceeded) {
        const secondCatItemWrap = this.getWrappedSecondCat();
        this.isAllSelected = true;
        this.$emit('selectAll', secondCatItemWrap);
      }
    },
    judgeSecondCatPriceNegotiation(secondCatPrice) {
      if (secondCatPrice === this.secondCatPriceLimit) {
        return this.$t('price.common.negotiation');
      }
      return secondCatPrice;
    },
  },
};
</script>
