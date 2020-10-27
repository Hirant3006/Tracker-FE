<template>
    <a-card class="user-card m-b-10" v-if="data !== undefined">
        <div
          :class="[
            'user-card__icon',
            data.actionType == 'DELETE' && 'user-card__icon--delete'
          ]"
        >
          <i
            :class="`far fa-sign-in-alt`"
            v-if="(data.type == 'SIGN_IN')"
          ></i>
          <i
            :class="`far fa-user-lock`"
            v-else-if="(data.actionType == 'DEACTIVATE')"
          ></i>
          <i
            :class="`far fa-times`"
            v-else-if="(data.actionType == 'DELETE')"
          ></i>
        </div>
        <div class="user-card__info">
          <span>
            Nhân viên
            <b>{{ data.name }}</b> (ID:{{ data.id }}) đã
            <span v-if="data.type === 'SIGN_IN'">
              <b>đăng nhập</b> vào hệ thống
            </span>
            <span v-if="data.actionType === 'DEACTIVATE'">
              bị <b>khóa</b> tài khoản
            </span>
            <span v-if="data.actionType === 'DELETE'"> bị <b>xóa</b> </span>
          </span>
          <span>
            Thời gian:
            <b>{{ data.regDt }}</b>
          </span>
        </div>
    </a-card>
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
  margin: 0 auto;
  width: 498px;
  .ant-card-body {
    display: flex;
  }
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
    margin: 0 20px;
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
