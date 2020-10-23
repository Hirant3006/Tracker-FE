<template>
  <div class="activity-tab">
    <a-form
      v-if="data !== null"
      class="activity-tab__form"
      @submit.stop.prevent="onEditNotiSetting()"
    >
      <div class="activity-tab__form-part">
        <h3>Ứng dụng:</h3>
        <a-card>
          <a-form-item
            v-for="(part, index) in dataList"
            :key="index"
            :label="part.name"
          >
            <a-checkbox
              width="300px"
              v-for="(item, index) in part.data"
              :defaultChecked="handleDefaultValue(item.type,'InApp')"
              @change="onChangeValue(item.type,'InApp')"
              :key="index"
            >
              {{ item.name }}
            </a-checkbox>
          </a-form-item>
          <div class="activity-tab__error-text" v-if="isError">
            <span v-if="!form.name">*Tên tài khoản không được bỏ trống</span>
          </div>
        </a-card>
      </div>
      <div class="activity-tab__form-part">
        <h3>Email:</h3>
        <a-card>
          <a-form-item
            v-for="(part, index) in dataList"
            :key="index"
            :label="part.name"
          >
            <a-checkbox
              width="300px"
              v-for="(item, index) in part.data"
              :defaultChecked="handleDefaultValue(item.type, 'Email')"
              @change="onChangeValue(item.type, 'Email')"
              :key="index"
            >
              {{ item.name }}
            </a-checkbox>
          </a-form-item>
        </a-card>
      </div>
      <div v-if="isModify" class="activity-tab__button-group">
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
import { required, email } from "vuelidate/lib/validators";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
const dataList = [
  {
    name: "Sổ",
    data: [
      {
        name: "Thêm",
        type: "INSERT_BOOK",
      },
      {
        name: "Sửa",
        type: "UPDATE_BOOK",
      },
      {
        name: "Xóa",
        type: "DELETE_BOOK",
      },
      {
        name: "Sổ sắp bị xóa",
        type: "BOOK_WILL_PERMANENTLY_DELETED",
      },
    ],
  },
  {
    name: "Giao dịch",
    data: [
      {
        name: "Thêm",
        type: "INSERT_TRANSACTION",
      },
      {
        name: "Sửa",
        type: "UPDATE_TRANSACTION",
      },
      {
        name: "Xóa",
        type: "DELETE_TRANSACTION",
      },
    ],
  },
  {
    name: "Nhân viên",
    data: [
      {
        name: "Đăng nhập",
        type: "SIGN_IN",
      },
      {
        name: "Xóa",
        type: "DELETE_USER",
      },
      {
        name: "Khóa nhân viên",
        type: "DEACTIVATE_USER",
      },
    ],
  },
];
export default {
  name: "ActivityTab",
  validations: {
    form: {
      email: {
        email,
      },
    },
  },
  data() {
    return {
      isModify: false,
      dataList,
      data: null,
      defaultData: null,
      dataInapp: null,
      form: {
        email: "",
        name: "",
      },
      form_pass: {
        oldPassword: "",
        newPassword: "",
      },
      isVisibleModal: false,
      defaultData: null,
      isLoading: false,
      isLoadingPassword: false,
      isError: false,
      isErrorPassword: false,
    };
  },
  created() {
    // const { name, email } = this.profile;
    // this.form = { name, email };
    // this.defaultData = this.$clone(this.form);
    this.onGetNotificationSetting();
  },
  mounted() {
    const { changePassword, changeInfo } = this;
  },
  methods: {
    ...mapActions({
      changeInfo: "setting/changeInfo",
      changePassword: "setting/changePassword",
      getUserProfile: "auth/getUserProfile",
      getNotificationSetting: "setting/getNotificationSetting",
      updateNotificationSetting: "setting/updateNotificationSetting",
    }),
    onChangeValue(name, type) {
      const index = this.data.findIndex((item) => item.name === name);
      console.log("hello ", this.data[index], index);
      this.data[index][`is${type}`] = !this.data[index][`is${type}`];
    },
    handleDefaultValue(name, type) {
      return this.data.find((item) => item.name === name)[`is${type}`];
    },
    async onGetNotificationSetting() {
      this.isLoading = true;
      try {
        const res = await this.getNotificationSetting();
        const { header, data } = res.data;
        this.isLoading = false;
        if (header.isSuccessful) {
          this.data = data;
          this.defaultData = this.$clone(data);
          this.isModify = false;
        } else {
          this.$notification["error"]({
            message: `Lỗi lấy thông tin`,
            description: "Có lỗi xảy ra trong quá trình lấy thông tin",
            placement: "topRight",
            top: "80px",
            duration: 5,
          });
          this.isLoading = false;
        }
      } catch (e) {
        this.$notification["error"]({
          message: `Lỗi lấy thông tin`,
          description: "Có lỗi xảy ra trong quá trình lấy thông tin",
          placement: "topRight",
          top: "80px",
          duration: 5,
        });
      }
    },
    async onEditNotiSetting() {
      this.isLoading = true;
      const res = await this.updateNotificationSetting(this.data);
      const { header, data } = res.data;
      this.isLoading = false;
      if (header.isSuccessful) {
        this.$notification["success"]({
          message: `Sửa thông tin thành công`,
          description: `Thông tin mới đã được lưu lại`,
          placement: "bottomRight",
          placement: "topRight",
          top: "80px",
          duration: 5,
        });
        this.defaultData = this.$clone(this.data);
        this.isModify = false;
        // this.$router.push({ name: this.$routerName.SETTING });
      } else {
        this.$notification["error"]({
          message: `Lỗi cập nhật thông tin`,
          description: "Có lỗi xảy ra trong quá trình cập nhật thông tin",
          placement: "bottomRight",
          top: "80px",
          duration: 5,
        });
        this.isError = true;
        this.isLoading = false;
      }
      this.isLoading = false;
    },
    onCancelModal() {
      this.form_pass = { old: "", new: "" };
      this.isVisibleModal = false;
    },
    onCancelModify() {
      this.form = this.$clone(this.defaultData);
      this.compKey += 1;
    },
  },
  computed: {
    ...mapGetters({
      profile: typesAuth.getters.GET_USER_PROFILE,
    }),
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        console.log({ val });
        this.isModify =
          JSON.stringify(this.defaultData) !== JSON.stringify(val);
        this.$emit("modify", this.isModify);
      },
    },
  },
};
</script>

<style lang="scss">
.activity-tab {
  .ant-card-body {
    padding-bottom: 0px;
  }
  &__form {
    padding: 16px 24px;
    width: 700px;
    margin: 0 auto;
    &-part {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
      h3 {
        flex: 1 1 20%;
      }
    }
  }
  &__error-text {
    color: $danger-color;
  }
  &__changepass {
    display: flex;
    justify-content: flex-end;
    &-btn {
      width: 120px;
    }
  }
  .ant-card {
    width: 500px;
    margin: 0 auto;
  }
  &__button-group {
    display: flex;
    justify-content: flex-end;
    button {
      width: 120px;
      margin-left: 20px;
    }
  }
}
</style>
