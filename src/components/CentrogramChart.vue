<script lang="ts">
  import VueCharts from 'vue-chartjs'
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import {ChartData, ChartOptions} from 'chart.js';

  @Component({
    extends: VueCharts.Scatter,
    mixins: [VueCharts.mixins.reactiveProp]
  })
  export default class CentrogramChart extends Vue {
    @Prop() readonly chartData!: ChartData;
    @Prop() readonly options!: ChartOptions;
    @Watch('options')
    onOptionChanged() {
      this.renderChart(this.chartData, this.options);
    }
    public renderChart!: (chartData: any, options: any) => void;

    mounted() {
      this.onOptionChanged()
    }
  }
</script>
