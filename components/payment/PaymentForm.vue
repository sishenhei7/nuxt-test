<template>
  <el-row class="payment-form">
    <el-row class="total">
      <div>
        <span class="text-primary">{{ selectedCatsSum }}</span>
        {{ $t('price.common.thirdCategories') }}
      </div>
      <div>
        {{ $t('price.payment.discount') }}：{{ filterDiscount(selectedCatsDiscount) }}
      </div>
      <div>
        {{ $t('price.common.price') }}
        <span class="text-primary total-price">¥{{ selectedCatsPrice }}</span>
        {{ $t('price.common.unit') }}
      </div>
      <div v-if="selectedNegotiatedSecondCatsSum > 0">
        <span class="text-primary">{{ selectedNegotiatedSecondCatsSum }}</span>
        {{ $t('price.payment.additionalSecondCategoryNegotiation') }}
      </div>
      <div v-if="selectedNegotiatedThirdCatsSum > 0">
        <span class="text-primary">{{ selectedNegotiatedThirdCatsSum }}</span>
        {{ $t('price.payment.additionalThirdCategoryNegotiation') }}
      </div>
    </el-row>

    <el-form
      ref="form"
      v-loading="isFormLoading"
      :rules="rules"
      :model="formData"
      label-width="60px"
    >
      <el-form-item
        prop="enterprise"
        :label="$t('price.payment.enterprise')"
      >
        <el-input v-model="formData.enterprise" />
      </el-form-item>
      <el-form-item
        prop="email"
        :label="$t('price.payment.email')"
      >
        <el-input v-model="formData.email" />
      </el-form-item>
      <el-form-item
        prop="phone"
        :label="$t('price.payment.telephone')"
      >
        <el-input v-model="formData.phone" />
      </el-form-item>
      <el-form-item :label="$t('price.payment.remark')">
        <el-input
          v-model="formData.remark"
          type="textarea"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm"
        >
          {{ $t('price.payment.consult') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>
<script>
export default {
  name: 'PaymentForm',
  props: {
    selectedCatsSum: {
      type: Number,
      requires: true,
      default: 0,
    },
    selectedNegotiatedSecondCatsSum: {
      type: Number,
      requires: true,
      default: 0,
    },
    selectedNegotiatedThirdCatsSum: {
      type: Number,
      requires: true,
      default: 0,
    },
    selectedCatsDiscount: {
      type: Number,
      requires: true,
      default: 0,
    },
    selectedCatsPrice: {
      type: Number,
      requires: true,
      default: 0,
    },
    selectedCats: {
      type: Array,
      requires: true,
      default: () => [],
    },
  },
  data() {
    const enterpriseValidator = (rule, value, cb) => {
      if (!value) {
        cb(new Error(this.$t('rules.enterprise_placeholder')));
      } else {
        cb();
      }
    };
    const emailValidator = (rule, value, cb) => {
      /* eslint-disable */
      const ptn = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!value) {
        cb(new Error(this.$t('rules.email_placeholder')));
      } else if (!ptn.test(value)) {
        cb(new Error(this.$t('rules.email')));
      } else {
        cb();
      }
    }
    const phoneValidator = (rule, value, cb) => {
      if (!value) {
        cb(new Error(this.$t('rules.telephone')));
      } else {
        cb();
      }
    }
    return {
      isFormLoading: false,
      formData: {
        enterprise: '',
        email: '',
        phone: '',
        remark: '',
      },
      rules: {
        enterprise: [
          { validator: enterpriseValidator, trigger: 'blur' }
        ],
        email: [
          { validator: emailValidator, trigger: 'blur' }
        ],
        phone: [
          { validator: phoneValidator, trigger: 'blur' }
        ]
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            username: this.formData.enterprise,
            email: this.formData.email,
            telephone: this.formData.phone,
            info: this.formData.remark,
            order_info: JSON.stringify(this.selectedCats),
          };

          this.isFormLoading = true;
          this.$api.submitForm(params)
            .then((res) => {
              this.$message.success({
                showClose: true,
                message: this.$t('price.payment.submitSuccessfully')
              });
              this.resetForm();
            })
            .catch((res) => {
              let errorMsg = this.$t('price.payment.failToSubmit');
              if (res.body.reason === 'invalid argument') {
                errorMsg = this.$t('price.payment.invalidArgument');
              }

              this.$message.error({
                showClose: true,
                message: errorMsg,
              });
              console.log('submitForm-----error', res);
            })
            .finally(() => {
              this.isFormLoading = false;
            })
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    filterDiscount(discount) {
      if (discount === 0) return `¥0`;
      return `-¥${ discount }`;
    },
  },
};
</script>