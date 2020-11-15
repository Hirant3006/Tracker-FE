<template>
  <div class="activity">
    <div class="activity__header">
      <div class="activity__title m-b-8">
        <h3>Hoạt động</h3>
        <a-popover placement="topLeft" v-if="data_warning_delete_book.length">
          <div class="activity__title-content" slot="content">
            <component
              v-for="(item, index) in data_warning_delete_book"
              :is="checkComp(item.type)"
              :key="index + 'warning'"
              :data="$clone(item)"
            />
          </div>
          <a-badge
            :dot="data_warning_delete_book.length"
          >
            <a >Cảnh báo</a>
          </a-badge>
        </a-popover>
      </div>
      <div class="activity__waning-activity"></div>
      <div class="m-t-10">
        <div class="activity__loading" v-if="isLoading">
          <a-spin size="large"></a-spin>
        </div>
        <component
          v-for="(item, index) in data"
          :is="checkComp(item.type)"
          :key="index"
          :data="$clone(item)"
        />
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
import UserCard from "../components/UserCard";
import BookCard from "../components/BookCard";
import TransCard from "../components/TransCard";
export default {
  name: "Activity",
  components: {
    UserCard,
    BookCard,
    TransCard,
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
      data_warning_delete_book: [],
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
    checkComp(type) {
      if (type === "USER" || type == "SIGN_IN") return "user-card";
      else if (type === "BOOK" || type === "BOOK_WILL_PERMANENTLY_DELETED")
        return "book-card";
      else if (type === "BOOK_TRANSACTION") return "trans-card";
      else null;
    },
    checkNameBookByID(id) {
      return this.books.find((item) => item.id == id).name;
    },
    async handleGetLog() {
      this.isLoading = true;
      try {
        const res = await this.getLog();
        console.log({ data: res.data.data });
        const { header, data } = res.data;
        if (header.isSuccessful) {
          this.data_warning_delete_book = data.filter(
            (item) => item.type === "BOOK_WILL_PERMANENTLY_DELETED"
          );
          this.data = data.filter(
            (item) => item.type !== "BOOK_WILL_PERMANENTLY_DELETED"
          );
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
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-content {
      color: yellow;
    }
  }
  position: relative;
  &__waning-activity {
  }
  padding: 0 300px;
  &__loading {
    text-align: center;
    margin-top: 80px;
  }
}
</style>