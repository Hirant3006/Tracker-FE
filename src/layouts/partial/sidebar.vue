<template>
    <div class="sidebar-custom">
        <a-layout-sider style="width:300px" v-model="collapsed" :trigger="null" collapsible>
            <div class="logo" />
            <a-menu
                :prefixCls="$prefixClass.menu"
                class="m-t-40"
                theme="dark"
                mode="vertical"
                :default-selected-keys="defaultSelectedKeys"
            >
                <a-menu-item v-for="item in data" :key="item.title">
                    <router-link :to="item.path">
                        <div>
                            <i :class="item.icon"></i>
                            <span class="m-l-10">{{item.title}}</span>
                        </div>
                    </router-link>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            selectedKeys: [],
            collapsed: false,
            defaultSelectedKeys: [this.$route.name]
        };
    },
};
</script>

<style lang="scss">

.sidebar-custom {
    .logo {
        height: 64px;
        background: rgba(255, 255, 255, 0.2);
        border-bottom: 1px solid rgb(232, 232, 232);
    }
    .ant-layout-sider {
        flex: 0 0 230px !important;
        max-width: 230px !important;
        min-width: 230px !important;
        width: 230px !important;
        background: #f0f4f8;
        height: 100vh;
    }
    .ant-menu-item {
        font-size: 16px;
    }
    .m-menu {
        padding: 0 16px;
        &-item-selected {
            > a {
                color: $primary-color !important;
            }
            font-weight: 600;
            border-radius: 8px;
            background-color: #dce5f4;
        }
        &-item {
            > a {
                display: block;
                color: #627d98;
            }
            i {
                font-size: 17px !important;
            }
            padding-left: 24px;
            height: 40px;
            margin-top: 4px;
            margin-bottom: 4px;
            padding: 0 16px;
            overflow: hidden;
            font-size: 16px;
            line-height: 40px;
            text-overflow: ellipsis;
        }
    }
}
</style>