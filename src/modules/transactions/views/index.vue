<template>
  <div class="manage-transactions">
    <div class="d-flex justify-content-between m-b-20">
      <h3>Quản lí giao dịch</h3>
      <a-button @click="() => $router.push($routerName.CREATE_CAMPAIGN)" type="primary">Tạo mới</a-button>
    </div>

    <a-table
      :loading="isLoading"
      :scroll="{ y: 400 }"
      :columns="columns"
      :data-source="data"
      @change="onChange"
      rowKey="id"
    >
      <template slot="CustomType" slot-scope="text,record">
        <div
          :class="[`manage-transactions__type-tag`,`manage-transactions__type-tag--${text.toLowerCase()}`]"
        >
          <span>•</span>
          &nbsp;{{text==='EXPENSE' ? 'Chi' : 'Thu' }}
        </div>
      </template>
      <template slot="CustomeRegDt" slot-scope="text,record">
        <div>{{text | formatDate}}</div>
      </template>
      <template slot="CustomStatus" slot-scope="text,record">
        <div
          :class="[`manage-transactions__type-tag`,`manage-transactions__type-tag--${record.isDelete==true ? 'deleted' : record.modiDt == record.regDt ? 'origin' :'modified' }`]"
        ><span>•</span> &nbsp;{{record.isDelete==true ? 'Đã xóa' : record.modiDt == record.regDt ? 'Nguyên bản' :'Đã sửa' }}</div>
      </template>
      <template slot="CustomAmount" slot-scope="text,record">
        <div
          :class="[`manage-transactions__money`,`manage-transactions__money--${record.type.toLowerCase()}`]"
        >{{`${text >0 ? '+' : '-'}`}}{{text | money({currency:'vnd'})}}</div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { types as typesBook } from "@/modules/book/constant";

function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}

export default {
  name: "Transactions",
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
        },
        {
          title: "Thao tác",
          dataIndex: "action",
        },
      ],
    };
  },
  mounted() {
    this.onGetTransactions();
  },
  methods: {
    ...mapActions({
      getTransactions: "transactions/getTransactions",
      getTransactionsByBook: "transactions/getTransactionsByBook",
    }),
    async onGetTransactions() {
      try {
        this.isLoading = true;
        const { id } = this.selectedBook;
        const res =
          this.selectedBook === "all"
            ? await this.getTransactions()
            : await this.getTransactionsByBook({ id });
        const { header, data } = res.data;
        if (header.isSuccessful) {
          this.data = data.content;
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