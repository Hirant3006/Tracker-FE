<template>
  <div class="user-card">
    <a-card class=" m-b-10" v-if="data !== undefined">
      <div class="user-card">
        <div
          :class="[
            'user-card__icon',
            `user-card__icon--${data.actionType.toLowerCase()}`,
          ]"
        >
          <i :class="`far fa-user-lock`" v-if="data.actionType='SIGN_IN'"></i>
          <i :class="`far fa-user-lock`" v-else-if="data.actionType='DEACTIVE'"></i>
          <i :class="`far fa-user-unlock`" v-else-if="data.actionType='ACTIVE'"></i>
        </div>
        <div class="user-card__info">
          <span>
            Nhân viên
            <b>{{data.name}}</b> (ID:{{data.id}}) đã
            <span v-if="data.actionType==='SIGN_IN'">
              <b>đăng nhập</b> vào hệ thống
            </span>
            <span v-if="data.actionType==='DEACTIVE'">
              bị <b>khóa</b> tài khoản
            </span>
            <span v-if="data.actionType==='ACTIVE'">
              được <b>mở khóa</b> tài khoản
            </span>
          </span>
          <span>
            Thời gian:
            <b>{{data.regDt}}</b>
          </span>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  name: "UserCard",
  props: {
    data: {
      required: true,
    },
  },
};
</script>

<style lang="scss">
.user-card {
  .ant-card {
    width: 500px;
    margin: 0 auto;
  }
  display: flex;
  font-size: 16px !important;
  &__extra-info {
    font-size: 16px !important;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid $line-color;
  }
  > div {
    align-self: center;
  }

  &__icon {
    text-align: center;
    margin-right: 40px;
    &--update {
      color: $warning-color;
    }
    &--delete {
      color: $danger-color;
    }
    &--insert {
      color: $success-color;
    }
    i {
      font-size: 30px;
      line-height: 55px;
    }
    width: 50px;
    height: 50px;
  }
  &__info {
    display: flex;
    flex-direction: column;
  }
}
</style>
