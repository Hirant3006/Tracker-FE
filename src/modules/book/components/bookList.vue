<template>
  <div class="book-list">
    <div class="m-b-10 book-list__header">
      <div>
        <span>Danh sách</span>
        <a-button type="primary">Tạo mới</a-button>
      </div>
      <div class="book-list__header-search m-t-10">
        <a-input-search placeholder="Nhập từ khóa" @change="onSearch" />
        <a-checkbox @change="onChange">Gồm sổ đã xóa</a-checkbox>
      </div>
    </div>
    <a-card v-for="(item,index)  in data" :key="index" hoverable @click="onSelectBook(item)">
      <div class="book-list__selected-book">
        <i :class="`fad  fa-${item.iconName ? item.iconName : 'book'}`"></i>
        <div>
          <span>{{item.name}}</span>
          <span
            :class="[,'book-list__selected-book-balance',`book-list__selected-book-balance--${item.currentBalance >0 ? 'plus' : 'minus'}`]"
          >{{`${item.currentBalance >0 ? '+' : ''}`}}{{item.currentBalance | money({currency:'vnd'})}}</span>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  name: "BookList",
  data() {
    return {
      form: {
        text: null,
        checkbox: false,
      },
    };
  },
  props: {
    data: {
      required: true,
    },
  },
  methods: {
    onSelectBook(item) {
      this.$emit("click", item.id);
    },
    onSearch(e) {
      this.form.text = e.target.value;
    },
    onChange(e) {
        this.form.checkbox = e.target.checked
    },
  },
};
</script>

<style lang="scss">
.book-list {
  &__header {
    &-search {
      display: flex;
      flex-direction: column;
      > label {
        margin-top: 5px;
        color: $danger-color;
        font-weight: 600;
      }
    }
    > div:first-child {
      span {
        font-weight: 600;
        align-self: center;
      }
      display: flex;
      justify-content: space-between;
    }
  }
  width: fit-content;
  display: flex;
  flex-direction: column;
  .ant-card {
    font-size: 18px;
    margin-bottom: 16px;
  }
  &__selected-book {
    display: flex;
    line-height: 24px;
    margin-top: 2px;
    padding: 10px;
    &-balance {
      &--minus {
        color: $danger-color;
      }
      &--plus {
        color: $success-color;
      }
    }
    > i {
      align-self: center;
      margin-right: 15px;
      font-size: 32px;
      width: 30px;
    }
    div {
      align-self: center;
      display: flex;
      flex-direction: column;
      span {
      }
    }
  }
}
</style>