<template>
    <div class="auth__container">DashBoard Page</div>
</template>

<script>
import { mapGetters } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";

export default {
    name: "DashBoard",
    mounted() {
        console.log('dashboard ',this.profile)
    },
    computed: {
        ...mapGetters({
            profile: typesAuth.getters.GET_USER_PROFILE
        }),
    }
};
</script>

<style lang="scss">
.auth {
   
}
</style>