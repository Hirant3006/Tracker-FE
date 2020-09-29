<template>
  <div class="create-employee">
    <i
      class="far fa-arrow-left"
      style="text-align: left; cursor: pointer"
      @click="() => $router.push({ name: $routerName.EMPLOYEE })"
    >
      <span class="m-l-5">Trở về</span>
    </i>
    <div class="d-flex justify-content-between m-b-20 m-t-10">
      <h3>Thêm nhân viên</h3>
    </div>

    <a-card class="create-employee__create-card">
      <a-form
        class="create-employee__create-card-form"
        @submit.stop.prevent="onInsertEmployee()"
      >
        <a-form-item label="Tên nhân sự">
          <a-input placeholder="Nhập tên nhân sự" v-model="form.clientName" />
        </a-form-item>
        <div class="create-employee__error-text" v-if="isError">
          <span v-if="!form.name">*Tên nhân sự không được bỏ trống</span>
        </div>
        <a-form-item label="Tên tài khoản">
          <a-input placeholder="Nhập tên tài khoản" v-model="form.clientName" />
        </a-form-item>
        <div class="create-employee__error-text" v-if="isError">
          <span v-if="!form.username">*Tên tài khoản không được bỏ trống</span>
        </div>
        <a-form-item label="Loại">
          <a-radio-group
            :options="options"
            :default-value="'MODERATOR'"
            @change="onChangeRole"
          />
        </a-form-item>
        <!-- <a-form-item label="Ghi chú">
          <a-textarea
            placeholder="Nhập ghi chú"
            v-model="form.description"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item> -->
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
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
const options = [
  { label: "Nhân viên", value: "MODERATOR" },
  { label: "Quản lí", value: "ADMIN" },
];

export default {
  name: "CreateEmployee",
  data() {
    return {
      form: {
        role: "MODERATOR",
        name: "",
        username: "",
      },
      options,
      isError: false,
      isLoading: false,
    };
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
.create-employee {
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