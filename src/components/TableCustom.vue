<template>
  <div :class="['custom-table']" style="min-height:50px">
    <div class="custom-table--loading" v-if="isLoading">
      <a-spin size="large"></a-spin>
    </div>
    <div :class="[$prefixClass.card + (type && `-${type}`)]" :style="isLoading && 'opacity:0.6'">
      <div v-if="$slots.title" class="custom-table__title">
        <slot name="header"></slot>
      </div>
      <div
        class="m-table-content"
        v-if="data && data.length!==0"
        :style="[$slots.title ? 'border-top: solid 1px #d9e2ec;border-bottom: solid 1px #d9e2ec;' : 'border-top:none']"
      >
        <div class="m-table-scroll">
          <div class="m-table-header m-table-hide-scrollbar" style="border-radius: 8px;">
            <table>
              <colgroup>
                <template v-for="(item,index) in columnsData">
                  <col
                    :key="index"
                    :class="item.dataIndex==='checkBox' ? 'm-table-selection-col' : ''"
                    :style="item.dataIndex==='checkBox' ? 'width: 50px; min-width: 10%;' : `width:${item.width};min-width:${item.width};`"
                  />
                </template>
              </colgroup>
              <thead class="m-table-thead">
                <tr class="m-table-row" style="border-bottom: 1px solid #d9e2ec">
                  <template v-if="checkedList && checkedList.length===0">
                    <th
                      v-for="(item,index) in columnsData"
                      :key="index"
                      :class="[item.dataIndex==='checkBox' &&'m-table-selection-column','m-table-row-cell-break-word']"
                      @click="item.sorter && onSorter(item.dataIndex)"
                    >
                      <a-checkbox
                        :checked="checkAll"
                        @change="onCheckAllChange"
                        v-if="item.dataIndex==='checkBox'"
                        style="transform: translateX(4px);"
                      />
                      <div
                        v-else
                        :class="['m-table-header-column','custom-table__column','d-flex']"
                      >
                        <div style="font-size:16px">
                          <slot
                            :name="item.slots ? item.slots.title :''"
                            v-bind:item-title="{record:item}"
                          >
                            <span>{{item.title ? item.title : ''}}</span>
                          </slot>
                        </div>
                        <!-- FILTER -->
                        <span v-if="item.sorter">
                          <template v-if="sorter.order_by===item.dataIndex">
                            <i
                              :class="`fad fa-sort-${sorter.order_type==='desc'? 'down' : 'up'} fz-12 m-l-5`"
                            ></i>
                          </template>
                          <i v-else class="fad fa-sort fz-12 m-l-5"></i>
                        </span>
                      </div>
                    </th>
                  </template>
                  <template v-else>
                    <th
                      :class="['m-table-selection-column','m-table-row-cell-break-word']"
                      style="border-bottom:none "
                    >
                      <a-checkbox :checked="checkAll" @change="onCheckAllChange" />
                    </th>
                    <th
                      :colspan="columnsData &&  columnsData.length"
                      :class="['m-table-row-cell-break-word','custom-table__checked-action']"
                      style="border-bottom:none "
                    >
                      {{checkedList && checkedList.length}} {{ $t("campaigns.table.selected") }}
                      <slot name="checkedAction"></slot>
                    </th>
                  </template>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
      <div class="m-table-body" style="max-height: 400px; overflow:auto">
        <table class="custom-table__body">
          <colgroup>
            <template v-for="(item,index) in columnsData">
              <col
                :key="index"
                :class="item.dataIndex==='checkBox' ? 'm-table-selection-col' : ''"
                :style="item.dataIndex==='checkBox' ? 'width: 50px; min-width: 10%;' : `width:${item.width};min-width:${item.width};`"
              />
            </template>
          </colgroup>
          <tbody :class="['m-table-body']">
            <tr
              :class="['custom-table__row',checkedList.includes(item.id) && 'custom-table__row--select','m-table-row-cell-break-word' ]"
              v-for="(item,index) in data"
              v-on:click.self="onClickRow(item)"
              :key="index"
            >
              <td
                v-for="(itemRow,indexRow) in columnsData"
                :key="indexRow"
                :class="[itemRow.dataIndex==='checkBox' &&'m-table-selection-column']"
              >
                <a-checkbox
                  v-if="itemRow.dataIndex==='checkBox'"
                  :checked="checkedList.includes(item.id)"
                  @change="onCheckChange(item,index)"
                  :key="compKey+itemRow.id"
                  :disabled="!!item.disabled_at"
                  style="transform: translateX(4px);"
                />
                <div v-else style="transform: translateX(4px);">
                  <slot
                    :name="itemRow.scopedSlots ? itemRow.scopedSlots.customRender :''"
                    v-bind:item-row="{dataIndex:itemRow.dataIndex,record:item,text: item[itemRow.dataIndex]}"
                  >{{ item[itemRow.dataIndex] }}</slot>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-show="total!=null && this.data.length!==0" class="m-table-body">
        <div class="wrapper-space" style="box-shadow: 0 -3px 20px 0 rgba(0, 18, 50, 0.15);">
          <table class="custom-table__footer">
            <colgroup>
              <template v-for="(item,index) in columnsData">
                <col
                  :key="index"
                  :class="item.dataIndex==='checkBox' ? 'm-table-selection-col' : ''"
                  :style="item.dataIndex==='checkBox' ? 'width: 50px; min-width: 10%;' : `width:${item.width};min-width:${item.width};`"
                />
              </template>
            </colgroup>
            <tbody v-if="total!=null">
              <tr
                :class="['custom-table__row','m-table-row-cell-break-word' ,'un-hover']"
                v-for="(item,index) in [total]"
                :key="'qwdqwd'+index"
                style="height: 64px;"
              >
                <td
                  v-for="(itemRow,indexRow) in columnsData"
                  :key="indexRow"
                  :class="[itemRow.dataIndex==='checkBox' &&'m-table-selection-column','color-text']"
                >
                  <div
                    v-if="itemRow.dataIndex==='checkBox'"
                    style="white-space: nowrap;font-size:18px;color:#2f43d7"
                    class="m-l-15"
                  >
                    Total:
                    <span style="white-space: nowrap; font-size: 16px">{{total.total}}</span>
                  </div>
                  <div v-else-if="itemRow.dataIndex==='toggle'"></div>
                  <div v-else-if="itemRow.dataIndex==='action'"></div>
                  <div v-else-if="itemRow.dataIndex==='cost'">
                    {{
                    total.cost | money({ currency: 'dolar' })
                    }}
                  </div>
                  <div style="font-size:16px" v-else-if="itemRow.dataIndex==='ctr'">
                    {{
                    total.ctr
                    }}%
                  </div>
                  <div v-else-if="itemRow.dataIndex==='revenue'">
                    {{
                    total.revenue | money({ currency: 'dolar' })
                    }}
                  </div>

                  <div
                    v-else
                    style="font-size:16px;"
                    :name="itemRow.scopedSlots ? itemRow.scopedSlots.customRender :''"
                    v-bind:item-row="{dataIndex:itemRow.dataIndex,record:item,text: item[itemRow.dataIndex]}"
                  >{{ item[itemRow.dataIndex] }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableCustom",
  data() {
    return {
      appBodyWidth: "100%",
      columnsData: [],
      indeterminate: false,
      checkAll: false,
      checkedList: [],
      compKey: 0,
      data: [],
      sorter: {
        order_by: null,
        order_type: null,
      },
    };
  },
  props: {
    total: {
      type: Object,
      default: null,
    },
    columns: {
      type: Array,
      default: [],
    },
    type: {
      type: String,
      default: null,
    },
    rowSelection: {
      type: Object,
      default: null,
    },
    dataSource: {
      type: Array,
      default: null,
    },
    scrollToBottom: {
      type: Function,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.columnsData = this.columns;
    if (
      !!this.rowSelection &&
      this.columnsData.indexOf({ dataIndex: "checkBox", width: "5px" })
    ) {
      this.columnsData.unshift({
        dataIndex: "checkBox",
      });
    }
  },
  mounted() {
    this.data = this.dataSource;
    this.scrollToBottom && this.handleScroll(this.scrollToBottom);
    // Calculate Body width and watch
  },
  methods: {
    onClickRow(data) {
      this.$emit("click-row", data);
    },
    handleScroll(func) {
      const table = document.querySelector(".m-table-body");
      table.addEventListener("scroll", async (event) => {
        let maxScroll = event.target.scrollHeight - event.target.clientHeight;
        let currentScroll = event.target.scrollTop;
        if (currentScroll > maxScroll - 1) {
          !this.isLoading && func();
        }
      });
    },
    onSorter(dataIndex) {
      if (this.sorter.order_by == dataIndex) {
        if (this.sorter.order_type == "asc") {
          this.sorter.order_type = "desc";
        } else {
          this.sorter = {
            order_by: null,
            order_type: null,
          };
        }
      } else {
        this.sorter = {
          order_by: dataIndex,
          order_type: "asc",
        };
      }
      this.$emit("sort", this.sorter.order_by ? this.sorter : null);
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        indeterminate: false,
        checkAll: e.target.checked,
      });

      if (e.target.checked) {
        // this.checkedList = this.dataSource.map(item => item.id);
        let arr = this.dataSource.filter((item) => !item.disabled_at);
        this.checkedList = arr.map((item) => item.id);
      } else this.checkedList = [];
    },
    onCheckChange(item, index) {
      if (this.checkedList.includes(item.id)) {
        this.checkedList = this.checkedList.filter(
          (itemChecked) => itemChecked !== item.id
        );
      } else this.checkedList.push(item.id);

      if (this.checkedList && this.checkedList.length !== 0) {
        Object.assign(this, {
          checkAll: true,
        });
      } else {
        Object.assign(this, {
          indeterminate: false,
          checkAll: false,
        });
      }
    },
  },
  watch: {
    checkedList() {
      this.rowSelection &&
        this.rowSelection.onChange(this.checkedList, this.checkedList);
    },
    dataSource() {
      this.data = this.dataSource;
      this.checkedList = [];
      this.indeterminate = false;
      this.checkAll = false;
    },
  },
};
</script>

