<template>
  <el-row
    class="tags-wrap"
    :class="{ more }"
  >
    <label class="text-gray">{{ name }}:</label>
    <ul
      :id="id"
      class="tags-list"
    >
      <li
        v-for="(item, index) in tags"
        :key="index"
        class="block"
        :class="{ on: isTagsOn(item) }"
        @click="selectTag(item)"
      >
        <span>{{ item.name }}</span>
      </li>
    </ul>
    <el-button
      v-if="isButtonShow"
      size="mini"
      class="tags-toggle"
      @click="toggleList()"
    >
      {{ more ? $t('price.goods.retract') : $t('price.goods.more') }}
    </el-button>
  </el-row>
</template>
<script>
export default {
  name: 'GoodsContentTags',
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    selectedCatId: {
      type: [String, Number],
      required: false,
      default: 1,
    },
  },
  data() {
    return {
      more: false,
      isButtonShow: false,
    };
  },
  mounted() {
    this.setButtonShow();
  },
  updated() {
    this.setButtonShow();
  },
  methods: {
    selectTag(tagItem) {
      this.$emit('selectTag', tagItem);
    },
    isTagsOn(tagItem) {
      return this.selectedCatId === tagItem.id;
    },
    toggleList() {
      this.more = !this.more;
    },
    setButtonShow() {
      const tagDom = document.getElementById(this.id);
      if (tagDom && tagDom.offsetHeight >= 84) {
        this.isButtonShow = true;
        return;
      }
      this.isButtonShow = false;
    },
  },
};
</script>
