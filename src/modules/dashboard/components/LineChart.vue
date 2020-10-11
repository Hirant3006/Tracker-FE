
<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: {
    chartdata: {
      type: Object,
      default: null,
    },
    // options: {
    //   type: Object,
    //   default: null,
    // },
  },
  data() {
    return {
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Biểu đồ thu chi theo thời gian",
        },
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: (tooltipItem, chart) => {
              return this.money(tooltipItem.yLabel, { currency: "vnd" });
            },
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  drawBorder: false,
                  display: false,
                  drawTicks: true,
                  color: "#d9e2ec",
                },
                ticks: {
                  callback: function (label, index, labels) {
                    return label + "asdas";
                  },
                },
              },
            ],
          },
        },
      },
    };
  },
  methods: {
    money: function (value, { rounded = 5, currency }) {
      if (isNaN(value)) {
        return 0;
      }
      if (currency) {
        switch (currency.toLowerCase()) {
          case "vnd":
            return new Intl.NumberFormat().format(value) + " VND";
          case "dolar":
            return "$" + helper.toFixedNumberic(value, rounded);
        }
      }
      return new Intl.NumberFormat().format(value);
    },
  },
  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>
