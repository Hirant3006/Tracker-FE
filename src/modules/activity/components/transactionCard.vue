<template>
  <a-card class="transaction-card m-b-10">
    <div class="transaction-card-card">
      <div
        :class="[
          'transaction-card-card__icon',
          `transaction-card-card__icon--${data.actionType.toLowerCase()}`,
        ]"
      >
        <i v-if="data.actionType === 'INSERT'" :class="`far fa-plus`"></i>
        <i v-if="data.actionType === 'DELETE'" :class="`far fa-trash`"></i>
        <i v-if="data.actionType === 'UPDATE'" :class="`far fa-info`"></i>
      </div>
      <div class="transaction-card-card__info">
        <span>
          Nhân viên
          <b>{{ data.data.regNm }}</b> (ID:{{ data.data.regUserId }}) đã
          <span v-if="data.actionType === 'INSERT'">
            <b>tạo</b> giao dịch
          </span>
          <span v-if="data.actionType === 'DELETE'">
            <b>xóa</b> giao dịch
          </span>
          <span v-if="data.actionType === 'UPDATE'">
            <b>sửa</b> giao dịch
          </span>
        </span>
        <span
          >Mã GD: <b>{{ data.data.id }}</b></span
        >
        <span>
          Thời gian:
          <b>{{ data.regDt }}</b>
        </span>
      </div>
    </div>
    <div
      v-if="data.actionType === 'UPDATE'"
      class="transaction-card-card__extra-info"
    >
      <span>Nội dung thay đổi:</span>
      <template v-for="(dataType, index) in dataTypeList">
        <div
          v-if="data.data[dataType.type] !== data.oldData[dataType.type]"
          :key="'qwdwq' + index"
        >
          <span>
            -
            <span>{{ dataType.name }}: &nbsp;</span>
          </span>
          <span v-if="dataType.type === 'amount'">
            {{ data.oldData[dataType.type] | money({ currency: "vnd" }) }}
          </span>
          <span v-else>{{ data.oldData[dataType.type] }}</span>
          <i :class="`far fa-arrow-right m-l-5 m-r-5`"></i>
          <span v-if="dataType.type === 'amount'">
            {{ data.data[dataType.type] | money({ currency: "vnd" }) }}
          </span>
          <span v-else>{{ data.data[dataType.type] }}</span>
        </div>
      </template>
    </div>
    <div
      v-if="['INSERT', 'DELETE', 'MODIFY'].includes(data.actionType)"
      class="transaction-card-card__extra-info"
    >
      <span><b>Nội dung</b>:</span>
      <template v-for="(dataType, index) in dataTypeList">
        <div :key="'qwdwq' + index">
          <span>
            -
            <span
              ><b>{{ dataType.name }}</b
              >: &nbsp;</span
            >
          </span>
          <span v-if="dataType.type === 'amount'">
            {{ data.data[dataType.type] | money({ currency: "vnd" }) }}
          </span>
          <span
            v-else-if="
              data.data[dataType.type] !== undefined &&
              dataType.type === 'bookId'
            "
          >
            <template v-if="!checkNameBookByID(data.data[dataType.type])">
              <i>sổ đã bị xóa</i>
            </template>
            <template v-else>
              {{ checkNameBookByID(data.data[dataType.type]) }}
            </template>
          </span>
          <span v-else-if="dataType.type === 'type'">{{
            data.data[dataType.type] === "INCOME" ? "Thu" : "Chi"
          }}</span>
          <span v-else>{{ data.data[dataType.type] }}</span>
        </div>
      </template>
    </div>
  </a-card>
</template>

<script>
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { types as typesBook } from "@/modules/book/constant";
export default {
  name: "TransactionCard",
  data() {
    return {
      dataTypeList: [
        { type: "amount", name: "Số tiền" },
        { type: "type", name: "Loại GD" },
        { type: "bookId", name: "Sổ" },
        { type: "clientName", name: "Tên khách" },
        { type: "description", name: "Ghi chú" },
      ],
    };
  },
  props: {
    data: {
      required: true,
    },
  },
  methods: {
    checkNameBookByID(id) {
      const data = this.books.find((item) => item.id == id);
      return data ? data.name : false;
    },
  },
  computed: {
    ...mapGetters({
      books: typesBook.getters.GET_BOOKS,
    }),
  },
};
</script>

<style lang='scss'>
.transaction-card {
  margin: 0 auto;
  // width: 498px;
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
      margin:0 20px;
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