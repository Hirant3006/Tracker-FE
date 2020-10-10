<template>
  <div class="dashboard">
    <div class="dashboard__header d-flex m-b-20">
      <h3>Thống kê</h3>
    </div>
    <div class="dashboard__filter">
      <a-dropdown>
        <span
          class="ant-dropdown-link"
          style="cursor: pointer"
          @click="(e) => e.preventDefault()"
        >
          <div
            style="justify-content: space-between"
            class="d-flex justify-space-between dashboard__selected-book dashboard__selected-book--card"
            v-if="!form.book"
          >
            <span class="dashboard__selected-book-title m-r-10">Chọn sổ</span>
            <i v-if="profile.role == 'ADMIN'" :class="`far fa-angle-down`"></i>
          </div>
          <div
            class="dashboard__selected-book dashboard__selected-book--card"
            v-else-if="form.book === 'all'"
          >
            <i :class="`far fa-globe`"></i>
            <div>
              <span>Tất cả</span>
              <span
                :class="[
                  ,
                  'dashboard__selected-book-balance',
                  `dashboard__selected-book-balance--${
                    totalBalance > 0 ? 'plus' : 'minus'
                  }`,
                ]"
                >{{ `${totalBalance >= 0 ? "+" : ""}`
                }}{{ totalBalance | money({ currency: "vnd" }) }}</span
              >
            </div>
            <i style="margin-left: 30px" :class="`far fa-angle-down`"></i>
          </div>
          <div
            v-else
            class="dashboard__selected-book dashboard__selected-book--card"
          >
            <i
              :class="`far fa-${
                form.book.iconName ? form.book.iconName : 'book'
              }`"
            ></i>
            <div>
              <span>{{ form.book.name }}</span>
              <span
                :class="[
                  'dashboard__selected-book-balance',
                  `dashboard__selected-book-balance--${
                    form.book.currentBalance > 0 ? 'plus' : 'minus'
                  }`,
                ]"
                >{{ `${form.book.currentBalance > 0 ? "+" : "-"}`
                }}{{
                  form.book.currentBalance | money({ currency: "vnd" })
                }}</span
              >
            </div>
            <i style="margin-left: 30px" :class="`far fa-angle-down`"></i>
          </div>
        </span>
        <a-menu slot="overlay">
          <a-menu-item key="-1" @click="onSelectBook('all')">
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
            <div class="dashboard__selected-book">
              <i
                :class="`far fa-${item.iconName ? item.iconName : 'book'}`"
              ></i>
              <div>
                <span>{{ item.name }}</span>
                <span
                  :class="[
                    ,
                    'dashboard__selected-book-balance',
                    `dashboard__selected-book-balance--${
                      item.currentBalance > 0 ? 'plus' : 'minus'
                    }`,
                  ]"
                  >{{ `${item.currentBalance > 0 ? "+" : "-"}`
                  }}{{ item.currentBalance | money({ currency: "vnd" }) }}</span
                >
              </div>
            </div>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-range-picker
        style="align-self: center"
        :defaultValue="defaultDateTime"
        class="m-b-10"
        :locale="locale"
        @change="onChangeDate"
        :format="format"
      />
    </div>
    <div v-if="isLoading" class="dashboard__loading">
      <a-spin size="large"></a-spin>
    </div>
    <div
      class="dashboard__no-data m-t-32"
      v-else-if="data !== null && data.length === 0"
    >
      <img class="m-b-24" src="@/assets/images/not-found.png" alt="not found" />
      <span class="dashboard__no-data-title m-b-16">Chưa có dữ liệu</span>
    </div>
    <div class="dashboard__content m-t-16" v-else>
      <a-card>
        <div class="dashboard__content-description">
          <div class="m-b-8">
            <b>Số dư:</b>
            <span
              :class="[
                'dashboard__content-money',
                'dashboard__content-money--income',
              ]"
              >&nbsp; +300 000 000đ</span
            >
          </div>
          <div class="dashboard__content-description-body">
            <div>
              <b>Tổng thu:</b>
              <span
                :class="[
                  'dashboard__content-money',
                  'dashboard__content-money--income',
                ]"
              >
                &nbsp; +1 000 000 vnđ</span
              >
            </div>
            <div>
              <b> Tổng chi:</b>
              <span
                :class="[
                  'dashboard__content-money',
                  'dashboard__content-money--expense',
                ]"
              >
                &nbsp; -1 000 000 vnđ</span
              >
            </div>
          </div>
        </div>
        <pie-chart class="m-t-18" :chartdata="dataPieChart" />
      </a-card>
      <a-card v-if="dataChart !== null" class="m-t-16">
        <line-chart :chartdata="dataLineChart" />
      </a-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import moment from "moment";
import LineChart from "../components/LineChart";
import PieChart from "../components/PieChart";
export default {
  name: "DashBoard",
  components: {
    LineChart,
    PieChart,
  },
  data() {
    return {
      locale,
      isLoading: false,
      form: {
        book: "all",
        fromDateTime: "",
        toDateTime: "",
      },
      data: null,
      format: "YYYY-MM-DD",
      dummyData: [
        {
          date: "2020-09-30",
          income: 1232131,
          expense: 0,
        },
        {
          date: "2020-10-10",
          income: 12312312,
          expense: 0,
        },
      ],
    };
  },
  created() {
    this.form.toDateTime = moment().format(this.format);
    this.form.fromDateTime = moment(this.form.toDateTime)
      .subtract(7, "days")
      .format(this.format);
  },
  mounted() {
    this.onGetStatistic();
  },
  methods: {
    ...mapActions({
      getStatistic: "dashboard/getStatistic",
    }),
    async onGetStatistic() {
      this.isLoading = true;
      let { fromDateTime, toDateTime, book } = this.form;
      fromDateTime = fromDateTime + " 00:00:00";
      toDateTime = toDateTime + " 00:00:00";
      const bookId =
        typeof this.form.book === "string" ? "" : this.form.book.id;
      try {
        const res = await this.getStatistic({
          bookId,
          fromDateTime,
          toDateTime,
        });
        const { header, data } = res.data;
        if (header.isSuccessful) {
          this.data = data;
        }
      } catch (e) {}
      this.isLoading = false;
    },
    onSelectBook(item) {
      this.form.book = item;
    },
    onChangeDate(dates) {
      if (dates.length !== 0) {
        this.form.fromDateTime = moment(dates[0]).format("YYYY-MM-DD");
        this.form.toDateTime = moment(dates[1]).format("YYYY-MM-DD");
      } else {
        this.form.fromDateTime = "";
        this.form.toDateTime = "";
      }
    },
  },
  computed: {
    ...mapGetters({
      books: typesBook.getters.GET_BOOKS,
      profile: typesAuth.getters.GET_USER_PROFILE,
    }),
    dataLineChart() {
      let labels = [];
      let dataSetIncome = [];
      let dataSetExpense = [];
      if (this.data !== null && this.data.length !== 0) {
        this.data.forEach((item) => {
          labels.push(item.date);
          dataSetIncome.push(item.income);
          dataSetExpense.push(item.expense);
        });
        return {
          labels,
          datasets: [
            {
              label: "Thu",
              backgroundColor: "#72d7bf",
              data: dataSetIncome,
            },
            {
              label: "Chi",
              backgroundColor: "#7989ff",
              data: dataSetExpense,
            },
          ],
        };
      }
      return null;
    },
    dataPieChart() {
      let labels = [];
      let dataSetIncome = [];
      let dataSetExpense = [];
      if (this.data !== null && this.data.length !== 0) {
        this.data.forEach((item) => {
          labels.push(item.date);
          dataSetIncome.push(item.income);
          dataSetExpense.push(item.expense);
        });
        return {
          labels: ["Thu", "Chi"],
          datasets: [
            {
              label: "Thu",
              backgroundColor: ["#72d7bf", "#7989ff"],
              data: [10000, 20000],
            },
          ],
        };
      }
      return null;
    },
    defaultDateTime() {
      return [moment(this.form.fromDateTime), moment(this.form.toDateTime)];
    },
    totalBalance() {
      return this.books !== null
        ? this.books.reduce((prev, cur) => {
            return prev + cur.currentBalance;
          }, 0)
        : 0;
    },
  },
  watch: {
    form: {
      deep: true,
      handler() {
        console.log("change");
        const { fromDateTime, toDateTime, book } = this.form;
        if (fromDateTime && toDateTime && book) {
          this.onGetStatistic();
        }
      },
    },
  },
};
</script>

<style lang="scss">
.dashboard {
  margin: 0 15vw;
  &__content {
    &-money {
      &--income {
        color: $success-color;
      }
      &--expense {
        color: $danger-color;
      }
    }
    &-description {
      font-size: 18px !important;
      &-body {
        display: flex;
        justify-content: space-between;
        > div {
          flex: 1 1 50%;
        }
      }
    }
  }
  &__loading {
    text-align: center;
  }
  &__no-data {
    img {
      width: 200px;
      align-self: center;
    }
    &-title {
      font-weight: 600;
      font-size: 24px;
    }
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  &__filter {
    display: flex;
    justify-content: space-between;
  }
  &__selected-book {
    display: flex;
    line-height: 24px;
    margin-top: 2px;
    &--card {
      padding: 5px;
      border: 1px solid $line-color;
      border-radius: 8px;
      width: fit-content;
      height: 60px;
      padding-left: 10px;
    }
    &-title {
      font-size: 16px;
      line-height: 45px;
      margin-left: 10px;
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
}
</style>