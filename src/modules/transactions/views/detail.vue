<template>
  <div>
    <i
      class="far fa-arrow-left m-b-10"
      style="text-align:left;cursor:pointer"
      @click="() => $router.go(-1)"
    >
      <span class="m-l-5">Trở về</span>
    </i>
    <a-tabs default-active-key="detail" @change="onChangeTab">
      <a-tab-pane key="detail" tab="Chi tiết">Content of Tab Pane 1</a-tab-pane>
      <a-tab-pane key="activity" tab="Hoạt động" force-render>Content of Tab Pane 2</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  name: "DetailTransaction",
  methods: {
    onChangeTab(key) {
      console.log("key");
    },
  },
};
</script>

<style>
</style>