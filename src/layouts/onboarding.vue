<template>
    <div class="onboarding-layout">
        <transition name="fade-in" mode="out-in">
            <router-view />
        </transition>
    </div>
</template>

<script>
export default {
    name: "OnboardingLayout",
};
</script>

<style lang="scss">
.onboarding-layout {
}
</style>
