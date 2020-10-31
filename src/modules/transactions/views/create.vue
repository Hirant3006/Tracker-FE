<template>
  <div class="create-transaction">
    <i
      class="far fa-arrow-left"
      style="text-align: left; cursor: pointer"
      @click="() => $router.push({ name: $routerName.TRANSACTIONS })"
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
        <a-form-item label="Sổ" :required='true'>
          <a-dropdown :disabled="profile.role !== 'ADMIN'">
            <span
              class="ant-dropdown-link"
              style="cursor: pointer"
              @click="(e) => e.preventDefault()"
            >
              <div
                style="justify-content: space-between"
                class="d-flex justify-space-between create-transaction__selected-book create-transaction__selected-book--card"
                v-if="!form.book"
              >
                <span class="create-transaction__selected-book-title m-r-10"
                  >Chọn sổ</span
                >
                <i
                  v-if="profile.role == 'ADMIN'"
                  :class="`far fa-angle-down`"
                ></i>
              </div>
              <div
                v-else
                class="create-transaction__selected-book create-transaction__selected-book--card"
              >
                <i
                  :class="`far fa-${
                    form.book.iconName ? form.book.iconName : 'book'
                  }`"
                ></i>
                <div>
                  <span>{{ form.book.name }}</span>
                  <span
                    :class="[
                      'create-transaction__selected-book-balance',
                      `create-transaction__selected-book-balance--${
                        form.book.currentBalance > 0 ? 'plus' : 'minus'
                      }`,
                    ]"
                    >{{ `${form.book.currentBalance > 0 ? "+" : "-"}`
                    }}{{
                      form.book.currentBalance | money({ currency: "vnd" })
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
                <div class="create-transaction__selected-book">
                  <i
                    :class="`far fa-${item.iconName ? item.iconName : 'book'}`"
                  ></i>
                  <div>
                    <span>{{ item.name }}</span>
                    <span
                      :class="[
                        ,
                        'create-transaction__selected-book-balance',
                        `create-transaction__selected-book-balance--${
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
        </a-form-item>
        <div class="create-transaction__error-text" v-if="isError">
          <span v-if="!form.book">*Sổ không được bỏ trống</span>
        </div>
        <a-form-item label="Loại" :required='true'>
          <a-radio-group
            :options="options"
            :default-value="'INCOME'"
            @change="onChangeType"
          />
        </a-form-item>
        <a-form-item label="Số tiền" :required='true'>
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
        <div class="create-transaction__error-text" v-if="isError">
          <span
            v-if="
              form.book !== null &&
              form.amount > form.book.currentBalance &&
              form.type === 'EXPENSE'
            "
            >*Số tiền vượt quá hạn mức</span
          >
        </div>
        <a-form-item label="Tên khách" :required='true'>
          <a-input placeholder="Nhập tên khách" v-model="form.clientName" />
        </a-form-item>
        <div class="create-transaction__error-text" v-if="isError">
          <span v-if="!form.clientName">*Tên khách không được bỏ trống</span>
        </div>
        <a-form-item label="Ghi chú" :required='true' >
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
          >Xác nhận</a-button
        >
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
const options = [
  { label: "Thu", value: "INCOME" },
  { label: "Chi", value: "EXPENSE" },
];

export default {
  name: "CreateTransaction",
  data() {
    return {
      form: {
        amount: 0,
        book: null,
        type: "INCOME",
        description: null,
        clientName: null,
      },
      options,
      value: "INCOME",
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
    ...mapActions({
      insertTransaction: "transactions/insertTransaction",
      getBooks: "book/getBooks",
      selectBook: "book/setSelectedBook",
    }),
    truncNum(number, type) {
      if (isNaN(Math.trunc(number))) return 0;
      else return Math.trunc(number);
    },
    onSelectBook(item) {
      this.form.book = item;
    },
    onChangeType(e) {
      this.form.type = e.target.value;
    },
    async onInsertTransaction() {
      this.isLoading = true;
      const { book, type, clientName, description, amount } = this.form;
      const bookId = book == null ? null : book.id;
      if (!bookId || !clientName) {
        this.isError = true;
        this.$notification["error"]({
          message: `Lỗi tạo giao dịch`,
          description: "Có lỗi xảy ra trong quá trình tạo",
          placement: "bottomRight",
        });
      } else if (
        this.form.book &&
        this.form.amount > this.form.book.currentBalance &&
        this.form.type === "EXPENSE"
      ) {
        this.isError = true;
        this.$notification["error"]({
          message: `Lỗi tạo giao dịch`,
          description: "Có lỗi xảy ra trong quá trình tạo",
          placement: "bottomRight",
        });
      } else {
        try {
          const insertTransactiondata = await this.insertTransaction({
            bookId,
            type,
            clientName,
            description,
            amount,
          });
          const { header, data } = insertTransactiondata.data;
          this.isLoading = false;
          console.log(header, data);
          if (header.isSuccessful) {
            await this.getBooks();
            if (typeof this.selectedBook === "object") {
              if (this.selectedBook.id === bookId) {
                const newDataSelectedBook = this.selectedBook;
                newDataSelectedBook.currentBalance =
                  type === "INCOME"
                    ? newDataSelectedBook.currentBalance + amount
                    : newDataSelectedBook.currentBalance - amount;
                this.selectBook(newDataSelectedBook);
              }
            }
            this.$notification["success"]({
              message: `Tạo giao dịch thành công`,
              description: `Đã tạo giao dịch mới cho sổ ${this.form.book.name}`,
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
                message: `Tạo giao dịch`,
                description: "Có lỗi xảy ra trong quá trình tạo",
                placement: "topRight",
                top: "80px",
                duration: 5,
              });
          }
        } catch (e) {
          this.isError = true;
        }
      }
      this.isLoading = false;
    },
  },
  created() {
    if (this.selectedBook !== "all") {
      this.form.book = this.selectedBook;
    }
  },
  computed: {
    ...mapGetters({
      profile: typesAuth.getters.GET_USER_PROFILE,
      books: typesBook.getters.GET_BOOKS,
      selectedBook: typesBook.getters.GET_SELECTED_BOOK,
    }),
    totalBalance() {
      return this.books !== null
        ? this.books.reduce((prev, cur) => {
            console.log("cur ", cur.currentBalance + prev);
            return prev + cur.currentBalance;
          }, 0)
        : 0;
    },
  },
};
</script>

<style lang="scss">
.create-transaction {
  align-self: center;
  width: 600px;
  margin: 0 auto;
  &__error-text {
    color: $danger-color;
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