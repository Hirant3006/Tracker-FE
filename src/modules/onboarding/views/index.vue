<template>
  <div class="onboarding">
    <div v-if="!books">
      <transition name="fade-in" mode="out-in">
        <div class="onboarding__no-data" v-if="onCreatedNewBook==false">
          <img class="m-b-24" src="@/assets/images/not-found.png" alt="not found" />
          <span class="onboarding__title m-b-16">Chưa có sổ nào được tạo</span>
          <a-button
            class="onboarding__no-data-button"
            v-if="profile && profile.role==='ADMIN'"
            type="primary"
            size="large"
            block
            @click="() => onCreatedNewBook=true"
          >Tạo sổ</a-button>
          <span class="onboarding__sub-title" v-else>Liên hệ quản lí để biết thêm thông tin</span>
        </div>
        <div class="onboarding__create-first-book" v-else>
          <i
            class="far fa-arrow-left"
            style="text-align:left;cursor:pointer"
            @click="() => onCreatedNewBook=false"
          >
            <span class="m-l-5">Trở về</span>
          </i>
          <span class="onboarding__title m-b-16">👋 Xin chào!!</span>
          <span class="onboarding__sub-title m-b-30">
            <template v-if="books && books.length===0">Hãy bắt đầu tạo quyển sổ đầu tiên</template>
            <template v-else>Điền đầy đủ vào form bên dưới để tạo sổ mới</template>
          </span>
          <a-card class="onboarding__create-first-book-card">
            <a-form class="onboarding__create-first-book-card-form">
              <div class="onboarding__create-first-book-card-icon m-b-16">
                <div @click="() => isVisibleModal=true">
                  <i :class="`fad fa-${form.icon}`"></i>
                </div>
              </div>
              <a-form-item
                label="Tên sổ"
                :validate-status="isError && !$v.form.name.required ? 'error' : ''"
              >
                <!--  -->
                <a-input v-model="form.name" />
                <div class="error-text" v-if="isError && !$v.form.name.required">
                  <span>*Tên sổ không được bỏ trống</span>
                </div>
              </a-form-item>
              <a-form-item
                label="Số dư ban đầu"
                :validate-status="isError && !$v.form.balance.required ? 'error' : ''"
              >
                <!--  -->
                <!-- <a-input suffix="VND" type="number" /> -->
                <a-input-number
                  :default-value="form.balance"
                  :formatter="value => ` ${truncNum(value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                  @change="value => value!==null ? form.balance=value : form.balance=0"
                  :min="0"
                ></a-input-number>
                <span class="m-l-10">VNĐ</span>
                <div class="error-text" v-if="isError && !$v.form.balance.required">
                  <span>*Số dư không được bỏ trống</span>
                </div>
              </a-form-item>
              <a-form-item label="Ghi chú">
                <!-- :validate-status="isError && !$v.form.username.required ? 'error' : ''" -->
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
                @click="onInsertBook"
              >Xác nhận</a-button>
            </a-form>
          </a-card>
        </div>
      </transition>
    </div>
    <div v-else>
      <div
        class="onboarding__title m-b-24 align-center"
        style="text-align:center"
      >Chọn sổ để tiếp tục</div>
      <div class="onboarding__list-card">
        <book-card
          @click="onSelectBook"
          v-if="profile && profile.role==='ADMIN'"
          type="blank"
          icon="globe"
          name="Tất cả"
        />
        <book-card
          @click="onSelectBook(book)"
          v-for="(book,index) in books"
          :key="index"
          :data="book"
        />
      </div>
    </div>
    <a-modal v-model="isVisibleModal" title="Chọn biểu tượng" :footer="null">
      <div class="onboarding__list-icon">
        <i
          v-for="(item,index) in iconList"
          @click="onSelectIcon(item)"
          :key="index"
          :class="`fad fa-${item}`"
        ></i>
      </div>
    </a-modal>
  </div>
</template>

<script>
import iconList from "@/utils/icon-list.js";
import bookCard from "../components/bookCard";
import { required } from "vuelidate/lib/validators";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
export default {
  name: "Onboarding",
  components: {
    bookCard,
  },
  validations: {
    form: {
      name: {
        required,
      },
      balance: {
        required,
      },
    },
  },
  data() {
    return {
      isVisibleModal: false,
      isLoading: false,
      onCreatedNewBook: false,
      form: {
        name: "",
        balance: 0,
        icon: "book",
        description: "",
      },
      isError: false,
      iconList: iconList,
    };
  },
  created() {},
  computed: {
    ...mapGetters({
      profile: typesAuth.getters.GET_USER_PROFILE,
      books: typesBook.getters.GET_BOOKS,
    }),
  },
  methods: {
    ...mapActions({
      insertBook: "book/insertBook",
      getBooks: "book/getBooks",
      selectBook: "book/setSelectedBook",
    }),
    ...mapMutations({}),
    onSelectIcon(iconName) {
      this.form.icon = iconName;
      this.isVisibleModal = false;
    },
    onCreateNewBook() {
      this.onCreatedNewBook = true;
    },
    truncNum(number, type) {
      if (isNaN(Math.trunc(number))) return 0;
      else return Math.trunc(number);
    },
    onSelectBook(data) {
      this.selectBook(data ? data : "all");
      this.$router.push("/");
    },
    async onInsertBook() {
      const {
        name,
        balance: initialBalance,
        icon: iconName,
        description,
      } = this.form;
      try {
        if (initialBalance && name) {
          this.isLoading = true;
          const insertBookData = await this.insertBook({
            name,
            initialBalance,
            iconName,
            description,
          });
          const { header, data } = insertBookData.data;
          this.isLoading = false;
          if (header.isSuccessful) {
            this.$message.success("Đã tạo sổ mới thành công");
            this.$router.go();
          } else {
            this.$message.error("Có lỗi xảy ra trong quá trình tạo");
          }
        } else {
          this.isError = true;
        }
      } catch (e) {
        this.isError = true;
      }
    },
  },
  watch: {
    form: {
      deep: true,
      handler() {
        console.log("hello");
        this.isError = false;
      },
    },
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
.ant-modal-body {
  padding: 0;
}
.onboarding {
  &__list-icon {
    display: flex;
    flex-wrap: wrap;
    padding: 8px 16px;
    font-size: 50px;
    height: 500px;
    overflow: hidden;
    overflow-y: auto;
    overflow-wrap: break-word;
    i {
      padding: 10px 20px;
      cursor: pointer;
    }
  }
  .error-text {
    color: $danger-color;
  }
  margin: 0 120px;
  align-self: center;
  &__list-card {
    display: flex;
    flex-wrap: wrap;
    > div {
      margin: 16px;
    }
  }
  &__title {
    font-weight: 600;
    font-size: 24px;
  }
  &__sub-title {
    color: $text-color-secondary;
    font-size: 16px;
  }
  &__create-first-book,
  &__no-data {
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  .ant-input-number {
    width: 90%;
  }
  &__create-first-book {
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
    &-card {
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
        }
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