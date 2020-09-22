<template>
    <div class="book-info">
        <a-card hoverable>BookInfo</a-card>
    </div>
</template>

<script>
export default {
    name: "BookInfo",
    props: {
        data: {
            required: true
        }
    }
};
</script>

<style lang="scss">
.book-info {
    width: 100%;
    margin-left: 24px;
    .ant-card {
        font-size: 18px;
    }
}
</style>