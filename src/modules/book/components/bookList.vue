<template>
  <div class="book-list">
    <div class="m-b-10 book-list__header">
      <div>
        <span>Danh sách</span>
        <a-button type="primary" @click="$router.push({name:$routerName.CREATE_BOOK})">
          <i class="far fa-plus m-r-5" />Tạo mới
        </a-button>
      </div>
      <div class="book-list__header-search m-t-10">
        <a-input-search placeholder="Nhập từ khóa" @change="onSearch" />
        <a-checkbox @change="onChange">Gồm sổ đã xóa</a-checkbox>
      </div>
    </div>
    <img
      class="m-t-24"
      :src="require('@/assets/images/not-found.png')"
      alt="not found"
      v-if="list.length===0"
    />
    <div v-else>
      <a-card
        class="m-r-10"
        v-for="(item,index) in list"
        :key="index"
        hoverable
        @click="onSelectBook(item)"
      >
        <div class="book-list__selected-book">
          <div>
            <i :class="`fad  fa-${item.iconName ? item.iconName : 'book'}`"></i>
            <div>
              <span>{{item.name}}</span>
              <span
                :class="[,'book-list__selected-book-balance',`book-list__selected-book-balance--${item.currentBalance >0 ? 'plus' : 'minus'}`]"
              >{{`${item.currentBalance >0 ? '+' : ''}`}}{{item.currentBalance | money({currency:'vnd'})}}</span>
            </div>
          </div>
          <a-tag v-if="item.isDelete" color="red">Đã xóa</a-tag>
        </div>
      </a-card>
    </div>
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
      list: [],
    };
  },
  props: {
    data: {
      required: true,
    },
  },
  mounted() {
    this.list = this.$clone(this.data);
  },
  methods: {
    onSelectBook(item) {
      console.log(item);
      this.$emit("click", item.id);
    },
    onSearch(e) {
      console.log(e.target.value);
      this.form.text = e.target.value;
      if (e.target.value)
        this.list = this.list.filter((item) =>
          item.name.includes(e.target.value)
        );
      else this.list = this.$clone(this.data);
    },
    onChange(e) {
      this.form.checkbox = e.target.checked;
      this.$emit("requiredDeleted", e.target.checked);
    },
  },
  watch: {
    data() {
      this.list = this.form.text
        ? this.$clone(this.data).filter((item) =>
            item.name.includes(this.form.text)
          )
        : this.$clone(this.data);
    },
  },
};
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.book-list {
  img {
    width: 200px;
    align-self: center;
  }
  > div:nth-child(2) {
    height: 60vh;
    overflow-y: auto;
  }
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
    justify-content: space-between;
    > span {
      height: fit-content;
    }
    > div {
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
}
</style>