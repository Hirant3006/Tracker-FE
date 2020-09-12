<template>
  <div class="create-transaction">
    <i
      class="far fa-arrow-left"
      style="text-align:left;cursor:pointer"
      @click="() => $router.push({name:$routerName.TRANSACTIONS})"
    >
      <span class="m-l-5">Trở về</span>
    </i>
    <div class="d-flex justify-content-between m-b-20 m-t-10">
      <h3>Tạo giao dịch</h3>
    </div>

    <a-card class="create-transaction__create-card">
      <a-form
        class="create-transaction__create-card-form"
        @submit.stop.prevent="onInsertTransaction()"
      >
        <a-form-item
          label="Số dư ban đầu"
          :validate-status="isError && !$v.form.amount.required ? 'error' : ''"
        >
          <!--  -->
          <!-- <a-input suffix="VND" type="number" /> -->
          <a-input-number
            :default-value="form.amount"
            :formatter="value => ` ${truncNum(value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
            @change="value => value!==null ? form.amount=value : form.amount=0"
            :min="0"
          ></a-input-number>
          <span class="m-l-10">VNĐ</span>
          <div class="error-text" v-if="isError && !$v.form.amount.required">
            <span>*Số dư không được bỏ trống</span>
          </div>
        </a-form-item>
        <a-form-item label="Ghi chú">
          <a-textarea v-model="form.description" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-item>
        <!-- <div class="auth__error-text" v-if="isError">
                <span v-if="!$v.form.username.required">*Tên không được bỏ trống</span>
        </div>-->

        <a-button
          class="m-b-25 m-t-16"
          type="primary"
          size="large"
          block
          html-type="submit"
          :loading="isLoading"
        >Xác nhận</a-button>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  name: "CreateTransaction",
  data() {
    return {
      form: {
        amount: 0,
      },
      isError: false,
      isLoading: false,
    };
  },
  validations: {
    form: {
      balance: {
        required,
      },
    },
  },
  methods: {
    truncNum(number, type) {
      if (isNaN(Math.trunc(number))) return 0;
      else return Math.trunc(number);
    },
  },
};
</script>

<style lang="scss">
.create-transaction {
  margin: 0 120px;
  align-self: center;
  &__create-transaction {
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  .ant-card-body {
    padding: 24px 40px;
  }
  .ant-input-number {
    border-radius: 8px;
    width: 90%;
  }
  form {
    input,
    textarea {
      border-radius: 8px;
    }
  }
  &__create-card {
    &-icon:hover {
      border-color: #40a9ff;
      border-right-width: 1px !important;
      transition: 0.25s all;
    }
    &-icon {
      transition: 0.25s all;
      width: 80px;
      height: 80px;
      border: 0.5px solid $line-color;
      margin: auto;
      border-radius: 8px;
      align-self: center;
      > div {
        cursor: pointer;
        height: 80px;
        font-size: 45px;
        text-align: center;
        > i:first-child {
          transform: translateY(4px);
        }
        .ant-form-item-label {
          line-height: 26px;
        }
        label {
          font-size: 16px;
        }
        .ant-form-item {
          margin-bottom: 16px;
        }
        width: 530px;
        text-align: left;
        border-radius: 8px;
      }
    }
  }
}
</style>