<template>
  <div class="price-wrapper">
    <el-header>
      <div class="content flex-box space-btw">
        <nuxt-link :to="{ name: 'index' }">
          <span class="logo">
            <img src="~/static/svg/logo2.svg" alt="">
          </span>
        </nuxt-link>
        <div class="change-lang">
          <a
            href="//www.yimian.com.cn/contact/?subject=YiDrone"
            target="_blank"
            class="contact"
          >
            <i class="icon-svg-message icon-" />
            {{ $t('price.common.contact') }}
          </a>
        </div>
      </div>
    </el-header>

    <el-row class="content">
      <el-row class="title">
        <h2>{{ $t('price.common.title') }}</h2>
        <p class="text-gray">
          {{ $t('price.common.description') }}
        </p>
      </el-row>
      <nuxt />
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'IndexPrice',
  data() {
    return {
      currentLang: this.$i18n.locale,
    };
  },
  methods: {
    switchLang(lang) {
      this.currentLang = lang;
      this.$locale.use(lang);
      localStorage.setItem('YIDRONE_LANGUAGE', lang);
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_price.scss';
</style>
