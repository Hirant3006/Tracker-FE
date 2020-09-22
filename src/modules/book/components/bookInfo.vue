<template>
  <div class="book-info">
    <a-card>
      <span class="book-info__header">
        <div>
          <i class="far fa-times" />
          <span class="m-l-10">Chi tiết sổ</span>
        </div>
        <div class="book-info__header-button">
          <span class="book-info__header-button--delete">Delete</span>
        </div>
      </span>
      <span class="book-info__name">
        <div>
          <i :class="`fad  fa-${data.iconName ? data.iconName : 'book'}`"></i>
          <div class="m-l-10">
            <span>{{data.name}}</span>
            <span>Đã xóa: còn 10 ngày để khôi phục</span>
          </div>
        </div>
        <div>
          <a-button class="m-r-10">Khôi phục</a-button>
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
          <span>Danh sách nhân viên</span>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  name: "BookInfo",
  props: {
    data: {
      required: true,
    },
  },
};
</script>

<style lang="scss">
.book-info {
  &__employee {
    padding-top: 20px;
    padding-bottom: 20px;
    > div {
      span:nth-child(1) {
        font-weight: 600;
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
    }
  }
  width: 100%;
  margin-left: 24px;
  .ant-card {
    font-size: 18px;
  }
}
</style>