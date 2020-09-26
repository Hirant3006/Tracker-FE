<template>
  <div class="create-book">
    <i
      class="far fa-arrow-left"
      style="text-align:left;cursor:pointer"
      @click="() => $router.push({name:$routerName.BOOK})"
    >
      <span class="m-l-5">Trở về</span>
    </i>
    <div class="d-flex justify-content-between m-b-20 m-t-10">
      <h3>Tạo sổ mới</h3>
    </div>

    <a-card class="create-book__form-card">
      <a-form class="create-book__form-card-form">
        <div class="create-book__form-card-icon m-b-16">
          <div @click="() => isVisibleModal=true">
            <i :class="`fad fa-${form.icon}`"></i>
          </div>
        </div>
        <a-form-item
          label="Tên sổ"
          :validate-status="isError && !$v.form.name.required ? 'error' : ''"
        >
          <!--  -->
          <a-input placeholder="Nhập tên sổ" v-model="form.name" />
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
          @click="onInsertBook"
        >Xác nhận</a-button>
      </a-form>
    </a-card>
    <a-modal v-model="isVisibleModal" title="Chọn biểu tượng" :footer="null">
      <div class="create-book__list-icon">
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
import { required } from "vuelidate/lib/validators";
import iconList from "@/utils/icon-list.js";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "CreateBook",
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
      form: {
        name: "",
        balance: 0,
        icon: "book",
        description: "",
      },
      iconList,
      isError: false,
      isLoading: false,
      isVisibleModal: false,
    };
  },
  methods: {
    ...mapActions({
      insertBook: "book/insertBook",
      getBooks: "book/getBooks",
      selectBook: "book/setSelectedBook",
    }),
    onSelectIcon(iconName) {
      this.form.icon = iconName;
      this.isVisibleModal = false;
    },
    truncNum(number, type) {
      if (isNaN(Math.trunc(number))) return 0;
      else return Math.trunc(number);
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
            this.getBooks();
            this.$router.push({
              name: this.$routerName.BOOK,
              params: { isSuccess: true },
            });
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
};
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.create-book {
  align-self: center;
  width: 600px;
  margin: 0 auto;
  .ant-input-number {
    width: 90% !important;
  }
  .error-text {
    color: $danger-color;
  }
  &__list-icon {
    display: flex;
    flex-wrap: wrap;
    padding: 8px 16px;
    font-size: 50px;
    height: 500px;
    overflow: hidden;
    overflow-y: scroll;
    overflow-wrap: break-word;
    i {
      padding: 10px 20px;
      cursor: pointer;
    }
  }
  &__form {
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
}
</style>