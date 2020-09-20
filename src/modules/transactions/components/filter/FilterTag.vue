<template>
  <div class="filter-tag">
    <span>{{type.name}}:</span>
    <template v-if="['status','type'].includes(type.data_type)">
      <a-select
        placeholder="Chọn tình trạng"
        v-model="data"
        style="width: 120px"
        @change="handleChangeValue"
      >
        <a-select-option
          v-for="(item,index) in dataTypes[type.data_type]"
          :value="item.data_type"
          :key="index"
        >{{item.name}}</a-select-option>
      </a-select>
    </template>
    <template v-else-if="['id','clientName'].includes(type.data_type)">
      <a-input placeholder="Nhập thông tin" @change="handleChangeValue" />
    </template>
    <template v-else>
      <a-input-number
        :default-value="amountStart"
        style=" width: 200px; text-align: center"
        :formatter="value => ` ${truncNum(value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
        @change="value => value!==null ? amountStart=value : amountStart=0"
        :min="0"
        placeholder="Nhỏ nhất"
      ></a-input-number>
      <a-input
        @change="handleChangeAmountEnd"
        style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
        placeholder="~"
        disabled
      />
      <a-input-number
        :default-value="amountEnd"
        style="width: 200px; text-align: center; border-left: 0"
        :formatter="value => ` ${truncNum(value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
        @change="value => value!==null ? amountEnd=value : amountEnd=0"
        :min="0"
        placeholder="Lớn nhất"
      ></a-input-number>
    </template>
    <i @click="onClearFilterTag" :class="`far fa-times m-r-5`"></i>
  </div>
</template>

<script>
import debounce from "debounce";
const dataTypes = {
  status: [
    {
      name: "Nguyên bản",
      data_type: "NORMAL",
    },
    {
      name: "Đã sửa",
      data_type: "MODIFIED",
    },
    {
      name: "Đã xóa",
      data_type: "DELETED",
    },
  ],
  type: [
    {
      name: "Chi",
      data_type: "EXPENSE",
    },
    {
      name: "Thu",
      data_type: "INCOME",
    },
  ],
};
export default {
  name: "FilterTag",
  props: {
    type: {
      required: true,
    },
  },
  data() {
    return {
      dataTypes,
      data: "",
      amountStart: "",
      amountEnd: "",
    };
  },
  created() {
    if (this.type.data_type === "status") {
      this.data = "NORMAL";
      this.$emit("change", { type: this.type.data_type, value: "NORMAL" });
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
    handleChangeAmountStart: debounce(function (e) {
      this.amountStart = e.target.value;
      const { amountStart, amountEnd } = this;
      if (amountStart && amountEnd) {
        this.$emit("change", { type: "amountStart", amountStart });
        this.$emit("change", { type: "amountEnd", amountEnd });
      }
    }, 500),
    handleChangeAmountEnd: debounce(function (e) {
      this.amountEnd = e.target.value;
      const { amountStart, amountEnd } = this;
      if (amountStart && amountEnd) {
        this.$emit("change", { type: "amountStart", amountStart });
        this.$emit("change", { type: "amountEnd", amountEnd });
      }
    }, 500),
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
      console.log("hello");
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