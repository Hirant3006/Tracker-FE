<template>
  <div class="book-info">
    <a-card>
      <span class="book-info__header">
        <div>
          <i class="far fa-times" @click="onCloseCardBook" />
          <span class="m-l-10">Chi tiết sổ</span>
        </div>
        <div class="book-info__header-button">
          <div v-if="!data.isDelete">
            <a-popconfirm
              title="Bạn muốn xóa sổ này?"
              ok-text="Có"
              cancel-text="Không"
              @confirm="onDeleteBook"
            >
              <a class="book-info__header-button--delete">
                <a-button :loading="isDeletingBook" type="danger">Xóa</a-button>
              </a>
            </a-popconfirm>
          </div>
          <a-button
            @click="onEditBook"
            v-if="!data.isDelete && isEdited"
            class="m-l-10"
            type="primary"
          >
            <i class="far fa-save m-r-5" />Lưu thay đổi
          </a-button>
        </div>
      </span>
      <span class="book-info__name">
        <div>
          <i
            style="cursor: pointer"
            @click="() => (this.isVisibleModal = true)"
            :class="`fad fa-${form.iconName ? form.iconName : 'book'}`"
          ></i>
          <div class="m-l-10">
            <div>
              <span v-if="!isModifyName">{{ form.name }}</span>
              <a-input
                style="font-size: 18px"
                v-else
                @change="onChangeName"
                @pressEnter="() => (isModifyName = !isModifyName)"
              />
              <i
                style="font-size: 16px; cursor: pointer"
                @click="() => (isModifyName = !isModifyName)"
                class="far fa-edit m-l-10"
              />
            </div>
            <span v-if="data.isDelete">Đã xóa: còn 10 ngày để khôi phục</span>
          </div>
        </div>
        <div>
          <a-button v-if="data.isDelete" class="m-r-10">Khôi phục</a-button>
          <a-button>Xem thống kê</a-button>
        </div>
      </span>
      <div class="book-info__amount">
        <div>
          <span>Số dư:&nbsp;</span>
          <span
            :class="[
              ,
              `book-info__amount--${
                data.currentBalance > 0 ? 'plus' : 'minus'
              }`,
            ]"
            >{{ `${data.currentBalance > 0 ? "+" : ""}`
            }}{{ data.currentBalance | money({ currency: "vnd" }) }}</span
          >
        </div>
        <div
          class="book-info__amount-description m-t-4"
          v-if="data.description"
        >
          <span>Ghi chú:&nbsp;</span>
          <span v-if="!isModifyDescription"
            >{{ form.description }}
            <i
              style="font-size: 16px; cursor: pointer"
              @click="() => (isModifyDescription = !isModifyDescription)"
              class="far fa-edit m-l-10"
          /></span>

          <div v-else style="display: flex">
            <a-textarea
              style="font-size: 18px"
              :value="form.description"
              @change="onChangeDes"
              @pressEnter="() => (isModifyDescription = !isModifyDescription)"
            />
            <i
              style="font-size: 16px; cursor: pointer"
              @click="() => (isModifyDescription = !isModifyDescription)"
              class="far fa-edit m-l-10"
            />
          </div>
        </div>
      </div>
      <div class="book-info__employee">
        <div>
          <div class="m-b-5">
            <span>Danh sách nhân viên</span>
            <a-button @click="$router.push({ name: $routerName.EMPLOYEE })"
              >Chi tiết</a-button
            >
          </div>
          <a-table
            v-if="listEmployees !== undefined"
            :columns="columns"
            rowKey="id"
            :data-source="listEmployees"
          ></a-table>
        </div>
      </div>
    </a-card>
    <a-modal v-model="isVisibleModal" title="Chọn biểu tượng" :footer="null">
      <div class="book-info__list-icon">
        <i
          v-for="(item, index) in iconList"
          @click="onSelectIcon(item)"
          :key="index"
          :class="`fad fa-${item}`"
        ></i>
      </div>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Thông tin",
    dataIndex: "title",
    key: "title",
  },
];
import iconList from "@/utils/icon-list.js";
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "BookInfo",
  data() {
    return {
      columns,
      isVisibleModal: false,
      iconList,
      form: {},
      compkey: 0,
      isModifyName: false,
      isModifyDescription: false,
    };
  },
  props: {
    data: {
      required: true,
    },
    isDeletingBook: {
      default: false,
    },
    isEditingBook: {
      default: false,
    },
    isLoadingEmp: {
      required: false,
    },
    listEmployees: {
      required: false,
    },
  },
  mounted() {
    console.log("mounted");
    const { id, name, iconName, description } = this.data;
    this.form = { id, name, iconName, description };
  },
  updated() {
    // const { id, name, iconName, description } = this.data;
    // this.form = { id, name, iconName, description };
  },
  computed: {
    isEdited() {
      const { id, name, iconName, description } = this.data;
      return (
        JSON.stringify(this.form) !==
        JSON.stringify({ id, name, iconName, description })
      );
    },
  },
  methods: {
    ...mapActions({
      deleteBook: "book/deleteBook",
    }),
    onEditBook() {
      this.$emit("edit", this.form);
    },
    onChangeName(e) {
      this.form.name = e.target.value;
    },
    onChangeDes(e) {
      this.form.description = e.target.value;
    },
    onCloseCardBook() {
      this.$emit("close");
    },
    onSelectIcon(iconName) {
      this.form.iconName = iconName;
      this.compkey++;
      this.isVisibleModal = false;
    },
    async onDeleteBook() {
      this.isDeletingBook = false;
      this.$emit("delete");
    },
  },
  watch: {
    data() {
      const { id, name, iconName, description } = this.data;
      this.form = { id, name, iconName, description };
      this.isModifyName = false;
      this.isModifyDescription = false;
    },
  },
};
</script>

<style lang="scss">
.book-info {
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
  .ant-spin {
    transform: unset;
  }
  .ant-pagination {
    display: none;
  }
  &__employee {
    padding-top: 20px;
    padding-bottom: 20px;
    > div {
      span:nth-child(1) {
        font-weight: 600;
      }
      > div:first-child {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  &__amount {
    &-description {
      font-size: 16px !important;
    }
    padding-top: 20px;
    border-bottom: 1px solid $line-color;
    padding-bottom: 20px;
    > div {
      font-size: 18px;
      span:nth-child(1) {
        font-weight: 600;
      }
    }
    &--minus {
      color: $danger-color;
    }
    &--plus {
      color: $success-color;
    }
  }
  &__name {
    font-size: 18px !important;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid $line-color;
    padding-bottom: 20px;
    div:nth-child(1) {
      display: flex;
      > div {
        display: flex;
        flex-direction: column;
        text-align: left;
        span:nth-child(1) {
          align-self: flex-start;
        }
        span:nth-child(2) {
          color: $danger-color;
          font-size: 16px;
        }
      }
      span {
        align-self: center;
        font-size: 24px;
        margin-left: 5px;
      }
      i {
        align-self: center;
        margin-right: 15px;
        font-size: 40px;
        width: 30px;
      }
    }
    div:nth-child(2) {
      display: flex;
    }
  }
  &__header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    i {
      cursor: pointer;
    }
    &-button {
      display: flex;
      &--delete {
        color: $danger-color;
        cursor: pointer;
      }
      &--delete:hover {
        color: lighten($danger-color, 20%);
      }
    }
  }
  width: 100%;
  margin-left: 24px;
  .ant-card {
    font-size: 18px;
  }
}
</style>