<template>
  <a-layout class="app-layout" id="components-layout-demo-custom-trigger">
    <sidebar
      :data="profile.role === 'ADMIN' ? columnDataAdmin : columnDataMod"
    />
    <a-layout>
      <a-layout-header
        style="
          background: #fff;
          padding: 0;
          border-bottom: 1px solid rgb(232 232 232);
        "
      >
        <div
          :class="[
            'app-layout__header',
            !isShowDropDown && 'app-layout__header--hide-dropdown',
          ]"
        >
          <a-dropdown v-if="isShowDropDown">
            <span
              class="ant-dropdown-link"
              style="cursor: pointer"
              @click="e => e.preventDefault()"
            >
              <div
                class="app-layout__selected-book app-layout__selected-book--card"
                v-if="typeof selectedBook === 'object'"
              >
                <i
                  :class="
                    `far fa-${
                      selectedBook.iconName ? selectedBook.iconName : 'book'
                    }`
                  "
                ></i>
                <div>
                  <span>{{ selectedBook.name }}</span>
                  <span
                    v-if="profile.role === 'ADMIN'"
                    :class="[
                      ,
                      'app-layout__selected-book-balance',
                      `app-layout__selected-book-balance--${
                        selectedBook.currentBalance > 0 ? 'plus' : 'minus'
                      }`,
                    ]"
                    >{{ `${selectedBook.currentBalance > 0 ? "+" : ""}`
                    }}{{
                      selectedBook.currentBalance | money({ currency: "vnd" })
                    }}</span
                  >
                  <span v-else :class="[, 'app-layout__selected-book-balance']"
                    >--</span
                  >
                </div>
              </div>
              <div
                class="app-layout__selected-book app-layout__selected-book--card"
                v-else-if="profile.role === 'ADMIN'"
              >
                <i :class="`far fa-globe`"></i>
                <div>
                  <span>Tất cả</span>
                  <span
                    :class="[
                      ,
                      'app-layout__selected-book-balance',
                      `app-layout__selected-book-balance--${
                        totalBalance > 0 ? 'plus' : 'minus'
                      }`,
                    ]"
                    >{{ `${totalBalance >= 0 ? "+" : ""}`
                    }}{{ totalBalance | money({ currency: "vnd" }) }}</span
                  >
                </div>
              </div>
            </span>
            <a-menu slot="overlay">
              <a-menu-item
                key="-1"
                @click="onSelectBook('all')"
                v-if="profile.role === 'ADMIN'"
              >
                <div class="app-layout__selected-book">
                  <i :class="`far fa-globe`"></i>
                  <div>
                    <span>Tất cả</span>
                    <span
                      :class="[
                        ,
                        'app-layout__selected-book-balance',
                        `app-layout__selected-book-balance--${
                          totalBalance > 0 ? 'plus' : 'minus'
                        }`,
                      ]"
                      >{{ `${totalBalance > 0 ? "+" : ""}`
                      }}{{ totalBalance | money({ currency: "vnd" }) }}</span
                    >
                  </div>
                </div>
              </a-menu-item>
              <a-menu-item
                v-for="(item, index) in books"
                :key="index"
                @click="onSelectBook(item)"
              >
                <div class="app-layout__selected-book">
                  <i
                    :class="`far fa-${item.iconName ? item.iconName : 'book'}`"
                  ></i>
                  <div>
                    <span>{{ item.name }}</span>
                    <span
                      v-if="profile.role === 'ADMIN'"
                      :class="[
                        ,
                        'app-layout__selected-book-balance',
                        `app-layout__selected-book-balance--${
                          item.currentBalance > 0 ? 'plus' : 'minus'
                        }`,
                      ]"
                      >{{ `${item.currentBalance > 0 ? "+" : ""}`
                      }}{{
                        item.currentBalance | money({ currency: "vnd" })
                      }}</span
                    >
                    <span v-else> -- </span>
                  </div>
                </div>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-dropdown>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">{{
              profile.username
            }}</a>
            <a-menu slot="overlay">
              <a-menu-item key="0" @click="logout">
                <i class="far fa-sign-out-alt"></i>
                &nbsp;
                <span>Đăng xuất</span>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content
        :key="compKey"
        :style="{ padding: '35px 8px', background: '#fff', minHeight: '280px' }"
      >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
