<template>
  <div :key="compKey" class="detail-trans">
    <a-form
      class="detail-trans__create-card-form"
      @submit.stop.prevent="onEditTrans()"
    >
      <a-form-item label="Sổ" :required="true">
        <div style="width: fit-content">
          <a-dropdown :disabled="true">
            <span
              class="ant-dropdown-link"
              style="cursor: pointer"
              @click="(e) => e.preventDefault()"
            >
              <div
                style="justify-content: space-between"
                class="d-flex justify-space-between detail-trans__selected-book detail-trans__selected-book--card"
                v-if="!book"
              >
                <span class="detail-trans__selected-book-title m-r-10"
                  >Chọn sổ</span
                >
                <i
                  v-if="profile.role == 'ADMIN'"
                  :class="`far fa-angle-down`"
                ></i>
              </div>
              <div
                v-else
                class="detail-trans__selected-book detail-trans__selected-book--card"
              >
                <i
                  :class="`far fa-${book.iconName ? book.iconName : 'book'}`"
                ></i>
                <div>
                  <span>{{ book.name }}</span>
                  <span
                    :class="[
                      'detail-trans__selected-book-balance',
                      `detail-trans__selected-book-balance--${
                        book.currentBalance > 0 ? 'plus' : 'minus'
                      }`,
                    ]"
                    >{{
                      book.currentBalance | money({ currency: "vnd" })
                    }}</span
                  >
                </div>
                <i style="margin-left: 30px" :class="`far fa-angle-down`"></i>
              </div>
            </span>
            <a-menu slot="overlay">
              <a-menu-item
                v-for="(item, index) in books"
                :key="index"
                @click="onSelectBook(item)"
              >
                <div class="detail-trans__selected-book">
                  <i
                    :class="`far fa-${item.iconName ? item.iconName : 'book'}`"
                  ></i>
                  <div>
                    <span>{{ item.name }}</span>
                    <span
                      :class="[
                        ,
                        'detail-trans__selected-book-balance',
                        `detail-trans__selected-book-balance--${
                          item.currentBalance > 0 ? 'plus' : 'minus'
                        }`,
                      ]"
                      >{{ `${item.currentBalance > 0 ? "+" : "-"}`
                      }}{{
                        item.currentBalance | money({ currency: "vnd" })
                      }}</span
                    >
                  </div>
                </div>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-form-item>
      <div class="detail-trans__error-text" v-if="isError">
        <span v-if="!form.book">*Sổ không được bỏ trống</span>
      </div>
      <a-form-item label="Loại" :required="true">
        <a-radio-group
          :options="options"
          :default-value="form.type"
          @change="onChangeType"
        />
      </a-form-item>
      <a-form-item label="Số tiền" :required="true">
        <!--  -->
        <!-- <a-input suffix="VND" type="number" /> -->
        <a-input-number
          :default-value="form.amount"
          :formatter="
            (value) =>
              `${truncNum(value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          "
          :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
          @change="
            (value) =>
              value !== null ? (form.amount = value) : (form.amount = 0)
          "
          :min="0"
        ></a-input-number>
        <span class="m-l-10">VNĐ</span>
      </a-form-item>
      <div class="detail-trans__error-text" v-if="isError">
        <span
          v-if="
            form.book !== null &&
            form.amount > form.book.currentBalance &&
            form.type === 'EXPENSE'
          "
          >*Số tiền vượt quá hạn mức</span
        >
      </div>
      <a-form-item label="Tên khách" :required="true">
        <a-input placeholder="Nhập tên khách" v-model="form.clientName" />
      </a-form-item>
      <div class="detail-trans__error-text" v-if="isError">
        <span v-if="!form.clientName">*Tên khách không được bỏ trống</span>
      </div>
      <a-form-item label="Ghi chú" :required="true">
        <a-textarea
          placeholder="Nhập ghi chú"
          v-model="form.description"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
      <!-- <div class="auth__error-text" v-if="isError">
                <span v-if="!$v.form.username.required">*Tên không được bỏ trống</span>
      </div>-->

      <div v-if="isModify && !data.isDelete" class="detail-trans__button-group">
        <a-button
          class="m-b-25 m-t-16"
          type="primary"
          block
          html-type="submit"
          :loading="isLoading"
          >Lưu</a-button
        >
        <a-button
          class="m-b-25 m-t-16"
          type="default"
          block
          @click="onCancelModify"
          >Bỏ qua</a-button
        >
      </div>
      <span style="color: red">*Không thể sửa giao dịch đã bị xóa</span>
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
  name: "DetailTab",
  data() {
    return {
      form: {
        type: "",
        clientName: "",
        amount: "",
        description: "",
      },
      isError: false,
      options,
      isLoading: false,
      defaultData: {
        type: "",
        clientName: "",
        amount: "",
        description: "",
        book: "",
      },
      isModify: false,
      compKey: 0,
      book: null,
    };
  },
  props: {
    data: {
      required: true,
      default: null,
    },
  },
  created() {
    this.book = this.books.find((item) => item.id === this.data.bookId);
    this.form = this.$clone(this.data);
    this.defaultData = this.$clone(this.form);
  },
  computed: {
    ...mapGetters({
      books: typesBook.getters.GET_BOOKS,
      selectedBook: typesBook.getters.GET_SELECTED_BOOK,
      profile: typesAuth.getters.GET_USER_PROFILE,
    }),
  },
  methods: {
    ...mapActions({
      getBooks: "book/getBooks",
      selectBook: "book/setSelectedBook",
      editTransaction: "transactions/editTransaction",
    }),
    onChangeType(e) {
      this.form.type = e.target.value;
    },
    onCancelModify() {
      this.form = this.$clone(this.defaultData);
      this.compKey += 1;
    },
    async onEditTrans() {
      this.isLoading = true;
      const { id } = this.$route.params;
      const { bookId, type, clientName, description, amount } = this.form;
      if (!bookId || !clientName) {
        this.isError = true;
        this.$notification["error"]({
          message: `Sửa giao dịch`,
          description: "Có lỗi xảy ra trong quá trình sửa",
          placement: "bottomRight",
        });
      } else if (
        this.form.book &&
        this.form.amount > this.book.currentBalance &&
        this.form.type === "EXPENSE"
      ) {
        this.isError = true;
        this.$notification["error"]({
          message: `Sửa giao dịch`,
          description: "Có lỗi xảy ra trong quá trình sửa",
          placement: "bottomRight",
        });
      } else {
        const insertTransactiondata = await this.editTransaction({
          id,
          bookId,
          type,
          clientName,
          description,
          amount,
        });
        const { header, data } = insertTransactiondata.data;
        this.isLoading = false;
        if (header.isSuccessful) {
          await this.getBooks();
          const newDataBook = this.books.find((item) => item.id === bookId);
          this.selectBook(newDataBook);
          this.$notification["success"]({
            message: `Sửa giao dịch thành công`,
            description: `Đã sửa giao dịch có mã GD là ${this.$route.params.id}`,
            placement: "topRight",
            top: "80px",
            duration: 5,
          });
          this.$router.push({ name: this.$routerName.TRANSACTIONS });
        } else {
          if (header.resultMessage === "Description can't null!") {
            this.$notification["error"]({
              message: `Lỗi sửa giao dịch`,
              description: "Ghi chú không được để trống",
              placement: "topRight",
              top: "80px",
              duration: 5,
            });
          } else
            this.$notification["error"]({
              message: `Sửa giao dịch`,
              description: "Có lỗi xảy ra trong quá trình sửa",
              placement: "topRight",
              top: "80px",
              duration: 5,
            });
          this.isError = true;
          this.isLoading = false;
        }
      }
      this.isLoading = false;
    },
    truncNum(number, type) {
      if (isNaN(Math.trunc(number))) return 0;
      else return Math.trunc(number);
    },
    onSelectBook(item) {
      this.form.book = item;
    },
  },
  watch: {
    form: {
      deep: true,
      handler(val) {
        this.isModify = JSON.stringify(this.data) !== JSON.stringify(val);
        this.$emit("modify", this.isModify);
      },
    },
  },
};
</script>

<style lang="scss">
.detail-trans {
  width: 600px;
  margin: 0 auto;
  .ant-form-item {
    margin-bottom: 8px !important;
  }
  .ant-col .ant-form-item-control-wrapper {
    width: fit-content;
  }
  padding: 0 64px;
  &__button-group {
    display: flex;
    justify-content: flex-end;
    button {
      width: 120px;
      margin-left: 20px;
    }
  }
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