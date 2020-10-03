<template>
  <div class="detail-transaction">
    <i
      class="far fa-arrow-left m-b-10"
      style="text-align: left; cursor: pointer"
      @click="() => $router.push({ name: $routerName.EMPLOYEE })"
    >
      <span class="m-l-5">Trở về</span>
    </i>
    <h2 class="m-l-8">
      <b>Mã nhân viên: &nbsp;</b>
      {{ $route.params.id }}
    </h2>
    <div v-if="id !== null && data !== null">
      <a-tabs :activeKey="activeTab" @tabClick="onChangeTab">
        <a-tab-pane key="detail" tab="Chi tiết">
          <detail-emp :data="data" :key="compKey" @modify="onModifyData" />
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-modal
      v-model="isVisibleModalConfirm"
      title="Chưa lưu nội dung mới"
      okText="Có"
      cancelText="Không"
      @ok="onOkConfirmModal"
      @cancel="onCancelConfirmModal"
    >
      <p class="modal__content">Thông tin chỉnh sửa vẫn chưa được lưu.</p>
      <p class="modal__content">Bạn có muốn chuyển sang thẻ khác?</p>
    </a-modal>
  </div>
</template>

<script>
import detailEmp from "../components/detailEmp";
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
import { mapActions, mapGetters } from "vuex";
import TableCustom from "@/components/TableCustom";
export default {
  name: "DetailEmp",
  components: {
    detailEmp,
  },
  data() {
    return {
      id: null,
      data: null,
      form: null,
      isModifyData: false,
      isVisibleModalConfirm: false,
      activeTab: "detail",
      compKey: 0,
    };
  },
  created() {
    const { id } = this.$route.params;
    this.id = id;
    this.handleGetEmp(id);
  },
  mounted() {},
  methods: {
    ...mapActions({
      getUser: "employee/getUser",
    }),
    onModifyData(bool) {
      this.isModifyData = bool;
    },
    async handleGetEmp(id) {
      try {
        const res = await this.getUser({ id });
        const { header, data } = res.data;
        if (header.isSuccessful) {
          data.bookId = data.bookList.map((item) => item.id);
          this.data = data;
        }
      } catch (e) {}
    },
    onChangeTab(key) {
      console.log(key);
      if (key == "activity" && this.isModifyData) {
        this.isVisibleModalConfirm = true;
      } else this.activeTab = key;
    },
    onOkConfirmModal() {
      const { id } = this.$route.params;
      this.id = id;
      this.handleGetEmp(id);
      this.activeTab = "activity";
      this.isVisibleModalConfirm = false;
      this.compKey++;
    },
    onCancelConfirmModal() {
      this.activeTab = "detail";
    },
  },
};
</script>

<style lang="scss">
.modal {
  &__content {
    padding: 10px 22px;
    font-size: 16px;
  }
}
.detail-transaction {
  .ant-input-number {
    width: 150px;
  }
}
</style>