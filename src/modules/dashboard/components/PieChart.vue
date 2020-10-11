
<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
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
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: (tooltipItem, chart) => {
              console.log(tooltipItem,chart.datasets[0].data[tooltipItem.datasetIndex])
              return this.money(chart.datasets[0].data[tooltipItem.index],{ currency: 'vnd' })
            },
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
