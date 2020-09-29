<template>
  <div class="manage-employee">
    <div class="manage-employee__header d-flex m-b-20">
      <h3>Quản lí nhân sự</h3>
    </div>
    <div style="text-align: right">
      <a-button
        class="m-l-10"
        @click="() => $router.push({ name: $routerName.CREATE_EMPLOYEE })"
        type="primary"
        >Thêm mới</a-button
      >
    </div>
  </div>
</template>

<script>
import moment from "moment";
// import FilterHandler from "../components/filter/FilterHandler";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import { mapActions, mapGetters } from "vuex";
import { types as typesBook } from "@/modules/book/constant";
function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}

export default {
  name: "Employee",
  components: {
    // TableCustom,
    // FilterHandler,
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
        status: "NORMAL",
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
      isLoadingDelete: false,
    };
  },
  mounted() {},
  methods: {
    ...mapActions({
      getTransactions: "transactions/getTransactions",
      getTransactionsByBook: "transactions/getTransactionsByBook",
      deleteTransaction: "transactions/deleteTransaction",
    }),
  },
};
</script>

<style lang="scss">
.manage-employee {
}
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
</style>