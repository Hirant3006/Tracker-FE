<template>
  <div class="filter-handler">
    <div v-if="isVisibleFilter" class="filter-handler__tag-group">
      <filter-tag
        class="m-b-20 m-r-20"
        v-for="(item,index) in list"
        @close="onCloseTag"
        @change="onChangeValueTag"
        :type="findFilterTypeData(item)"
        :key="index"
      />
    </div>
    <a-button v-if="list.length>0" class="m-r-10" @click="onHideFilter">
      <template v-if="isVisibleFilter==true">Ẩn &nbsp;</template>
      <template v-else>Hiện &nbsp;</template>bộ lọc
    </a-button>
    <a-dropdown>
      <a-menu slot="overlay">
        <a-menu-item
          @click="handleFilterTypeClick(item.data_type)"
          v-for="item in filterTypes"
          :key="item.data_type"
        >{{item.name}}</a-menu-item>
      </a-menu>
      <a-button class="m-r-10">
        <i :class="`far fa-plus m-r-5`"></i>
        Thêm bộ lọc
      </a-button>
    </a-dropdown>
    <a-button v-if="list.length>0" type="danger" @click="onClearAllFilter">
      <i :class="`far fa-times m-r-5`"></i>
      Xóa tất cả
    </a-button>
  </div>
</template>

<script>
import FilterTag from "./FilterTag";
const filterTypes = [
  {
    name: "Loại",
    data_type: "type",
  },
  {
    name: "Số tiền",
    data_type: "amount",
  },
  {
    name: "Trạng thái",
    data_type: "status",
  },
  {
    name: "Mã GD",
    data_type: "id",
  },
  {
    name: "Tên khách hàng",
    data_type: "clientName",
  },
];
export default {
  name: "FilterHandler",
  components: {
    FilterTag,
  },
  // props: {
  //   data: {
  //     required: true,
  //     default: {},
  //   },
  // },
  data() {
    return {
      filterTypes,
      list: ["status"],
      form: {
        type: null,
        status: null,
        id: null,
        clientName: null,
      },
      isVisibleFilter: true,
    };
  },
  methods: {
    handleFilterTypeClick(type) {
      if (!this.list.includes(type)) {
        this.list.push(type);
      }
    },
    onHideFilter() {
      this.isVisibleFilter = !this.isVisibleFilter;
    },
    onClearAllFilter() {
      this.list = [];
      this.$emit("clear-all");
    },
    onCloseTag(type) {
      this.list.splice(this.list.indexOf(type),1);
      this.$emit("change", { type, value: "" });
    },
    findFilterTypeData(type) {
      return filterTypes.find((item) => item.data_type == type);
    },
    onChangeValueTag({ type, value }) {
      this.$emit("change", { type, value });
    },
  },
};
</script>

<style lang="scss">
.filter-handler {
  &__tag-group {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>