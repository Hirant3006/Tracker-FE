<template>
  <div class="activity">
    <div class="activity__header">
      <h3>Hoạt động</h3>
      <div class="m-t-10">
       
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
export default {
  name: "Activity",
  components: {
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
}
</style>