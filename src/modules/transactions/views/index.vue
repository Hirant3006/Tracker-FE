<template>
  <div class="manage-transactions">
    <div class="d-flex justify-content-between m-b-20">
      <h3>Quản lí giao dịch</h3>
      <a-button
        @click="() => $router.push({name:$routerName.CREATE_TRANSACTION})"
        type="primary"
      >Tạo mới</a-button>
    </div>
    <div class="manage-transactions__no-data" v-if="this.total==0">
      <img class="m-b-24" src="@/assets/images/not-found.png" alt="not found" />
      <span class="manage-transactions__title m-b-16">Chưa có giao dịch nào được tạo</span>
    </div>
    <TableCustom
      :isLoading="isLoading"
      :columns="columns"
      :data-source="data"
      :scrollToBottom="onLoadMore"
      @change="onChange"
      rowKey="id"
      v-else
    >
      <template slot="CustomeRegDt" slot-scope="{itemRow}">
        <div>{{itemRow.text | formatDate}}</div>
      </template>
      <template slot="CustomStatus" slot-scope="{itemRow}">
        <div
          :class="[`manage-transactions__type-tag`,`manage-transactions__type-tag--${itemRow.record.isDelete==true ? 'deleted' : itemRow.record.modiDt == itemRow.record.regDt ? 'origin' :'modified' }`]"
        >
          <span>•</span>
          &nbsp;{{itemRow.record.isDelete==true ? 'Đã xóa' : itemRow.record.modiDt == itemRow.record.regDt ? 'Nguyên bản' :'Đã sửa' }}
        </div>
      </template>
      <template slot="CustomAmount" slot-scope="{itemRow}">
        <a-popover trigger="hover">
          <template slot="content">{{itemRow.record.type==='INCOME' ? 'Thu' : 'Chi'}}</template>
          <div
            :class="[`manage-transactions__money`,`manage-transactions__money--${itemRow.record.type.toLowerCase()}`]"
          >{{`${itemRow.text >0 ? '+' : '-'}`}}{{itemRow.text | money({currency:'vnd'})}}</div>
        </a-popover>
      </template>
      <template slot="CustomDescription" slot-scope="{itemRow}">
        <a-popover trigger="hover">
          <template slot="content">{{itemRow.text}}</template>
          <div class="wrap-text">{{itemRow.text}}</div>
        </a-popover>
      </template>
      <template slot="CustomAction" slot-scope="{itemRow}">
        <a-button type="danger">Xóa</a-button>
      </template>
    </TableCustom>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { types as typesBook } from "@/modules/book/constant";
import TableCustom from "@/components/TableCustom";
function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}

export default {
  name: "Transactions",
  components: {
    TableCustom,
  },
  data() {
    return {
      data: [],
      isLoading: false,
      columns: [
        {
          title: "MGD",
          dataIndex: "id",
          width: "7%",
        },
        {
          title: "Tên",
          dataIndex: "clientName",
          width: "15%",
        },
        {
          title: "Thời gian",
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
        // {
        //   title: "Loại giao dịch",
        //   dataIndex: "type",
        //   scopedSlots: {
        //     customRender: "CustomType",
        //   },
        // },
        {
          title: "Nhân viên",
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
    };
  },
  mounted() {
    this.handleScroll(() => console.log("hello"));
    this.onGetTransactions();
  },
  methods: {
    ...mapActions({
      getTransactions: "transactions/getTransactions",
      getTransactionsByBook: "transactions/getTransactionsByBook",
    }),
    handleScroll(func) {
      const table = document.querySelector(".m-table-body");
      table.addEventListener("scroll", async (event) => {
        let maxScroll = event.target.scrollHeight - event.target.clientHeight;
        let currentScroll = event.target.scrollTop;
        if (currentScroll > maxScroll - 1) {
          func();
        }
      });
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
        const { id } = this.selectedBook;
        const { offset } = this;
        const res =
          this.selectedBook === "all"
            ? await this.getTransactions({ offset })
            : await this.getTransactionsByBook({ id, offset });
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
  },
  watch: {
    selectedBook() {
      this.offset = 0;
      this.total = null;
      this.onGetTransactions();
    },
  },
};
</script>

<style lang="scss">
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