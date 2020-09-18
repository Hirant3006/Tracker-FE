<template>
  <div class="detail-transaction">
    <i
      class="far fa-arrow-left m-b-10"
      style="text-align:left;cursor:pointer"
      @click="() => $router.push({name:$routerName.TRANSACTIONS})"
    >
      <span class="m-l-5">Trở về</span>
    </i>
    <h2 class="m-l-8">
      <b>ID:</b>
      {{data.id}}
    </h2>
    <div v-if="id!==null && data!==null">
      <a-tabs default-active-key="detail" @change="onChangeTab">
        <a-tab-pane key="detail" tab="Chi tiết">
          <detail-transaction :data="data" />
        </a-tab-pane>
        <a-tab-pane key="activity" tab="Hoạt động" force-render>
          <div class="detail-transaction__activity"></div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
const dummyData = {
  id: 1,
  bookId: 5,
  type: "EXPENSE",
  amount: 1000000,
  clientName: "Nguyen Văn Long",
  description: "Mua 500 tấn thép",
  isDelete: false,
  regDt: "2020-09-06 13:07:25",
  regUserId: 1,
  regNm: "SYSTEM",
  modiDt: "2020-09-09 21:09:55",
  modiUserId: 2,
  modiNm: "Nhat Tinh Anh",
};
import detailTransaction from "../components/detailTransaction";
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
import { mapActions, mapGetters } from "vuex";
import TableCustom from "@/components/TableCustom";
export default {
  name: "DetailTransaction",
  components: {
    detailTransaction,
  },
  data() {
    return {
      id: null,
      data: dummyData,
      form: dummyData,
    };
  },
  created() {
    const { id } = this.$route.params;
    this.id = id;
    this.handleGetTransaction(id);
  },
  mounted() {
    console.log(this.$route);
  },
  methods: {
    ...mapActions({
      getTransactions: "transactions/getTransaction",
    }),
    async handleGetTransaction(id) {
      try {
        const res = await this.getTransactions({ id });
        const { header, data } = res.data;
        if (header.isSuccessful) {
          console.log(data);
        }
      } catch (e) {}
    },
    onChangeTab(key) {
      console.log("key");
    },
  },
};
</script>

<style lang="scss">
.detail-transaction {
  
}
</style>