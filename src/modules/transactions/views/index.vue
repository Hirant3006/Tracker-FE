<template>
  <div class="manage-transactions">
    <div class="d-flex justify-content-between m-b-20">
      <h3>Quản lí giao dịch</h3>
    </div>
    <div class="manage-transactions__date-picker">
      <a-range-picker class="m-b-10" :locale="locale" @change="onChangeDate" />
      <a-button
        class="m-l-10"
        @click="() => $router.push({ name: $routerName.CREATE_TRANSACTION })"
        type="primary"
        >Tạo mới</a-button
      >
    </div>
    <filter-handler
      :form="form"
      @clear-all="onClearAllFilter"
      @change="onChangeFilter"
      class="m-t-10 m-b-10"
    />
    <div class="manage-transactions__no-data m-t-50" v-if="this.total == 0">
      <img class="m-b-24" src="@/assets/images/not-found.png" alt="not found" />
      <span
        v-if="this.status == 'first_time'"
        class="manage-transactions__title m-b-16"
        >Chưa có giao dịch nào được tạo</span
      >
      <span
        v-else-if="this.status == 'not_first_time'"
        class="manage-transactions__title m-b-16"
      >
        Không có dữ liệu
      </span>
    </div>
    <template v-else>
      <TableCustom
        :isLoading="isLoading"
        :columns="columns"
        :data-source="data"
        :scrollToBottom="onLoadMore"
        @change="onChange"
        @click-row="onClickRow"
        rowKey="id"
      >
        <div class="manage-transactions__header" slot="header">
          <div>
            <b>Tổng:</b>
            <span
              :class="`manage-transactions__header--${
                totalDataDisplay > 0 ? 'pos' : 'neg'
              }`"
            >
              &nbsp;{{ totalDataDisplay | money({ currency: "vnd" }) }}</span
            >
          </div>
          <div><b>Số lượng:</b> {{ this.data.length }}</div>
        </div>
        <template slot="CustomeRegDt" slot-scope="{ itemRow }">
          <div>{{ itemRow.text | formatDate }}</div>
        </template>
        <template slot="CustomStatus" slot-scope="{ itemRow }">
          <div
            :class="[
              `manage-transactions__type-tag`,
              `manage-transactions__type-tag--${
                itemRow.record.isDelete == true
                  ? 'deleted'
                  : itemRow.record.modiDt == itemRow.record.regDt
                  ? 'origin'
                  : 'modified'
              }`,
            ]"
          >
            <span>•</span>
            &nbsp;{{
              itemRow.record.isDelete == true
                ? "Đã xóa"
                : itemRow.record.modiDt == itemRow.record.regDt
                ? "Nguyên bản"
                : "Đã sửa"
            }}
          </div>
        </template>
        <template slot="CustomEmp" slot-scope="{ itemRow }">
          <div>{{ itemRow.text }}(ID:{{ itemRow.record.regUserId }})</div>
        </template>
        <template slot="CustomeClientName" slot-scope="{ itemRow }">
          <div>{{ itemRow.text }}</div>
        </template>
        <template slot="CustomAmount" slot-scope="{ itemRow }">
          <a-popover trigger="hover">
            <template slot="content">{{
              itemRow.record.type === "INCOME" ? "Thu" : "Chi"
            }}</template>
            <div
              :class="[
                `manage-transactions__money`,
                `manage-transactions__money--${itemRow.record.type.toLowerCase()}`,
              ]"
            >
              {{ `${itemRow.record.type === "INCOME" ? "+" : "-"}`
              }}{{ itemRow.text | money({ currency: "vnd" }) }}
            </div>
          </a-popover>
        </template>
        <template slot="CustomDescription" slot-scope="{ itemRow }">
          <a-popover trigger="hover">
            <template slot="content">{{ itemRow.text }}</template>
            <div class="wrap-text">{{ itemRow.text }}</div>
          </a-popover>
        </template>
        <template slot="CustomAction" slot-scope="{ itemRow }">
          <div class="manage-transactions__action">
            <a-tooltip>
              <template slot="title">Chi tiết</template>
              <a-button @click="onClickRow(itemRow.record)" type="default">
                <i :class="`far fa-info`"></i>
              </a-button>
            </a-tooltip>

            <a-popconfirm
              title="Bạn có muốn xóa giao dịch này?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="onConfirmDelete(itemRow.record.id)"
            >
              <a-tooltip>
                <template slot="title">Xóa</template>
                <a-button
                  :disabled="
                    itemRow.record.isDelete == true ||
                    isLoadingDelete === itemRow.record.id
                  "
                  :loading="isLoadingDelete === itemRow.record.id"
                  type="danger"
                  style="padding: 0 12px"
                >
                  <i :class="`far fa-trash`"></i>
                </a-button>
              </a-tooltip>
            </a-popconfirm>
          </div>
        </template>
      </TableCustom>
    </template>
  </div>
</template>

<script>
import moment from "moment";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import { mapActions, mapGetters } from "vuex";
import { types as typesBook } from "@/modules/book/constant";
import TableCustom from "@/components/TableCustom";
function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}

export default {
  name: "Transactions",
  components: {
    TableCustom: () => import("@/components/TableCustom"),
    FilterHandler: () => import("../components/filter/FilterHandler"),
  },
  data() {
    return {
      locale,
      data: [],
      isLoading: false,
      status: "first_time",
      form: {
        dateStart: "",
        dateEnd: "",
        type: "",
        status: [],
        clientName: "",
        id: "",
        amountStart: "",
        amountEnd: "",
      },
      columns: [
        {
          title: "MGD",
          dataIndex: "id",
          width: "7%",
        },
        {
          title: "Tên",
          dataIndex: "clientName",
          scopedSlots: {
            customRender: "CustomeClientName",
          },
          width: "15%",
        },
        {
          title: "Ngày tạo",
          dataIndex: "regDt",
          scopedSlots: {
            customRender: "CustomeRegDt",
          },
        },
        {
          title: "Số tiền",
          dataIndex: "amount",
          scopedSlots: {
            customRender: "CustomAmount",
          },
          width: "15%",
        },
        {
          title: "Nhân viên",
          scopedSlots: {
            customRender: "CustomEmp",
          },
          dataIndex: "modiNm",
        },
        {
          title: "Tình trạng",
          dataIndex: "status",
          scopedSlots: {
            customRender: "CustomStatus",
          },
        },
        {
          title: "Ghi chú",
          dataIndex: "description",
          scopedSlots: {
            customRender: "CustomDescription",
          },
        },
        {
          title: "Thao tác",
          dataIndex: "action",
          scopedSlots: {
            customRender: "CustomAction",
          },
        },
      ],
      offset: 0,
      total: null,
      isLoadingDelete: false,
    };
  },
  mounted() {
    this.onGetTransactions();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => console.log("hello"));
  },
  methods: {
    ...mapActions({
      getBook: "book/getBooks",
      getTransactions: "transactions/getTransactions",
      getTransactionsByBook: "transactions/getTransactionsByBook",
      deleteTransaction: "transactions/deleteTransaction",
    }),
    onChangeFilter({ type, value }) {
      if (type == "amount") {
        const { amountStart, amountEnd } = value;
        this.form["amountStart"] = amountStart;
        this.form["amountEnd"] = amountEnd;
      } else this.form[type] = value;
    },
    onChangeDate(dates) {
      if (dates.length !== 0) {
        this.form.dateStart = moment(dates[0]).format("YYYY-MM-DD");
        this.form.dateEnd = moment(dates[1]).format("YYYY-MM-DD");
      } else {
        this.form.dateStart = "";
        this.form.dateEnd = "";
      }
    },
    onClickRow(data) {
      this.$router.push({
        name: this.$routerName.DETAIL_TRANSACTION,
        params: {
          id: data.id,
        },
      });
    },
    async onConfirmDelete(id) {
      this.isLoadingDelete = id;
      try {
        const deleteTransactiondata = await this.deleteTransaction({ id });
        const { header } = deleteTransactiondata.data;
        if (header.isSuccessful) {
          this.onGetTransactions();
          this.getBook();
          this.$notification["success"]({
            message: `Xóa giao dịch`,
            description: "Xóa giao dịch thành công",
            placement: "topRight",
            top: "80px",
            duration: 5,
          });
        } else {
          this.$notification["error"]({
            message: `Xóa giao dịch`,
            description: "Có lỗi xảy ra trong quá trình xóa",
            placement: "topRight",
            top: "80px",
            duration: 5,
          });
        }
      } catch (e) {
        this.$notification["error"]({
          message: `Xóa giao dịch`,
          description: e.message,
          placement: "topRight",
          top: "80px",
          duration: 5,
        });
      }
      this.isLoadingDelete = false;
    },
    onClearAllFilter() {
      ["status", "clientName", "type", "id", "amountStart", "amountEnd"].map(
        (item) => (this.form[item] = "")
      );
    },
    onLoadMore() {
      console.log("on load more");
      if (this.data.length < this.total) {
        this.offset += 10;
        this.onGetTransactions();
      }
    },
    async onGetTransactions() {
      try {
        this.isLoading = true;
        let {
          dateStart,
          dateEnd,
          amountStart,
          amountEnd,
          status,
          id: idFilter,
          clientName,
          type,
        } = this.form;
        status = status.toString();
        const { id } = this.selectedBook;
        const { offset } = this;
        const res =
          this.selectedBook === "all"
            ? await this.getTransactions({
                dateStart,
                dateEnd,
                amountStart,
                amountEnd,
                status,
                clientName,
                type,
                offset,
                id: idFilter,
              })
            : await this.getTransactionsByBook({
                id: idFilter,
                dateStart,
                dateEnd,
                amountStart,
                amountEnd,
                status,
                clientName,
                type,
                offset,
                bookId: id,
              });
        const { header, data } = res.data;
        if (header.isSuccessful) {
          this.total = data.total;
          if (offset == 0) this.data = data.content;
          else this.data = [...this.data, ...data.content];
        }
        this.isLoading = false;
      } catch (e) {}
    },
    onChange,
  },
  computed: {
    ...mapGetters({
      selectedBook: typesBook.getters.GET_SELECTED_BOOK,
    }),
    totalDataDisplay() {
      return this.data.reduce(
        (prev, cur) =>
          cur.type === "INCOME" ? prev + cur.amount : prev - cur.amount,
        0
      );
    },
  },
  watch: {
    selectedBook() {
      this.offset = 0;
      this.total = null;
      this.onGetTransactions();
    },
    form: {
      deep: true,
      handler(val) {
        this.offset = 0;
        this.onGetTransactions();
        this.status = "not_first_time";
      },
    },
  },
};
</script>

<style lang="scss">
.app-layout .ant-spin {
  transform: translateY(150px);
  height: unset !important  ;
}
.ant-table-pagination {
  display: none;
}
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
.manage-transactions {
  &__header {
    font-size: 16px;
    &--pos {
      color: #39c16c;
    }
    &--neg {
      color: #f5222d;
    }
  }
  &__date-picker {
    display: flex;
    justify-content: space-between;
  }
  &__action {
    display: flex;
    button:nth-child(2), > span {
      margin-left: 8px;
    }
    button:nth-child(1) {
      padding: 0 14px;
    }
    button {
    }
  }
  &__title {
    font-weight: 600;
    font-size: 24px;
  }
  &__sub-title {
    color: $text-color-secondary;
    font-size: 16px;
  }
  &__no-data {
    display: flex;
    flex-direction: column;
    text-align: center;
    img {
      width: 200px;
      align-self: center;
    }
  }
  &__money {
    font-size: 14px;
    font-weight: 600;
    &--expense {
      color: #f5222d;
    }
    &--income {
      color: #39c16c;
    }
  }
  &__type-tag {
    border: 1px solid #d9e2ec;
    padding: 1px 10px;
    text-align: center;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    width: fit-content;
    &--deleted {
      border-color: #f5222d;
      background: #ffdddf;
      span {
        color: #f5222d;
      }
    }
    &--origin {
      border-color: #39c16c;
      background: #e2ffed;
      span {
        color: #39c16c;
      }
    }
    &--modified {
      border-color: #faad14;
      background: #ffefd0;
      span {
        color: #faad14;
      }
    }
  }
}
</style>
