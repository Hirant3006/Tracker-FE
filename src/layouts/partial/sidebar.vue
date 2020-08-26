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
                        <div class="m-l-4" style="    margin-left: 4px;">
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
            defaultSelectedKeys: [this.$route.name],
        };
    },
};
</script>

<style lang="scss">
.sidebar-custom {
    .logo {
        height: 64px;
        border-bottom: 1px solid $line-color;
    }
    .ant-layout-sider {
        box-shadow: inset -8px 0px 40px $primary-light;
        flex: 0 0 230px !important;
        max-width: 230px !important;
        min-width: 230px !important;
        width: 230px !important;
        background: $background-color;
        height: 100vh;
    }
    .ant-menu-item {
        font-size: 16px;
    }
    .#{$menu} {
        padding: 0 16px;
        &-item-selected {
            > a {
                color: $primary-color !important;
            }
            font-weight: 600;
            border-radius: 8px;
            background-color: $primary-light;
        }
        &-item {
            > a {
                display: block;
                color: $text-color_secondary;
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