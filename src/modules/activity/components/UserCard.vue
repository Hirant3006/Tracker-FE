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
          <i :class="`far fa-user-lock`" v-if="data.type='DEACTIVE'"></i>
          <i :class="`far fa-user-unlock`" v-if="data.type='ACTIVE'"></i>
        </div>
        <div class="user-card__info">
          test
          <!-- <span>
            Nhân viên
            <b>{{record.data.regNm}}</b> (ID:{{record.data.regUserId}}) đã
            <span v-if="record.actionType==='INSERT'">
              <b>tạo</b> giao dịch
            </span>
            <span v-if="record.actionType==='DELETE'">
              <b>xóa</b> giao dịch
            </span>
            <span v-if="record.actionType==='UPDATE'">
              <b>sửa</b> giao dịch
            </span>
          </span>
          <span>
            Thời gian:
            <b>{{record.regDt}}</b>
          </span> -->
        </div>
      </div>
      <div class="user-card__extra-info">
        <span>Nội dung thay đổi:</span>
      </div>
      <!-- <div v-if="record.actionType==='INSERT'" class="user-card__extra-info">
        <span>Nội dung:</span>
        <template v-for="(dataType,index) in dataTypeList">
          <div :key="'qwdwq'+index">
            <span>
              -
              <span>{{dataType.name}}: &nbsp;</span>
            </span>
            <span v-if="dataType.type==='amount'">
              {{
              record.data[dataType.type] | money({ currency: 'vnd' })
              }}
            </span>
            <span v-else-if="dataType.type==='bookId'">
              {{
              checkNameBookByID(record.data[dataType.type])
              }}
            </span>
            <span
              v-else-if="dataType.type==='type'"
            >{{record.data[dataType.type]==='INCOME' ? 'Thu' : 'Chi'}}</span>
            <span v-else>{{record.data[dataType.type]}}</span>
          </div>
        </template>
      </div> -->
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
