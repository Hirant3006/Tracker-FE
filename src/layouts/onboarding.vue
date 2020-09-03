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
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    background-size: 100% 100%;
}
</style>
