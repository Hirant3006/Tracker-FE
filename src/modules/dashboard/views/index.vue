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
    <div v-if="isLoading" class="dashboard__loading m-t-64">
      <a-spin size="large"></a-spin>
    </div>
    <div
      class="dashboard__no-data m-t-32"
      v-else-if="
        dataSummary !== null &&
        dataSummary.length === 0 &&
        data !== null &&
        data.length === 0
      "
    >
      <img class="m-b-24" src="@/assets/images/not-found.png" alt="not found" />
      <span class="dashboard__no-data-title m-b-16">Chưa có dữ liệu</span>
    </div>
    <div class="dashboard__content m-t-16" v-else>
      <a-card v-if="dataSummary !== null">
        <div class="dashboard__content-description">
          <div class="m-b-8">
            <b>Tổng:</b>
            <span
              :class="[
                'dashboard__content-money',
                'dashboard__content-money--income',
              ]"
              >&nbsp; +{{
                (dataSummary.expense - dataSummary.income)
                  | money({ currency: "vnd" })
              }}</span
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
                &nbsp;
                <span v-if="dataSummary.income !== 0">+</span
                >{{ dataSummary.income | money({ currency: "vnd" }) }}</span
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
                &nbsp; <span v-if="dataSummary.expense !== 0">-</span
                >{{ dataSummary.expense | money({ currency: "vnd" }) }}</span
              >
            </div>
          </div>
        </div>
        <pie-chart v-if="dataSummary !== null && (dataSummary.income!== 0 || dataSummary.expense!== 0)" class="m-t-18" :chartdata="dataPieChart" />
      </a-card>
      <a-card v-if="data !== null && data.length > 0" class="m-t-16">
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
export default {
  name: "DashBoard",
  components: {
    LineChart:() => import('../components/LineChart'),
    PieChart:() => import('../components/PieChart'),
  },
  data() {
    return {
      locale,
      isLoading: false,
      dataSummary: null,
      form: {
        book: "all",
        fromDate: "",
        toDate: "",
      },
      data: null,
      format: "YYYY-MM-DD",
    };
  },
  created() {
    this.form.toDate = moment().format(this.format);
    this.form.fromDate = moment(this.form.toDate)
      .subtract(1, "days")
      .format(this.format);
  },
  mounted() {
    console.log(this.$route)
    if(this.$route.params.bookData!==undefined) {
      this.form.book= this.$route.params.bookData
    }
    this.onGetStatistic();
    this.onGetStatisticSummary();
  },
  methods: {
    ...mapActions({
      getStatistic: "dashboard/getStatistic",
      getStatisticSummary: "dashboard/getStatisticSummary",
    }),
    async onGetStatistic() {
      this.isLoading = true;
      let { fromDate, toDate, book } = this.form;
      fromDate = fromDate;
      toDate = toDate;
      const bookId =
        typeof this.form.book === "string" ? "" : this.form.book.id;
      try {
        const res = await this.getStatistic({
          bookId,
          fromDate,
          toDate,
        });
        const { header, data } = res.data;
        if (header.isSuccessful) {
          this.data = data;
        }
      } catch (e) {
        console.log(e);
        this.$notification["error"]({
          message: `Lỗi thông tin thống kê`,
          description: "Có lỗi xảy ra trong quá trình lấy thông tin",
          placement: "bottomRight",
        });
      }
      this.isLoading = false;
    },
    async onGetStatisticSummary() {
      this.isLoading = true;
      let { fromDate, toDate, book } = this.form;
      fromDate = fromDate;
      toDate = toDate;
      const bookId =
        typeof this.form.book === "string" ? "" : this.form.book.id;
      try {
        const res = await this.getStatisticSummary({
          bookId,
          fromDate,
          toDate,
        });
        const { header, data } = res.data;
        if (header.isSuccessful) {
          this.dataSummary = data;
        }
      } catch (e) {
        console.log(e);
        this.$notification["error"]({
          message: `Lỗi thông tin thống kê`,
          description: "Có lỗi xảy ra trong quá trình lấy thông tin",
          placement: "bottomRight",
        });
      }
      this.isLoading = false;
    },
    onSelectBook(item) {
      this.form.book = item;
    },
    onChangeDate(dates) {
      if (dates.length !== 0) {
        this.form.fromDate = moment(dates[0]).format("YYYY-MM-DD");
        this.form.toDate = moment(dates[1]).format("YYYY-MM-DD");
      } else {
        this.form.fromDate = "";
        this.form.toDate = "";
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
      let data = [];
      if (this.dataSummary !== null && this.dataSummary.length !== 0) {
        data.push(this.dataSummary.income);
        data.push(this.dataSummary.expense);
        return {
          labels: ["Thu", "Chi"],
          datasets: [
            {
              backgroundColor: ["#72d7bf", "#7989ff"],
              data,
            },
          ],
        };
      }
      return null;
    },
    defaultDateTime() {
      return [moment(this.form.fromDate), moment(this.form.toDate)];
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
        const { fromDate, toDate, book } = this.form;
        if (fromDate && toDate && book) {
          this.data = null;
          this.dataSummary = null;
          this.onGetStatistic();
          this.onGetStatisticSummary();
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