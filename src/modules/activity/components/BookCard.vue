<template>
  <div class="book-card-activity">
    <a-card class="m-b-10" v-if="data !== undefined">
      <template v-if="data.type !== 'BOOK_WILL_PERMANENTLY_DELETED'">
        <div class="book-card-activity">
          <div
            :class="[
              'book-card-activity__icon',
              `book-card-activity__icon--${data.actionType.toLowerCase()}`,
            ]"
          >
            <i v-if="data.actionType === 'INSERT'" :class="`far fa-plus`"></i>
            <i v-if="data.actionType === 'DELETE'" :class="`far fa-trash`"></i>
            <i
              v-if="
                ['UPDATE', 'BOOK_WILL_PERMANENTLY_DELETED'].includes(
                  data.actionType
                )
              "
              :class="`far fa-info`"
            ></i>
          </div>
          <div class="book-card-activity__info">
            <template
              v-if="!['INSERT', 'DELETE', 'UPDATE'].includes(data.actionType)"
            >
              <span>
                Sổ sắp bị <b>xóa</b>, hãy vào chi tiết sổ nếu muốn khôi phục
              </span>
            </template>
            <template v-else>
              <span>
                {{ data.role === "ADMIN" ? "Quản lí" : "Nhân viên" }}
                <b>{{ data.data.regNm }}</b> (ID:{{ data.data.regUserId }}) đã
                <span v-if="data.actionType === 'INSERT'"> <b>tạo</b> sổ </span>
                <span v-if="data.actionType === 'DELETE'"> <b>xóa</b> sổ </span>
                <span v-if="data.actionType === 'UPDATE'"> <b>sửa</b> sổ </span>
              </span>
              <span>
                Thời gian:
                <b>{{ data.regDt }}</b>
              </span>
            </template>
          </div>
        </div>
        <div
          v-if="data.actionType === 'UPDATE'"
          class="book-card-activity__extra-info"
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
              <span>{{ data.oldData[dataType.type] }}</span>
              <i :class="`far fa-arrow-right m-l-5 m-r-5`"></i>
              <span>{{ data.data[dataType.type] }}</span>
            </div>
          </template>
        </div>
        <div
          v-if="
            ['INSERT', 'BOOK_WILL_PERMANENTLY_DELETED'].includes(
              data.actionType
            )
          "
          class="book-card-activity__extra-info"
        >
          <span>Nội dung:</span>
          <template v-for="(dataType, index) in dataTypeList">
            <div :key="'qwdwq' + index">
              <span>
                -
                <span>{{ dataType.name }}: &nbsp;</span>
              </span>
              <span v-if="dataType.type === 'initialBalance'">
                <b>{{
                  data.data[dataType.type] | money({ currency: "vnd" })
                }}</b>
              </span>
              <!-- <span v-else-if="dataType.type==='bookId'">
              {{
              checkNameBookByID(data.data[dataType.type])
              }}
            </span> -->
              <span v-else
                ><b>{{ data.data[dataType.type] }}</b></span
              >
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="book-card-activity">
          <div
            :class="[
              'book-card-activity__icon',
              `book-card-activity__icon--update`,
            ]"
          >
            <i :class="`far fa-info`"></i>
          </div>
          <div class="book-card-activity__info">
            <template>
              <span>
                Sổ <b>{{ data.name }}</b
                >(ID:{{ data.bookId }}) sắp bị <b>xóa</b>, hãy vào chi tiết sổ
                nếu muốn khôi phục
              </span>
            </template>
          </div>
        </div>
      </template>
    </a-card>
  </div>
</template>

<script>
export default {
  name: "BookCard",
  data() {
    return {
      dataTypeList: [
        { type: "name", name: "Tên sổ" },
        { type: "initialBalance", name: "Số dư ban đầu" },
        { type: "id", name: "Mã sổ" },
      ],
    };
  },
  props: {
    data: {
      required: true,
    },
  },
};
</script>

<style lang="scss">
.book-card-activity {
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
