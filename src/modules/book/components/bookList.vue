<template>
    <div class="bookList">
        <a-card v-for="(item,index)  in data" :key="index" hoverable @click="onSelectBook(item)">
            <div class="bookList__selected-book">
                <i :class="`fad  fa-${item.iconName ? item.iconName : 'book'}`"></i>
                <div>
                    <span>{{item.name}}</span>
                    <span
                        :class="[,'bookList__selected-book-balance',`bookList__selected-book-balance--${item.currentBalance >0 ? 'plus' : 'minus'}`]"
                    >{{`${item.currentBalance >0 ? '+' : ''}`}}{{item.currentBalance | money({currency:'vnd'})}}</span>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script>
export default {
    name: "BookList",
    props: {
        data: {
            required: true,
        },
    },
    methods: {
        onSelectBook(item) {
            this.$emit("click", item.id);
        },
    },
};
</script>

<style lang="scss">
.bookList {
    width: fit-content;
    display: flex;
    flex-direction: column;
    .ant-card {
        font-size: 18px;
        margin-bottom: 16px;
    }
    &__selected-book {
        display: flex;
        line-height: 24px;
        margin-top: 2px;
        padding: 10px;
        &-balance {
            &--minus {
                color: $danger-color;
            }
            &--plus {
                color: $success-color;
            }
        }
        > i {
            align-self: center;
            margin-right: 15px;
            font-size: 32px;
            width: 30px;
        }
        div {
            align-self: center;
            display: flex;
            flex-direction: column;
            span {
            }
        }
    }
}
</style>