<template>
  <div class="filter-tag">
    <span>{{ type.name }}:</span>
    <template v-if="['includeAdmin', 'bookID','deleteYn'].includes(type.data_type)">
      <a-select
        placeholder="Chọn tình trạng"
        v-model="data"
        style="width: 120px"
        @change="handleChangeValue"
      >
        <a-select-option
          v-for="(item, index) in dataTypes[type.data_type]"
          :value="item.data_type"
          :key="index"
          >{{ item.name }}</a-select-option
        >
      </a-select>
    </template>
    <template v-else-if="['title', 'name'].includes(type.data_type)">
      <a-input
        placeholder="Nhập thông tin"
        :value="data"
        @change="handleChangeValue"
      />
    </template>
    <i @click="onClearFilterTag" :class="`far fa-times m-r-5`"></i>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { types as typesBook } from "@/modules/book/constant";
import debounce from "debounce";
const dataTypes = {
  includeAdmin: [
    {
      name: "Có",
      data_type: "true",
    },
    {
      name: "Không",
      data_type: "false",
    },
  ],
  bookID: [],
  deleteYn: [
    {
      name: "Có",
      data_type: "Y",
    },
    {
      name: "Không",
      data_type: "N",
    },
  ]
};
export default {
  name: "FilterTag",
  props: {
    type: {
      required: true,
    },
    defaultData: {
      require: true,
    },
  },
  data() {
    return {
      dataTypes,
      data: "",
    };
  },
  created() {
    this.dataTypes.bookID = this.books.map((item) => {
      return {
        name: item.name,
        data_type: item.id,
      };
    });
  },
  mounted() {
    this.data = this.$clone(this.defaultData);
    if (this.type.data_type === "includeAdmin") {
      this.data = "true";
      this.$emit("change", { type: this.type.data_type, value: true });
    }
  },
  methods: {
    truncNum(number, type) {
      if (isNaN(Math.trunc(number))) return 0;
      else return Math.trunc(number);
    },
    handleChangeValue: debounce(function (value) {
      if (typeof value === "object") {
        value = value.target.value;
      }
      const { type } = this;
      this.$emit("change", { type: type.data_type, value });
    }, 500),
    onClearFilterTag() {
      this.$emit("close", this.type.data_type);
    },
  },
  computed: {
    ...mapGetters({
      books: typesBook.getters.GET_BOOKS,
    }),
  },
  watch: {
    amountStart: debounce(function () {
      const { amountStart, amountEnd } = this;
      if (amountStart && amountEnd && amountStart < amountEnd) {
        this.$emit("change", {
          type: "amount",
          value: { amountStart, amountEnd },
        });
      }
    }, 500),
    amountEnd: debounce(function () {
      const { amountStart, amountEnd } = this;
      if (amountStart && amountEnd && amountStart < amountEnd) {
        console.log("hello again");
        this.$emit("change", {
          type: "amount",
          value: { amountStart, amountEnd },
        });
      }
    }, 500),
  },
};
</script>

<style lang="scss">
.filter-tag {
  .ant-input {
    width: 150px;
  }
  background: #f1f4f8;
  width: fit-content;
  padding: 8px;
  border-radius: 8px;
  font-size: 16px;
  height: 48px;
  > span {
    font-weight: 600;
    margin-right: 5px;
  }
  > i {
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>