<template>
    <div class="manage-book">
        <div class="m-b-20">
            <h3>Quản lí sổ</h3>
        </div>
        <div class="manage-book__content">
            <book-list :data="books" @click="onClickBook" />
            <book-info v-if="bookInfo" :data="bookInfo" />
        </div>
    </div>
</template>

<script>
import BookList from "../components/bookList";
import BookInfo from "../components/bookInfo";
export default {
    name: "Book",
    data() {
        return { bookId: null };
    },
    components: {
        BookList,
        BookInfo,
    },
    methods: {
        onClickBook(bookId) {
            this.bookId = this.bookId === bookId ? null : bookId;
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
            s;
        },
    },
};
</script>

<style lang="scss">
.manage-book {
    &__content {
        display: flex;
        justify-content: center;
        >div:nth-child(1) {
            width: 35%;
        }
        >div:nth-child(2) {
            width: 65%;
        }
    }
}
</style>