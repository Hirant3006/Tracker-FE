<template>
  <div class="activity">
    <div class="activity__header">
      <h3>Hoạt động</h3>
      <div class="m-t-10">
        <div class="activity__loading" v-if="isLoading">
          <a-spin size="large"></a-spin>
        </div>
        <template v-for="(item,index) in data" >
            {{checkComp(item.type)}} {{index}}
            <component :is="checkComp(item.type)" :key="index" :data='item'/>
        </template>
            <!-- <user-card :key="index+'user'" v-if="item.type==='USER'" />
            <user-card :key="index+'book'" v-if="item.type==='BOOK'" :data='item'/> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
import UserCard from '../components/UserCard'
import BookCard from '../components/BookCard'
import TransactionCard from '../components/transactionCard'
export default {
  name: "Activity",
  components: {
    UserCard,
    BookCard,
    TransactionCard
  },
  data() {
    return {
      isLoading: false,
      data: null,
      data_show: [],
      dataTypeList: [
        { type: "amount", name: "Số tiền" },
        { type: "type", name: "Loại GD" },
        { type: "bookId", name: "Sổ" },
        { type: "clientName", name: "Tên khách" },
        { type: "description", name: "Ghi chú" },
      ],
    };
  },
  created() {},
  mounted() {
    this.handleGetLog();
  },
  methods: {
    ...mapActions({
      getLog: "activity/getLog",
    }),
    checkComp(type){
      if (type==='USER') return 'user-card'
      else if (type==='BOOK') return 'book-card'
      else if (type==='BOOK_TRANSACTION') return 'transaction-card'
      else null
    },
    checkNameBookByID(id) {
      return this.books.find((item) => item.id == id).name;
    },
    async handleGetLog() {
      this.isLoading = true;
      try {
        const res = await this.getLog();
        console.log({ res });
        const { header, data } = res.data;
        if (header.isSuccessful) {
          this.data = data;
        } else
          this.$notification["error"]({
            message: `Lỗi lấy thông tin`,
            description: "Có lỗi khi lấy thông tin",
            placement: "topRight",
            top: "80px",
            duration: 5,
          });
      } catch (e) {
        this.$notification["error"]({
          message: `Lỗi lấy thông tin`,
          description: e.message,
          placement: "topRight",
          top: "80px",
          duration: 5,
        });
      }
      this.isLoading = false;
    },
  },
  computed: {
    ...mapGetters({
      books: typesBook.getters.GET_BOOKS,
      profile: typesAuth.getters.GET_USER_PROFILE,
    }),
  },
};
</script>

<style lang="scss">
.activity {
  padding: 0 300px;
  &__loading {
    text-align: center;
    margin-top: 80px;
  }
}
</style>