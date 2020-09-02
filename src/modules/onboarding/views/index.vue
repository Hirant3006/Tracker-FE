<template>
    <div class="onboarding">Onboarding Page</div>
</template>

<script>
import { mapGetters } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
export default {
    name: "Onboarding",
    mounted(){
        console.log(this.profile)
    },
    computed: {
        ...mapGetters({
            profileType: typesAuth.getters.GET_USER_PROFILE
        }),
        profile() {
            return this.$store.state.auth
        }
    },
    
};
</script>

<style lang="scss">
.onboarding {
   height: 100%;    
}
</style>