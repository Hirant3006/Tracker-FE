<template>
    <div class="manage-book">
        <div class="m-b-20">
            <h3>Quản lí sổ</h3>
        </div>
        <div class="manage-book__content">
            <book-list :data="books" @click="onClickBook" />
            <book-info
                v-if="bookInfo"
                :data="bookInfo"
                @delete="onDeleteBook"
                @close="onCloseBook"
                :isLoadingEmp="isLoadingDeleteBook"
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
        return { bookId: null, listEmpByBook: {}, isLoadingDeleteBook: false };
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
            this.isLoadingDeleteBook = true;
            if (this.selectedBook.id !== this.bookId && this.books.length > 1) {
                const res = await this.deleteBook({
                    id: this.bookId,
                });
                console.log({ res });
                const { header, data } = res.data;
                this.isLoadingDeleteBook = false;
                if (header.isSuccessful) {
                    this.bookId = null;
                    this.getBook();
                }
            } else {
                this.isLoadingDeleteBook = false;
                const message =
                    this.selectedBook.id === this.bookId
                        ? "Xin hãy chuyển sang sổ khác trước khi xóa"
                        : "Chỉ có thể xóa khi hệ thống có từ 2 sổ trở lên";
                this.$notification["error"]({
                    message: `Không thể xóa sổ`,
                    description: this.message,
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
            console.log({ res });
            const { header, data } = res.data;
            this.isLoading = false;
            if (header.isSuccessful) {
                this.listEmpByBook[id] = data.users;
            } else {
            }
            this.isLoading = false;
        },
        onCloseBook() {
            this.bookId = null;
        },
    },
    mounted() {
        console.log(this.$state);
    },
    computed: {
        ...mapGetters({
            selectedBook: typesBook.getters.GET_SELECTED_BOOK,
        }),
        books() {
            return this.$store.state.book.books;
        },
        bookInfo() {
            return this.bookId !== null
                ? this.books.find((item) => (item.id = this.bookId))
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