<template>
    <div class="app-auth-layout">
        <transition name="fade-in" mode="out-in">
            <router-view />
        </transition>
    </div>
</template>

<script>
export default {
    name: "Login",
};
</script>

<style lang="scss">
.app-auth-layout {
    
    min-height: 100vh;
    width: 100%;
    background-color: white;
    display: flex;
    justify-content: center;
    background-image: url("../modules/login/assets/bg-auth.png");
    background-size: 100% 100%;
}
</style>
