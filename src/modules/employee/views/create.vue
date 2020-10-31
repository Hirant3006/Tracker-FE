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
        <a-form-item label="Tên nhân sự" :required='true'>
          <a-input placeholder="Nhập tên nhân sự" v-model="form.name" />
        </a-form-item>
        <div class="create-employee__error-text" v-if="isError">
          <span v-if="!form.name">*Tên nhân sự không được bỏ trống</span>
        </div>
        <a-form-item label="Tên tài khoản" :required='true'>
          <a-input placeholder="Nhập tên tài khoản" v-model="form.username" />
        </a-form-item>
        <div class="create-employee__error-text" v-if="isError">
          <span v-if="!form.username || isError">*{{userNameErrorText}}</span>
        </div>
        <a-form-item label="Chức vụ" :required='true'>
          <a-input placeholder="Nhập tên tài khoản" v-model="form.title" />
        </a-form-item>
        <div class="create-employee__error-text" v-if="isError">
          <span v-if="!form.title">*Chức vụ không được bỏ trống</span>
        </div>
        <a-form-item
          label="Loại"
          :required='true'
          help="*Quản lí có toàn quyền sử dụng ứng dụng"
        >
          <a-radio-group
            :options="options"
            :default-value="'MODERATOR'"
            @change="onChangeRole"
          />
        </a-form-item>
        <a-form-item
          v-if="form.role !== 'ADMIN'"
          label="Sổ"
          :required='true'
          help="*Chọn sổ nhân viên có thể truy cập"
        >
          <div class="create-employee__switch">
            <div
              v-for="(item, index) in books"
              :key="index"
              class="create-employee__switch-item"
            >
              <a-switch @change="onChangeSwitch(item.id)" />
              <span class="m-l-5">{{ item.name }}</span>
            </div>
          </div>
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
        bookIds: [],
        title: "",
      },
      options,
      isError: false,
      isLoading: false,
      userNameErrorText: "Tên tài khoản không được bỏ trống",
    };
  },
  methods: {
    ...mapActions({
      insertUser: "employee/insertUser",
      getBooks: "book/getBooks",
      selectBook: "book/setSelectedBook",
    }),
    onChangeSwitch(id) {
      let { bookIds } = this.form;
      bookIds.includes(id)
        ? (bookIds = bookIds.filter((item) => item !== id))
        : bookIds.push(id);
      this.form.bookIds = bookIds;
    },
    truncNum(number, type) {
      if (isNaN(Math.trunc(number))) return 0;
      else return Math.trunc(number);
    },
    onChangeRole(e) {
      this.form.role = e.target.value;
    },
    async onInsertEmployee() {
      this.isLoading = true;
      const { role, name, username, bookIds, title } = this.form;
      if (!name || !username || !title) {
        this.isError = true;
        this.$notification["error"]({
          message: `Lỗi tạo giao dịch`,
          description: "Có lỗi xảy ra trong quá trình tạo",
          placement: "bottomRight",
        });
      } else {
        try {
          const res = await this.insertUser({
            role,
            name,
            username,
            bookIds,
            title,
          });
          const { header, data } = res.data;
          this.isLoading = false;
          console.log(header, data);
          if (header.isSuccessful) {
            this.$notification["success"]({
              message: `Tạo nhân viên mới thành công`,
              description: `Nhân viên ${this.form.name} đã được tạo`,
              placement: "topRight",
              top: "80px",
              duration: 5,
            });
            this.$router.push({ name: this.$routerName.EMPLOYEE });
          } else {
            if (header.resultMessage === "Username existed!") {
              this.$notification["error"]({
                message: `Lỗi tạo nhân viên`,
                description: "Tên tài khoản đã được sử dụng",
                placement: "topRight",
                top: "80px",
                duration: 5,
              });
              this.isError = true;
              this.userNameErrorText = "Tên tài khoản đã được sử dụng";
            } else
              this.$notification["error"]({
                message: `Lỗi tạo nhân viên`,
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
  created() {},
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
  watch: {
    form: {
      deep: true,
      handler(val) {
        this.userNameErrorText !== "Tên tài khoản không được bỏ trống" && (this.userNameErrorText === "Tên tài khoản không được bỏ trống")
      },
    },
  },
};
</script>

<style lang="scss">
.create-employee {
  align-self: center;
  width: 600px;
  margin: 0 auto;
  &__switch {
    display: flex;
    flex-wrap: wrap;
    &-item {
      width: 50%;
    }
  }
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