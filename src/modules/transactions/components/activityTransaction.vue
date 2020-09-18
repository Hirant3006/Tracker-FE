<template>
  <div v-if="data!==undefined" class="activity-trans">
    <a-card v-for="(record,index) in data" :key="index" class="m-b-10">
      <div class="activity-trans-card">
        <div
          :class="['activity-trans-card__icon',`activity-trans-card__icon--${record.actionType.toLowerCase()}`]"
        >
          <i v-if="record.actionType==='INSERT'" :class="`far fa-plus`"></i>
          <i v-if="record.actionType==='DELETE'" :class="`far fa-trash`"></i>
          <i v-if="record.actionType==='UPDATE'" :class="`far fa-info`"></i>
        </div>
        <div class="activity-trans-card__info">
          <span>
            Nhân viên
            <b>{{record.data.regNm}}</b> đã
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
          </span>
        </div>
      </div>
      <div v-if="record.actionType==='UPDATE'" class="activity-trans-card__extra-info">
        <span>Nội dung thay đổi:</span>
        <template v-for="(dataType,index) in dataTypeList">
          <div
            v-if="record.data[dataType.type]!==record.oldData[dataType.type]"
            :key="'qwdwq'+index"
          >
            <span>
              -
              <span>{{dataType.name}}: &nbsp;</span>
            </span>
            <span v-if="dataType.type==='amount'">
              {{
              record.oldData[dataType.type] | money({ currency: 'vnd' })
              }}
            </span>
            <span v-else>{{record.oldData[dataType.type]}}</span>
            <i :class="`far fa-arrow-right m-l-5 m-r-5`"></i>
            <span v-if="dataType.type==='amount'">
              {{
              record.data[dataType.type] | money({ currency: 'vnd' })
              }}
            </span>
            <span v-else>{{record.data[dataType.type]}}</span>
          </div>
        </template>
      </div>
      <div v-if="record.actionType==='INSERT'" class="activity-trans-card__extra-info">
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
      </div>
    </a-card>
  </div>
</template>

<script>
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
import { mapActions, mapGetters } from "vuex";
import dummyData from "./dummyActivityData";
export default {
  name: "ActivityTab",
  data() {
    return {
      data: null,
      dataTypeList: [
        { type: "amount", name: "Số tiền" },
        { type: "type", name: "Loại GD" },
        { type: "bookId", name: "Sổ" },
        { type: "clientName", name: "Tên khách" },
        { type: "description", name: "Ghi chú" },
      ],
    };
  },
  created() {
    const { id } = this.$route.params;
    console.log("id ", id);
    this.handleGetLogTransaction(id);
  },
  methods: {
    ...mapActions({
      getLogTransaction: "transactions/getLogTransaction",
    }),
    async handleGetLogTransaction(id) {
      const res = await this.getLogTransaction({ id });
      const { header, data } = res.data;
      if (header.isSuccessful) {
        this.data = data;
      }
    },
    checkNameBookByID(id) {
      return this.books.find((item) => item.id == id).name;
    },
  },
  computed: {
    ...mapGetters({
      books: typesBook.getters.GET_BOOKS,
    }),
  },
};
</script>

<style lang="scss">
.activity-trans {
  .ant-card {
    width: 500px;
    margin: 0 auto;
  }
  &-card {
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
}
</style>