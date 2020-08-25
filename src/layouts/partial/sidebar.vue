<template>
    <div class="sidebar-custom">
        <a-layout-sider style="width:300px" v-model="collapsed" :trigger="null" collapsible>
            <div class="logo" />
            <a-menu
                :prefixCls="$prefixClass.menu"
                class="m-t-40"
                theme="dark"
                mode="vertical"
                :default-selected-keys="['1']"
            >
                <a-menu-item v-for="(item,index) in data" :key="index">
                    <router-link :to="item.path">
                        <div>
                            <i :class="item.icon"></i>
                            <span>{{item.title}}</span>
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
            collapsed: false,
        };
    },
};
</script>

<style lang="scss">
.sidebar-custom {
    .ant-layout-sider {
        flex: 0 0 230px !important;
        max-width: 230px !important;
        min-width: 230px !important;
        width: 230px !important;
        height: 100vh;
    }
    .ant-menu-item {
        font-size: 16px;
    }
    .#{$sidebar} {
        .#{$navigation} {
            flex: 1;
            overflow: overlay;
            margin-top: 32px;
            margin-bottom: 10px;
            @include scroll-bar;
            a {
                text-decoration: none !important;
            }
        }
    }
    .#{$menu} {
        &-submenu {
            .m-menu-open,
            .m-menu-selected {
                .m-menu-submenu-title {
                    .anticon.m-menu-icon,
                    .m-menu-text {
                        color: $primary-color;
                        font-weight: $font-weight-semibold;
                    }
                }
            }
        }
    }
    $sidebar-bg-color: #f0f4f8;
    .#{$molecule}-sidebar {
        height: 100vh;
        position: relative;
        @include noselect;
        background: $sidebar-bg-color;
        font-size: $font-size;
        &-footer {
            position: sticky;
            bottom: 0;
        }
        .#{$menu}-item.menu-divider {
            background: $line-color;
            height: 1px;
        }
        &:not(.breakpointed) {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            width: 230px;
            .a-logo,
            .m-navigation {
                padding: 0 16px;
            }
        }
        &-logo {
            padding: 6px;
            max-height: 100%;
            max-width: 100%;
        }
        .a-logo-image {
            text-align: center;
            padding: 12px;
        }
        .#{$menu} {
            background: none;
            border-right-color: transparent;
            overflow-x: hidden;
            .#{$menu}-submenu > .#{$menu} {
                background: transparent;
            }
            .#{$menu}-submenu-selected {
                .sub-menu-title {
                    font-weight: $font-weight-semibold;
                }
            }
            // .#{$menu}-submenu-open {
            //   .#{$menu}-submenu-title {
            //     .anticon.m-menu-icon, .m-menu-text {
            //       color: $primary-color;
            //       font-weight: $font-weight-semibold;
            //     }
            //   }
            // }
            .#{$menu}-item > a,
            .sub-menu-title {
                display: flex;
                align-items: center;
            }
            .#{$menu}-item.#{$menu}-item-active {
                > a {
                    color: unset;
                }
            }
            .#{$menu}-item.#{$menu}-item-selected {
                font-weight: $font-weight-semibold;
                border-radius: 8px;
                &::after {
                    content: none;
                }
            }
        }
    }
    .#{$molecule}-sidebar.breakpointed {
        display: flex;
        flex-direction: row;
        background: none;
        .#{$molecule}-navigation-menu-breakpoint-wrapper {
            background: $sidebar-bg-color;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            width: 88px;
        }
        .#{$molecule}-sidebar-footer-sm {
            cursor: pointer;
        }
        .#{$molecule}-sidebar-logo-image {
            text-align: center;
            padding: 12px;
            img {
                width: 40px;
            }
        }
    }
    .#{$navigation}-menu-breakpoint {
        display: flex;
        flex-direction: row;
        &-list {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 16px;
            &-item {
                margin-bottom: 8px;
                .route-button {
                    @include no-focus-style;
                    color: $text-color-secondary;
                    background: none;
                    border: none;
                    box-shadow: none;
                    padding: 0;
                    height: unset;
                    &:active,
                    &:focus {
                        background: none;
                    }
                    &.active {
                        color: $primary-color;
                    }
                    a {
                        width: 56px;
                        height: 40px;
                        padding: 0;
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 8px;
                        &.router-link-exact-active {
                            background-color: $primary-light;
                            .#{$menu}-icon {
                                color: $primary-color;
                            }
                        }
                    }
                }
            }
        }
        &-subs {
            background: $primary-light;
            transition: width 300ms cubic-bezier(0.2, 0, 0, 1) 0s;
            width: 0;
            padding-top: calc(32px + 65px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            &.active {
                width: 230px;
                box-shadow: inset 2px 0 9px -7px rgba(0, 0, 0, 0.4);
            }
            ul.sub-menu-list {
                @include scroll-bar;
                padding-left: 16px;
                padding-right: 16px;
                flex: 1;
                overflow-y: overlay;
                li.sub-menu-item {
                    a.route-link {
                        display: block;
                        margin-bottom: 8px;
                        height: 40px;
                        padding: 0 16px;
                        line-height: 40px;
                        border-radius: $border-radius;
                        color: $text-color;
                        font-size: $font-size;
                        font-weight: $font-weight-semibold;
                        @include no-focus-style;
                        &.router-link-exact-active {
                            background: $text-color;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
    .collapse-action-button {
        position: absolute;
        right: -10px;
        top: 50%;
        transform: translate(0, -50%);
        z-index: 11;
        width: 20px;
        &__caret {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .breakpoint-menu-tooltip {
        .m-tooltip-inner {
            font-size: $font-size;
            padding: 3px 16px;
        }
    }
    .#{$logo} {
        height: $header-height;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Poppins;
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        background: $background-color;

        &:after {
            content: "";
            background-color: #e8e8e8;
            width: 100%;
            height: 1px;
            position: absolute;
            bottom: 0;
            left: 0;
        }

        &-image {
            img {
                max-width: 100%;
                max-height: 100%;
                width: 40px;
                min-width: 40px;
                height: 40px;
                border-radius: 50%;
                min-height: 40px;
                background-color: $primary-color;
            }
        }

        &-text {
            @include text-one-line;
            color: $primary-color;
            font-style: normal;
            font-weight: bold;
            font-size: 24px;
        }
    }

    .app-directory-icon {
        display: block;
        position: absolute;
        top: 20px;
        right: 20px;
        width: 10px;
        height: 10px;
    }

    .app-directory-icon span {
        display: block;
        width: 100%;
        height: 100%;
        background: transparent;
        border-radius: 50%;
        cursor: pointer;
        outline: none;
        position: relative;
    }

    .app-directory-icon span:before {
        content: "";
        display: block;
        min-width: 14px;
        min-height: 14px;
        border-radius: 50%;
        border: 1px solid #00c35c;
        animation: wave-pulse-new 2.4s infinite;
        opacity: 0;
    }

    .app-directory-icon span:after {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 2px;
        left: 2px;
        border-radius: 50%;
        background-color: #00c35c;
        animation: ring-pulse 2.4s infinite;
        opacity: 0;
    }

    @keyframes wave-pulse-new {
        0% {
            -webkit-transform: scale(2);
            transform: scale(2);
            opacity: 1;
        }

        to {
            opacity: 0.9;
        }

        40% {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1);
        }

        80% {
            opacity: 0.9;
        }

        to {
            -webkit-transform: scale(2);
            transform: scale(2);
            opacity: 1;
        }
    }

    @keyframes ring-pulse {
        0% {
            -webkit-transform: scale(2);
            transform: scale(2);
            opacity: 1;
        }

        to {
            opacity: 0.9;
        }

        40% {
            opacity: 1;
            -webkit-transform: scale(0);
            transform: scale(0);
        }

        80% {
            opacity: 0.9;
        }

        to {
            -webkit-transform: scale(2);
            transform: scale(2);
            opacity: 1;
        }
    }
    $app-sidebar-collapse-width: 80px !default;
    @media (max-width: $app-collapse-breakpoint) {
        .app-layout__sidebar {
            width: $app-sidebar-collapse-width;
            .a-logo-text {
                display: none;
            }
        }
    }
    @media (max-width: $app-collapse-breakpoint) {
        .app-layout {
            &__sidebar {
                width: auto !important;
                .#{$sidebar} {
                    &.breakpointed {
                        display: flex;
                        flex-direction: row;
                    }
                }
            }
        }
    }
}
</style>