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
        :form="form"
      />
    </div>
    <div style="text-align: right"></div>
    <div class="manage-employee__no-data m-t-50" v-if="this.total == 0">
      <img class="m-b-24" src="@/assets/images/not-found.png" alt="not found" />
      <span
        v-if="this.status == 'first_time'"
        class="manage-employee__title m-b-16"
        >Chưa có nhân viên nào được tạo</span
      >
      <span
        v-else-if="this.status == 'not_first_time'"
        class="manage-employee__title m-b-16"
        >Không có dữ liệu</span
      >
    </div>
    <template v-else-if="data.length !== 0">
      <TableCustom
        :isLoading="isLoading"
        :columns="columns"
        :data-source="data"
        :scrollToBottom="onLoadMore"
        @change="onChange"
        rowKey="id"
      >
        <template slot="customBooks" slot-scope="{ itemRow }">
          <a-popover>
            <div slot="content">
              <template
                v-if="
                  itemRow.record.bookList &&
                  itemRow.record.bookList.length !== 0
                "
              >
                <div v-for="item in itemRow.record.bookList" :key="item.id">
                  <i :class="`far fa-book`"></i>&nbsp;{{ item.name }}
                </div>
              </template>
              <template v-else>Nhân viên không thuộc sổ nào</template>
            </div>
            <i :class="`far fa-info`"></i>
          </a-popover>
        </template>
        <div slot="customBlock" slot-scope="{ itemRow }">
            <a-popconfirm
              class="m-l-38"
              :title="`Bạn có muốn ${
                itemRow.record.isActive === false ? 'mở khóa' : 'khóa'
              } nhân viên này?`"
              ok-text="Yes"
              cancel-text="No"
              @confirm="
                onModUser(
                  itemRow.record.id,
                  itemRow.record.isActive === false ? 'active' : 'deactive'
                )
              "
            >
              <a-tooltip placement="bottom">
                <template v-if="itemRow.record.isActive === true" slot="title"
                  >Tài khoản đang hoạt động, Nhấn để khóa tài khoản</template
                >
                <template v-else slot="title"
                  >Tài khoản đã bị khóa, nhấn để mở khóa</template
                >
                <i
                  style="cursor: pointer"
                  class="co-danger"
                  v-if="itemRow.record.isActive === false"
                  :class="`far fa-lock`"
                ></i>
                <i
                  style="cursor: pointer"
                  class="co-success"
                  v-if="itemRow.record.isActive === true"
                  :class="`far fa-unlock`"
                ></i>
              </a-tooltip>
            </a-popconfirm>
          </div>
        <template slot="customName" slot-scope="{ itemRow }">
          <div class="manage-employee__name">
            <a-tooltip v-if="itemRow.record.isDelete">
              <template slot="title"> Nhân viên đã bị xóa</template>
              <i style="color: red" :class="`far fa-trash`"></i> </a-tooltip
            >&nbsp;
            <span :style="itemRow.record.isDelete && 'color: red'">{{
              itemRow.text
            }}</span>
          </div>
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
              title="Bạn có muốn xóa nhân viên này?"
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
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import { mapActions, mapGetters } from "vuex";
import { types as typesBook } from "@/modules/book/constant";
function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}
export default {
  name: "Employee",
  components: {
    TableCustom: () => import("@/components/TableCustom"),
    FilterHandler: () => import("../components/filter/FilterHandler"),
  },

  data() {
    return {
      locale,
      data: [],
      compKey: 0,
      isLoading: false,
      status: "first_time",
      form: {
        includeAdmin: "",
        name: "",
        title: "",
        bookID: "",
        deleteYn: "N",
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
          width: "15%",
          scopedSlots: {
            customRender: "customName",
          },
        },
        {
          title: "Khóa/mở khóa",
          scopedSlots: {
            customRender: "customBlock",
          },
        },
        {
          title: "Chức vụ",
          dataIndex: "title",
          scopedSlots: {
            customRender: "customTitle",
          },
        },
        {
          title: "Quyền",
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
    this.onGetEmployee();
  },
  methods: {
    ...mapActions({
      deleteUser: "employee/deleteUser",
      activeUser: "employee/activeUser",
      deactiveUser: "employee/deactiveUser",
      getUsers: "employee/getUsers",
    }),
    async onModUser(id, type) {
      const res =
        type === "active"
          ? await this.activeUser({ id })
          : await this.deactiveUser({ id });
      const { header } = res.data;
      if (header.isSuccessful) {
        this.data[this.data.findIndex((item) => item.id === id)].isActive =
          type === "active";
        this.$notification["success"]({
          message: `${type === "active" ? "Mở khóa" : "Khóa"} nhân viên`,
          description: `${
            type === "active" ? "Mở khóa" : "Khóa"
          } nhân viên thành công`,
          placement: "topRight",
          top: "80px",
          duration: 5,
        });
      }
    },
    async onConfirmDelete(id) {
      this.isLoadingDelete = id;
      try {
        const res = await this.deleteUser({ id });
        const { header } = res.data;
        if (header.isSuccessful) {
          this.onGetEmployee();
          this.$notification["success"]({
            message: `Xóa nhân viên`,
            description: "Xóa nhân viên thành công",
            placement: "topRight",
            top: "80px",
            duration: 5,
          });
        } else {
          this.$notification["error"]({
            message: `Xóa nhân viên`,
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
    async onGetEmployee() {
      this.isLoading = true;
      const { includeAdmin, name, title, bookID, deleteYn } = this.form;
      const { offset } = this;
      const res = await this.getUsers({
        includeAdmin,
        name,
        title,
        bookID,
        deleteYn,
      });
      const { header, data } = res.data;
      if (header.isSuccessful) {
        this.total = data.total;
        if (offset == 0) this.data = data.content;
        else this.data = [...this.data, ...data.content];
        this.compKey++;
      }
      this.isLoading = false;
    },
    onLoadMore() {
      console.log("on load more");
      if (this.data.length < this.total) {
        this.offset += 10;
        this.onGetEmployee();
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
  watch: {
    form: {
      deep: true,
      handler(val) {
        this.offset = 0;
        this.onGetEmployee();
        this.status = "not_first_time";
      },
    },
  },
};
</script>

<style lang="scss">
.co-danger {
  color: $danger-color;
}
.co-success {
  color: $success-color;
}
.manage-employee {
  &__title {
    font-weight: 600;
    font-size: 24px;
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