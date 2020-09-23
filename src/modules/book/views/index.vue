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
                @close="onCloseBook"
                :isLoadingEmp="isLoading"
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
        return { bookId: null, listEmpByBook: {}, isLoading: false };
    },
    components: {
        BookList,
        BookInfo,
    },
    methods: {
        ...mapActions({
            getBookById: "book/getBookById",
        }),
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