<style lang="scss">
$transition-time: 0.3s;

.ant-layout.ant-layout-has-sider > .ant-layout,
.ant-layout.ant-layout-has-sider > .ant-layout-content {
  overflow-x: unset;
}
.custom-table {
  font-size: 14px !important;
  position: relative;
  &--loading {
    text-align: center;
    height: 100%;
    position: absolute;
    width: 100%;
    z-index: 1;
    & > div {
      transform: scale(1.5) translateY(200px);
      align-self: center;
      i {
        background-color: $primary-color;
      }
    }
  }
  &__title {
    padding: 15px 20px;
  }
  &__checked-action {
    text-align: left !important;
  }
  table {
    table-layout: fixed;
    width: 100%;
    thead {
      .a-checkbox-checked {
        transform: translateX(4px);
      }
    }
    th {
      white-space: nowrap;
      div {
        display: flex;
        div {
          align-self: center;
        }
      }
    }
    tr:not(:last-child) {
      border-bottom: solid 1px $line-color;
      height: 38px;
      transition: $transition-time all;
    }
    tr:hover {
      background: $background-color;
      transition: $transition-time all;
    }
    th,
    td {
      height: 56px;
      padding: 0px 16px;
      transition: $transition-time all;
      vertical-align: inherit;
    }
  }
  &__row--select {
    td:first-child {
      -webkit-box-shadow: inset 4px 0 0 0 #2f43d7;
      box-shadow: inset 4px 0 0 0 #2f43d7;
      transition: $transition-time all;
    }
  }
  &__row--header {
    border-bottom: solid 1px $line-color;
  }
}
.color-text {
  color: $text-color !important;
  font-weight: 600;
}
.un-hover:hover {
  background-color: unset !important;
}
</style>