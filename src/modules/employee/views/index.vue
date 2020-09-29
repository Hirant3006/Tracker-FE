<template>
  <div class="manage-employee">
    <div class="manage-employee__header d-flex m-b-20">
      <h3>Quản lí nhân sự</h3>
    </div>
    <div style="position: relative">
      <a-button
        style="position: absolute; right: 0; bottom: 0"
        @click="() => $router.push({ name: $routerName.CREATE_EMPLOYEE })"
        type="primary"
        >Thêm mới</a-button
      >
      <filter-handler
        @clear-all="onClearAllFilter"
        @change="onChangeFilter"
        class="m-t-10 m-b-10"
      />
    </div>
    <div style="text-align: right"></div>
    <div class="manage-employee__no-data m-t-50" v-if="this.total == 0">
      <img class="m-b-24" src="@/assets/images/not-found.png" alt="not found" />
      <span
        v-if="this.status == 'first_time'"
        class="manage-employee__title m-b-16"
        >Chưa có giao dịch nào được tạo</span
      >
      <span
        v-else-if="this.status == 'not_first_time'"
        class="manage-employee__title m-b-16"
        >Không có dữ liệu</span
      >
    </div>
    <template v-else>
      <TableCustom
        :isLoading="isLoading"
        :columns="columns"
        :data-source="data"
        :scrollToBottom="onLoadMore"
        @change="onChange"
        rowKey="id"
      >
        <template slot="customBooks" slot-scope="{ itemRow }">
          <i :class="`far fa-book`"></i>
        </template>
        <template slot="customRole" slot-scope="{ itemRow }">
          <div class="manage-employee__role">
            {{ itemRow.text === "ADMIN" ? "Quản lí" : "Nhân viên" }}
          </div>
        </template>
        <template slot="CustomAction" slot-scope="{ itemRow }">
          <div class="manage-employee__action">
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
                    itemRow.record.isDelete == true &&
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
import FilterHandler from "../components/filter/FilterHandler";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import { mapActions, mapGetters } from "vuex";
import { types as typesBook } from "@/modules/book/constant";
import TableCustom from "@/components/TableCustom";
function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}
const dummyData = [
  {
    id: 1,
    name: "Nhat Tinh Anh 2",
    title: "Nhan Vien",
    username: "anhntt",
    role: "MODERATOR",
    isActive: true,
  },
  {
    id: 2,
    name: "Nhat Tinh Anh 3",
    title: "Nhan Vien",
    username: "anhntt",
    role: "MODERATOR",
    isActive: true,
  },
  {
    id: 3,
    name: "Nhat Tinh Anh 4",
    title: "Nhan Vien",
    username: "anhntt",
    role: "ADMIN",
    isActive: true,
  },
  {
    id: 4,
    name: "Nhat Tinh Anh 5",
    title: "Nhan Vien",
    username: "anhntt",
    role: "MODERATOR",
    isActive: true,
  },
];
export default {
  name: "Employee",
  components: {
    TableCustom,
    FilterHandler,
  },
  data() {
    return {
      locale,
      data: dummyData,
      isLoading: false,
      status: "first_time",
      form: {
        role: "",
        name: "",
        books: "",
      },
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          width: "10%",
        },
        {
          title: "Tên",
          dataIndex: "name",
          width: "30%",
        },
        {
          title: "Chức vụ",
          dataIndex: "role",
          scopedSlots: {
            customRender: "customRole",
          },
        },
        {
          title: "Sổ",
          dataIndex: "books",
          scopedSlots: {
            customRender: "customBooks",
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
    // this.handleScroll(() => console.log("hello"));
    // this.onGetEmployee();
  },
  methods: {
    ...mapActions({
      getTransactions: "transactions/getTransactions",
      getTransactionsByBook: "transactions/getTransactionsByBook",
      deleteTransaction: "transactions/deleteTransaction",
    }),
    onLoadMore() {
      console.log("on load more");
      if (this.data.length < this.total) {
        this.offset += 10;
        this.onGetTransactions();
      }
    },
    onClickRow(data) {
      this.$router.push({
        name: this.$routerName.DETAIL_EMPLOYEE,
        params: {
          id: data.id,
        },
      });
    },
    onChangeFilter({ type, value }) {
      this.form[type] = value;
    },
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
    onClearAllFilter() {
      ["name", "role", "books"].map((item) => (this.form[item] = ""));
    },
    onChange,
  },
};
</script>

<style lang="scss">
.manage-employee {
  &__action {
    display: flex;
    button:nth-child(2) {
      margin-left: 8px;
    }
    button:nth-child(1) {
      padding: 0 14px;
    }
  }
  &__role {
    font-weight: 600;
  }
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