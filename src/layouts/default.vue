<template>
    <a-layout class="app-layout" id="components-layout-demo-custom-trigger">
        <sidebar :data="columnData" />
        <a-layout>
            <a-layout-header
                style="background: #fff; padding: 0; border-bottom: 1px solid rgb(232 232 232);"
            ></a-layout-header>
            <a-layout-content
                :style="{ padding: '35px 8px', background: '#fff', minHeight: '280px' }"
            >
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>
import Sidebar from "./partial/sidebar";
export default {
    name: "Default",
    components: {
        Sidebar,
    },
    data() {
        return {
            columnData: [
                {
                    title: "Dashboard",
                    path: "/",
                    icon: "fas fa-bell",
                },
                {
                    title: "Transactions",
                    path: this.$routerName.TRANSACTIONS,
                    icon: "fas fa-bell",
                },
            ],
        };
    },
    methods: {
        handleClick(e) {
            console.log("click", e);
        },
        titleClick(e) {
            console.log("titleClick", e);
        },
    },
};
</script>

<style lang="scss">
#components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
 
}

.app-layout {
    min-height: 100vh;
    height: 100vh;
    font-size: 16px;
}
</style>