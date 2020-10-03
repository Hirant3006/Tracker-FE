<template>
  <div :key="compKey" class="detail-emp">
    <a-form
      class="detail-emp__create-card-form"
      @submit.stop.prevent="onEditTrans()"
    >
      <a-form-item label="Tên nhân sự">
        <a-input placeholder="Nhập tên nhân sự" v-model="form.name" />
      </a-form-item>
      <div class="detail-emp__error-text" v-if="isError">
        <span v-if="!form.name">*Tên nhân sự không được bỏ trống</span>
      </div>
      <a-form-item label="Tên tài khoản">
        <a-input
          :disabled="true"
          placeholder="Nhập tên tài khoản"
          v-model="form.username"
        />
      </a-form-item>
      <div class="detail-emp__error-text" v-if="isError">
        <span v-if="!form.username">*Tên tài khoản không được bỏ trống</span>
      </div>
      <a-form-item label="Chức vụ">
        <a-input placeholder="Nhập tên tài khoản" v-model="form.title" />
      </a-form-item>
      <div class="detail-emp__error-text" v-if="isError">
        <span v-if="!form.title">*Chức vụ không được bỏ trống</span>
      </div>
      <a-form-item label="Loại" help="*Quản lí có toàn quyền sử dụng ứng dụng">
        <a-radio-group
          :options="options"
          :default-value="form.role"
          @change="onChangeRole"
        />
      </a-form-item>
      <a-form-item
        v-if="form.role !== 'ADMIN'"
        label="Sổ"
        help="*Chọn sổ nhân viên có thể truy cập"
      >
        <div class="detail-emp__switch">
          <div
            v-for="(item, index) in books"
            :key="index"
            class="detail-emp__switch-item"
          >
            <a-switch
              :defaultChecked="isChecked(item.id)"
              @change="onChangeSwitch(item.id)"
            />
            <span class="m-l-5">{{ item.name }}</span>
          </div>
        </div>
      </a-form-item>
      <!-- <div class="auth__error-text" v-if="isError">
                <span v-if="!$v.form.username.required">*Tên không được bỏ trống</span>
      </div>-->

      <div v-if="isModify" class="detail-emp__button-group">
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
    </a-form>
  </div>
</template>

<script>
const options = [
  { label: "Nhân viên", value: "MODERATOR" },
  { label: "Quản lí", value: "ADMIN" },
];

import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "DetailTab",
  data() {
    return {
      form: {
        role: "MODERATOR",
        name: "",
        username: "",
        bookIds: [],
        title: "",
      },
      isError: false,
      options,
      isLoading: false,
      defaultData: {
        role: "MODERATOR",
        name: "",
        username: "",
        bookIds: [],
        title: "",
      },
      isModify: false,
      compKey: 0,
    };
  },
  props: {
    data: {
      required: true,
      default: null,
    },
  },
  created() {
    this.form = this.$clone(this.data);
    this.form.bookIds = this.form.bookList.map((item) => item.id);
    this.defaultData = this.$clone(this.form);
  },
  computed: {
    ...mapGetters({
      books: typesBook.getters.GET_BOOKS,
    }),
  },
  methods: {
    ...mapActions({
      getBooks: "book/getBooks",
      selectBook: "book/setSelectedBook",
      editUser: "employee/editUser",
    }),
    onChangeSwitch(id) {
      let { bookIds } = this.form;
      bookIds.includes(id)
        ? (bookIds = bookIds.filter((item) => item !== id))
        : bookIds.push(id);
      this.form.bookIds = bookIds;
    },
    isChecked(id) {
      return this.form.bookIds.includes(id);
    },
    onChangeRole(e) {
      this.form.role = e.target.value;
    },
    onCancelModify() {
      this.form = this.$clone(this.defaultData);
      this.compKey += 1;
    },
    async onEditTrans() {
      this.isLoading = true;
      const { id } = this.$route.params;
      const { name, title, bookIds,role } = this.form;
      if (!name || !title) {
        this.isError = true;
        this.$notification["error"]({
          message: `Lỗi sửa giao dịch`,
          description: "Có lỗi xảy ra trong quá trình sửa",
          placement: "bottomRight",
        });
      } else {
        const res = await this.editUser({
          id,
          name,
          title,
          bookIds,
          role
        });
        const { header, data } = res.data;
        this.isLoading = false;
        if (header.isSuccessful) {
          this.$notification["success"]({
            message: `Sửa thông tin nhân viên thành công`,
            description: `Đã sửa nhân viên có mã là ${this.$route.params.id}`,
            placement: "topRight",
            top: "80px",
            duration: 5,
          });
          this.$router.push({ name: this.$routerName.EMPLOYEE });
        } else {
          this.$notification["error"]({
            message: `Sửa nhân viên`,
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
.detail-emp {
  width: 600px;
  margin: 0 auto;
  .ant-form-item {
    margin-bottom: 8px !important;
  }
  .ant-col .ant-form-item-control-wrapper {
    width: fit-content;
  }
  &__switch {
    display: flex;
    flex-wrap: wrap;
    &-item {
      width: 50%;
    }
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