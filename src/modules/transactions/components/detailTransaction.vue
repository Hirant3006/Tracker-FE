<template>
  <div class="detail-trans">
    <a-form class="detail-trans__create-card-form" @submit.stop.prevent="onInsertTransaction()">
      <a-form-item label="Sổ">
        <a-dropdown :disabled="profile.role!=='ADMIN'">
          <span class="ant-dropdown-link" style="cursor:pointer" @click="e => e.preventDefault()">
            <div
              style="justify-content:space-between"
              class="d-flex justify-space-between detail-trans__selected-book detail-trans__selected-book--card"
              v-if="!form.book"
            >
              <span class="detail-trans__selected-book-title m-r-10">Chọn sổ</span>
              <i v-if="profile.role=='ADMIN'" :class="`far fa-angle-down`"></i>
            </div>
            <div v-else class="detail-trans__selected-book detail-trans__selected-book--card">
              <i :class="`far fa-${form.book.iconName ? form.book.iconName : 'book'}`"></i>
              <div>
                <span>{{form.book.name}}</span>
                <span
                  :class="['detail-trans__selected-book-balance',`detail-trans__selected-book-balance--${form.book.currentBalance >0 ? 'plus' : 'minus'}`]"
                >{{`${form.book.currentBalance >0 ? '+' : '-'}`}}{{form.book.currentBalance | money({currency:'vnd'})}}</span>
              </div>
              <i style="margin-left:30px" :class="`far fa-angle-down`"></i>
            </div>
          </span>
          <a-menu slot="overlay">
            <a-menu-item v-for="(item,index) in books" :key="index" @click="onSelectBook(item)">
              <div class="detail-trans__selected-book">
                <i :class="`far fa-${item.iconName ? item.iconName : 'book'}`"></i>
                <div>
                  <span>{{item.name}}</span>
                  <span
                    :class="[,'detail-trans__selected-book-balance',`detail-trans__selected-book-balance--${item.currentBalance >0 ? 'plus' : 'minus'}`]"
                  >{{`${item.currentBalance >0 ? '+' : '-'}`}}{{item.currentBalance | money({currency:'vnd'})}}</span>
                </div>
              </div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-form-item>
      <div class="detail-trans__error-text" v-if="isError">
        <span v-if="!form.book">*Sổ không được bỏ trống</span>
      </div>
      <a-form-item label="Loại">
        <a-radio-group :options="options" :default-value="'INCOME'" @change="onChangeType" />
      </a-form-item>
      <a-form-item label="Số tiền">
        <!--  -->
        <!-- <a-input suffix="VND" type="number" /> -->
        <a-input-number
          :default-value="form.amount"
          :formatter="value => `${truncNum(value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="value => value.replace(/\$\s?|(,*)/g, '')"
          @change="value => value!==null ? form.amount=value : form.amount=0"
          :min="0"
        ></a-input-number>
        <span class="m-l-10">VNĐ</span>
      </a-form-item>
      <div class="detail-trans__error-text" v-if="isError">
        <span
          v-if="form.book!==null && form.amount>form.book.currentBalance && form.type==='EXPENSE'"
        >*Số tiền vượt quá hạn mức</span>
      </div>
      <a-form-item label="Tên khách">
        <a-input placeholder="Nhập tên khách" v-model="form.clientName" />
      </a-form-item>
      <div class="detail-trans__error-text" v-if="isError">
        <span v-if="!form.clientName">*Tên khách không được bỏ trống</span>
      </div>
      <a-form-item label="Ghi chú">
        <a-textarea
          placeholder="Nhập ghi chú"
          v-model="form.description"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
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
  </div>
</template>

<script>
const options = [
  { label: "Thu", value: "INCOME" },
  { label: "Chi", value: "EXPENSE" },
];
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "DetailTransaction",
  data() {
    return {
      form: {},
      isError: false,
      options,
      isLoading: false,
    };
  },
  props: {
    data: {
      required: true,
      default: null,
    },
  },
  created() {
    this.form = this.data;
  },
  computed: {
    ...mapGetters({
      books: typesBook.getters.GET_BOOKS,
      selectedBook: typesBook.getters.GET_SELECTED_BOOK,
      profile: typesAuth.getters.GET_USER_PROFILE,
    }),
  },
  methods: {
    onChangeType(e) {
      this.form.type = e.target.value;
    },
    truncNum(number, type) {
      if (isNaN(Math.trunc(number))) return 0;
      else return Math.trunc(number);
    },
     onSelectBook(item) {
      this.form.book = item;
    },
  },
};
</script>

<style lang="scss">
.detail-trans {
  padding: 0 64px;
  &__selected-book {
    display: flex;
    line-height: 24px;
    margin-top: 2px;
    &--card {
      padding: 5px;
      border: 1px solid $line-color;
      border-radius: 8px;
      width: fit-content;
      height: 60px;
      padding-left: 10px;
    }
    &-title {
      font-size: 16px;
      line-height: 45px;
      margin-left: 10px;
    }

    &-balance {
      &--minus {
        color: $danger-color;
      }
      &--plus {
        color: $success-color;
      }
    }
    > i {
      align-self: center;
      margin-right: 16px;
      font-size: 24px;
    }
    div {
      align-self: center;
      display: flex;
      flex-direction: column;
      span {
      }
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