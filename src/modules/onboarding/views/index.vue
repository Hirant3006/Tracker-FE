<template>
  <div class="onboarding">
    <div v-if="books.length===0">
      <transition name="fade-in" mode="out-in">
        <!-- <div class="onboarding__no-data">
          <img class="m-b-24" src="@/assets/images/not-found.png" alt="not found" />
          <span class="onboarding__title m-b-16">Chưa có sổ nào được tạo</span>
          <a-button
            class="onboarding__no-data-button"
            v-if="profile && profile==='ADMIN'"
            type="primary"
            size="large"
            block
            @click="() => isVisibleModal=true"
          >Tạo sổ</a-button>
          <span class="onboarding__sub-title" v-else>Liên hệ quản lí để biết thêm thông tin</span>
        </div>-->
        <div class="onboarding__create-first-book">
          <span class="onboarding__title m-b-16">👋 Xin chào!!</span>
          <span class="onboarding__sub-title m-b-30">
            <template v-if="books.length===0">Hãy bắt đầu tạo quyển sổ đầu tiên</template>
            <template v-else>Điền đầy đủ vào form bên dưới để tạo sổ mới</template>
          </span>
          <a-card class="onboarding__create-first-book-card">
            <a-form
              class="onboarding__create-first-book-card-form"
              @submit.stop.prevent="onLogin()"
            >
              <a-form-item label="Tên sổ">
                <!-- :validate-status="isError && !$v.form.username.required ? 'error' : ''" -->
                <a-input />
              </a-form-item>
              <a-form-item label="Số dư ban đầu">
                <!-- :validate-status="isError && !$v.form.username.required ? 'error' : ''" -->
                <a-input suffix="VND" type="number" />
              </a-form-item>
              <a-form-item label="Ghi chú">
                <!-- :validate-status="isError && !$v.form.username.required ? 'error' : ''" -->
                <a-textarea :auto-size="{ minRows: 3, maxRows: 5 }" />
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
              >Xác nhận</a-button>
            </a-form>
          </a-card>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
export default {
  name: "Onboarding",
  data() {
    return {
      isVisibleModal: false,
      isLoading: false,
      onCreatedNewBook: false,
      form: {},
    };
  },
  mounted() {
    console.log(this.profile);
  },
  computed: {
    ...mapGetters({
      profile: typesAuth.getters.GET_USER_PROFILE,
      books: typesBook.getters.GET_BOOKS,
    }),
  },
  methods: {
    handleAddBook() {},
  },
};
</script>

<style lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
.onboarding {
  align-self: center;
  &__title {
    font-weight: 600;
    font-size: 24px;
  }
  &__sub-title {
    color: $text-color-secondary;
    font-size: 16px;
  }
  &__create-first-book,
  &____no-data {
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  &__create-first-book {
    .ant-card-body {
      padding: 24px 40px;
    }
    form {
      input,
      textarea {
        border-radius: 8px;
      }
    }
    &-card {
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
  &__no-data {
    img {
      width: 200px;
      align-self: center;
    }
    &-button {
      align-self: center;
    }
    button {
      width: 100px;
    }
  }
}
</style>