import Sidebar from "./partial/sidebar";
export default {
  name: "Default",
  components: {
    Sidebar,
  },
  data() {
    return {
      spinning: true,
      compKey: 0,
      columnDataMod: [
        // {
        //   title: "Trang chủ",
        //   path: "/",
        //   icon: "fas fa-bell",
        // },
        {
          title: "Giao dịch",
          path: "/transaction",
          icon: "fas fa-cash-register",
        },
        {
          title: "Hoạt động",
          path: "/activity",
          icon: "fas fa-exclamation-circle",
        },
        {
          title: "Cài đặt",
          path: "/setting",
          icon: "fas fa-cog",
        },
      ],
      columnDataAdmin: [
        {
          title: "Trang chủ",
          path: "/",
          icon: "fas fa-bell",
        },
        {
          title: "Giao dịch",
          path: "/transaction",
          icon: "fas fa-cash-register",
        },
        {
          title: "Sổ",
          path: "/book",
          icon: "fas fa-book",
        },
        {
          title: "Nhân sự",
          path: "/employee",
          icon: "fas fa-users",
        },
        {
          title: "Hoạt động",
          path: "/activity",
          icon: "fas fa-exclamation-circle",
        },
        {
          title: "Cài đặt",
          path: "/setting",
          icon: "fas fa-cog",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    ...mapActions({
      logout: "auth/logout",
      selectBook: "book/setSelectedBook",
    }),
    ...mapMutations({}),
    handleClick(e) {
      console.log("click", e);
    },
    titleClick(e) {
      console.log("titleClick", e);
    },
    onSelectBook(data) {
      console.log({ data });
      this.selectBook(data !== "all" ? data : "all");
      // this.$router.go();
    },
  },
  computed: {
    ...mapGetters({
      profile: typesAuth.getters.GET_USER_PROFILE,
      books: typesBook.getters.GET_BOOKS,
      selectedBook: typesBook.getters.GET_SELECTED_BOOK,
    }),
    isShowDropDown() {
      return ["Transactions", "Book"].includes(this.$route.name);
    },
    totalBalance() {
      return this.books !== null
        ? this.books.reduce((prev, cur) => {
            return prev + cur.currentBalance;
          }, 0)
        : 0;
    },
    selectedBook() {
      const selected_book = this.$store.state.book.selected;
      return typeof selected_book === "string" && selected_book !== "all"
        ? JSON.parse(selected_book)
        : selected_book;
    },
  },
  watch: {
    selectedBook(oldVal, newVal) {
      if (oldVal.id !== newVal.id) {
        this.compKey += 1;
        this.$notification["info"]({
          message: `Chuyển sổ`,
          description: "Bạn vừa chuyển sang sổ khác.",
          placement: "topRight",
          top: "80px",
          duration: 5,
        });
        this.books !== null
          ? this.books.reduce((prev, cur) => prev + cur.currentBalance, 0)
          : 0;
      }
    },
    // selectedBook() {
    //   const selected_book = this.$store.state.book.selected;
    //   console.log(selected_book);
    //   return typeof selected_book === "string" && selected_book !== "all"
    //     ? JSON.parse(selected_book)
    //     : selected_book;
    // },
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

.app-layout {
  .ant-layout-content {
    overflow-y: auto;
    padding: 36px 24px !important;
  }
  .ant-spin {
    height: 500px;
  }
  min-height: 100vh;
  height: 100vh;
  font-size: 16px;
  &__selected-book {
    display: flex;
    line-height: 24px;
    margin-top: 2px;
    &--card {
      padding: 5px;
      border: 1px solid $line-color;
      border-radius: 8px;
    }

    &-balance {
      &--minus {
        color: $danger-color;
      }
      &--plus {
        color: $success-color;
      }
    }
    > i {
      align-self: center;
      margin-right: 16px;
      font-size: 24px;
    }
    div {
      align-self: center;
      display: flex;
      flex-direction: column;
      span {
      }
    }
  }
  &__header {
    &--hide-dropdown {
      justify-content: flex-end;
    }
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
