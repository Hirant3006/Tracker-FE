<template>
  <div class="account-tab">
    <a-card>
      <a-form class="account-tab__form" @submit.stop.prevent="onEditProfile()">
        <a-form-item label="Tên">
          <a-input v-model="form.name" />
        </a-form-item>
        <div class="account-tab__error-text" v-if="isError">
          <span v-if="!form.name">*Tên tài khoản không được bỏ trống</span>
        </div>
        <template v-if="profile.role==='ADMIN'">
        <a-form-item label="Email">
          <a-input v-model="form.email" />
        </a-form-item>
        <div class="account-tab__error-text" v-if="isError">
          <span v-if="!form.email">*Email không được bỏ trống</span>
          <span v-else-if="!$v.form.email.email"
            >*Định dạng email không hợp lệ</span
          >
        </div>
        </template>
        <div class="account-tab__changepass">
          <a-button
            class="m-b-25 m-t-16 account-tab__changepass-btn"
            type="link"
            @click="() => (isVisibleModal = true)"
            block
            >Đổi mật khẩu</a-button
          >
        </div>
        <div v-if="isModify" class="account-tab__button-group">
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
    </a-card>
    <a-modal v-model="isVisibleModal" title="Đổi mật khẩu" :footer="null">
      <a-form class="account-tab__form" @submit.stop.prevent="onEditPassword()">
        <a-form-item label="Nhập mật khẩu cũ">
          <a-input type="password" v-model="form_pass.oldPassword" />
        </a-form-item>
        <div class="account-tab__error-text" v-if="isErrorPassword">
          <span v-if="!form_pass.oldPassword">*Không được bỏ trống</span>
        </div>
        <a-form-item label="Nhập mật khẩu mới">
          <a-input type="password" v-model="form_pass.newPassword" />
        </a-form-item>
        <div class="account-tab__error-text" v-if="isErrorPassword">
          <span v-if="!form_pass.newPassword">*Không được bỏ trống</span>
        </div>
        <div class="account-tab__error-text" v-if="isErrorPassword">
          <span>*Mật khẩu không đúng</span>
        </div>
        <div class="account-tab__button-group">
          <a-button
            class="m-b-25 m-t-16"
            type="primary"
            block
            html-type="submit"
            :loading="isLoadingPassword"
            >Đổi mật khẩu</a-button
          >
          <a-button
            class="m-b-25 m-t-16"
            type="default"
            block
            @click="onCancelModal"
            >Bỏ qua</a-button
          >
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
export default {
  name: "AccountTab",
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
    const { name, email } = this.profile;
    this.form = { name, email };
    this.defaultData = this.$clone(this.form);
  },
  mounted() {
    const { changePassword, changeInfo } = this;
    console.log({ changeInfo, changePassword });
  },
  methods: {
    ...mapActions({
      changeInfo: "setting/changeInfo",
      changePassword: "setting/changePassword",
      getUserProfile: "auth/getUserProfile",
    }),
    async onEditPassword() {
      this.isLoadingPassword = true;
      const { oldPassword, newPassword } = this.form_pass;
      if (!oldPassword || !newPassword) {
        this.isError = true;
        this.$notification["error"]({
          message: `Lỗi sửa thông tin`,
          description: "Có lỗi xảy ra trong quá trình sửa thông tin",
          placement: "bottomRight",
          placement: "topRight",
          top: "80px",
          duration: 5,
        });
      } else {
        const res = await this.changePassword({
          oldPassword,
          newPassword,
        });
        const { header, data } = res.data;
        this.isLoadingPassword = false;
        if (header.isSuccessful) {
          this.$notification["success"]({
            message: `Đổi mật khẩu thành công`,
            description: `Mật khẩu mới đã được lưu`,
            placement: "bottomRight",
            placement: "topRight",
            top: "80px",
            duration: 5,
          });
          this.form_pass = {
            oldPassword: "",
            newPassword: "",
          };
          this.isVisibleModal = false;
          // this.$router.push({ name: this.$routerName.SETTING });
        } else {
          this.$notification["error"]({
            message: `Lỗi sửa thông tin`,
            description: "Có lỗi xảy ra trong quá trình sửa thông tin",
            placement: "bottomRight",
            top: "80px",
            duration: 5,
          });
          this.isErrorPassword = true;
          this.isLoadingPassword = false;
        }
      }
      this.isLoadingPassword = false;
    },
    async onEditProfile() {
      this.isLoading = true;
      const { name, email } = this.form;
      if ((!name || !email) && this.profile.role==='ADMIN') {
        this.isError = true;
        this.$notification["error"]({
          message: `Lỗi sửa thông tin`,
          description: "Có lỗi xảy ra trong quá trình sửa thông tin",
          placement: "bottomRight",
          placement: "topRight",
          top: "80px",
          duration: 5,
        });
      }
      else if (!name && this.profile.role!=='ADMIN') {
        this.isError = true;
        this.$notification["error"]({
          message: `Lỗi sửa thông tin`,
          description: "Có lỗi xảy ra trong quá trình sửa thông tin",
          placement: "bottomRight",
          placement: "topRight",
          top: "80px",
          duration: 5,
        });
      } else {
        const res = await this.changeInfo({
          name,
          email,
        });
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
          this.getUserProfile();
          this.defaultData = this.$clone(this.form);
          this.isModify = false;
          // this.$router.push({ name: this.$routerName.SETTING });
        } else {
          this.$notification["error"]({
            message: `Lỗi sửa thông tin`,
            description: "Có lỗi xảy ra trong quá trình sửa thông tin",
            placement: "bottomRight",
            top: "80px",
            duration: 5,
          });
          this.isError = true;
          this.isLoading = false;
        }
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
    form: {
      deep: true,
      handler(val) {
        this.isModify =
          JSON.stringify(this.defaultData) !== JSON.stringify(val);
        this.$emit("modify", this.isModify);
      },
    },
  },
};
</script>

<style lang="scss">
.account-tab {
  &__form {
    padding: 16px 24px;
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
