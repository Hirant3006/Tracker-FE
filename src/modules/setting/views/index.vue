<template>
  <div class="setting">
    <div class="setting__header">
      <h3>Cài đặt</h3>
      <div class="m-t-10">
        <a-tabs :activeKey="activeTab" @tabClick="onChangeTab">
          <a-tab-pane key="detail" tab="Tài khoản"><account-tab/> </a-tab-pane>
          <a-tab-pane key="activity" tab="Hoạt động"><activity-tab/></a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
import AccountTab from "../components/accountTab";
import ActivityTab from "../components/activityTab";
export default {
  name: "Setting",
  components: {
    AccountTab,
    ActivityTab
  },
  data() {
    return {
      activeTab: "detail",
    };
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions({}),
    onChangeTab(key) {
      console.log(key);
      if (key == "activity" && this.isModifyData) {
        this.isVisibleModalConfirm = true;
      } else this.activeTab = key;
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
.setting {
}
</style>