<template>
  <div class="manage-book">
    <div class="m-b-20">
      <h3>Quản lí sổ</h3>
    </div>
    <div class="manage-book__content">
      <book-list
        :key="compKey"
        @requiredDeleted="onRequiredDeletedBook"
        :data="books"
        @click="onClickBook"
      />
      <book-info
        v-if="bookId"
        :data="bookInfo"
        @delete="onDeleteBook"
        @close="onCloseBook"
        :isDeletingBook="isDeletingBook"
        :listEmployees="this.listEmpByBook[bookId]"
      />
    </div>
  </div>
</template>

<script>
import BookList from "../components/bookList";
import BookInfo from "../components/bookInfo";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
export default {
  name: "Book",
  data() {
    return {
      bookId: null,
      listEmpByBook: {},
      isDeletingBook: false,
      compKey: 0,
      isRequiredDeletedBook: false,
    };
  },
  components: {
    BookList,
    BookInfo,
  },
  methods: {
    ...mapActions({
      getBook: "book/getBooks",
      deleteBook: "book/deleteBook",
      getBookById: "book/getBookById",
    }),
    async onDeleteBook() {
      this.isDeletingBook = true;
      if (this.selectedBook.id !== this.bookId && this.books.length > 1) {
        const res = await this.deleteBook({
          id: this.bookId,
        });
        console.log({ res });
        const { header, data } = res.data;
        this.isDeletingBook = false;
        if (header.isSuccessful) {
          console.log("hello");
          this.$notification["success"]({
            message: `Xóa sổ thành công`,
            description: `Sổ ${this.bookInfo.name} đã bị xóa, bạn có thể khôi phục lại trong thời gian cho phép`,
            placement: "topRight",
            top: "80px",
            duration: 5,
          });
          this.bookId = null;
          this.compKey += 1;
          this.getBook();
        }
      } else {
        this.isDeletingBook = false;
        const message =
          this.selectedBook.id === this.bookId
            ? "Xin hãy chuyển sang sổ khác trước khi xóa"
            : "Chỉ có thể xóa khi hệ thống có từ 2 sổ trở lên";
        this.$notification["error"]({
          message: `Không thể xóa sổ`,
          description: message,
          placement: "topRight",
          top: "80px",
          duration: 5,
        });
      }
    },
    async onClickBook(bookId) {
      if (this.listEmpByBook[bookId] === undefined) {
        await this.onGetBookEmpById(bookId);
      }
      this.bookId = this.bookId === bookId ? null : bookId;
    },
    async onGetBookEmpById(id) {
      this.isLoading = true;
      const res = await this.getBookById({
        id,
      });
      const { header, data } = res.data;
      this.isLoading = false;
      if (header.isSuccessful) {
        this.listEmpByBook[id] = data.users.filter(
          (item) => item.role !== "ADMIN"
        );
      } else {
      }
      this.isLoading = false;
    },
    onCloseBook() {
      this.bookId = null;
    },
    onRequiredDeletedBook(value) {
      console.log(value);
      this.isRequiredDeletedBook = value;
    },
  },
  mounted() {
    const { params } = this.$route;
    if (params.isSuccess != undefined) {
      this.getBook();
    }
  },
  computed: {
    ...mapGetters({
      selectedBook: typesBook.getters.GET_SELECTED_BOOK,
    }),
    books() {
      return this.isRequiredDeletedBook
        ? [...this.list_books, ...this.list_deleted_books]
        : this.list_books;
    },
    list_books() {
      return this.$store.state.book.books;
    },
    list_deleted_books() {
      return this.$store.state.book.delete_book;
    },
    bookInfo() {
      return this.bookId !== null
        ? this.books.find((item) => item.id == this.bookId)
        : null;
    },
  },
};
</script>

<style lang="scss">
.manage-book {
  &__content {
    display: flex;
    justify-content: center;
    > div:nth-child(1) {
      width: 35%;
    }
    > div:nth-child(2) {
      width: 65%;
    }
  }
}
</style>