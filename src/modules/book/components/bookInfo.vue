<template>
  <div class="book-info">
    <a-card>
      <span class="book-info__header">
        <div>
          <i class="far fa-times" @click="onCloseCardBook" />
          <span class="m-l-10">Chi tiết sổ</span>
        </div>
        <div class="book-info__header-button">
          <a-popconfirm
            title="Bạn muốn xóa sổ này?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="onDeleteBook"
            v-if="!isLoadingEmp"
          >
            <a class="book-info__header-button--delete">
              <template>Xóa</template>
            </a>
          </a-popconfirm>
          <a-spin v-else />
        </div>
      </span>
      <span class="book-info__name">
        <div>
          <i :class="`fad  fa-${data.iconName ? data.iconName : 'book'}`"></i>
          <div class="m-l-10">
            <span>{{data.name}}</span>
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
            :class="[,`book-info__amount--${data.currentBalance >0 ? 'plus' : 'minus'}`]"
          >{{`${data.currentBalance >0 ? '+' : ''}`}}{{data.currentBalance | money({currency:'vnd'})}}</span>
        </div>
        <div></div>
      </div>
      <div class="book-info__employee">
        <div>
          <div class="m-b-5">
            <span>Danh sách nhân viên</span>
            <a-button @click="$router.push({name:$routerName.EMPLOYEE})">Chi tiết</a-button>
          </div>
          <a-table
            v-if="listEmployees!==undefined"
            :columns="columns"
            rowKey="id"
            :data-source="listEmployees"
          ></a-table>
        </div>
      </div>
    </a-card>
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
export default {
  name: "BookInfo",
  data() {
    return {
      columns,
    };
  },
  props: {
    data: {
      required: true,
    },
    isLoadingEmp: {
      required: false,
    },
    listEmployees: {
      required: false,
    },
  },
  methods: {
    onCloseCardBook() {
      this.$emit("close");
    },
    onDeleteBook() {
      this.$emit("delete");
    },
  },
};
</script>

<style lang="scss">
.book-info {
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