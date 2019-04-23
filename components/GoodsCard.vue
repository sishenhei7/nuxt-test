<template>
  <el-col
    :md="8"
    :sm="12"
    :xs="24"
    @click.native="handleCardClick()"
  >
    <el-card
      :body-style="{ padding: '10px' }"
      :class="{ on: isSelected }"
      shadow="hover"
    >
      <div class="flex-box">
        <span class="img">
          <img class="img-default" src="@/static/img-default.png" alt="">
          <img v-if="catItem.url" :src="catItem.url" alt="">
        </span>
        <div class="info">
          <h5>{{ catItem.name }}</h5>
          <p class="text-gray">
            ¥{{ judgePriceNegotiation(catItem.price) }}
          </p>
        </div>
      </div>
      <template v-if="isContentCard">
        <el-checkbox
          v-show="isSelected"
          v-model="isSelected"
          @click.native.prevent
        />
      </template>
      <template v-if="isCartCard">
        <el-button
          plain
          size="mini"
          class="dele-btn"
          @click.native="handleCardDelete()"
        >
          移除
        </el-button>
      </template>
    </el-card>
  </el-col>
</template>
<script>
export default {
  name: 'GoodsCard',
  props: {
    catItem: {
      type: Object,
      required: true,
    },
    isContentCard: {
      type: Boolean,
      required: false,
      default: false,
    },
    isCartCard: {
      type: Boolean,
      required: false,
      default: false,
    },
    selectedCatIds: {
      type: Array,
      required: false,
      default: () => [],
    },
    priceLimit: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      isSelected: false,
    };
  },
  watch: {
    selectedCatIds: {
      handler(newVal) {
        this.isSelected = newVal.indexOf(this.catItem.id) > -1;
      },
      immediate: true,
    },
  },
  methods: {
    handleCardClick() {
      if (this.isCartCard) return;
      if (this.isSelected) {
        this.$emit('cancelCard', this.catItem);
        return;
      }
      this.$emit('selectCard', this.catItem);
    },
    handleCardDelete() {
      if (this.isContentCard) return;
      this.$emit('deleteCard');
    },
    judgePriceNegotiation(price) {
      if (this.priceLimit && this.priceLimit === price) {
        return this.$t('price.common.negotiation');
      }
      return price;
    },
  },
};
</script>
