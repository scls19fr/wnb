import {Vue, Component, Watch} from 'vue-property-decorator';
import {Api} from 'src/data/aircrafts';
import {AircraftModel, Load} from 'src/models/Aircraft';
import {ChartData, ChartOptions} from 'chart.js';
import CentrogramChart from 'components/CentrogramChart.vue';
import {WnbFunctions} from 'src/composables/wnb-functions';
import {GravityCenter} from 'src/models/GravityCenter';

@Component({
  name: 'WeightAndBalancePage',
  components: {RadarChart: CentrogramChart}
})
export default class WeightAndBalancePage extends Vue {
  aircraftList: string[] = [];
  aircraftModels: AircraftModel[] = [];
  selectedModel: string = 'none';
  api: Api;
  currentLoads: Load[] = [];

  constructor() {
    super();
    this.api = new Api();
    this.selectedModel = 'none';
  }

  @Watch('loads')
  onLoadsChange() {
    this.currentLoads = [...this.loads] as Load[];
  }


  get baseUrl() {
    return Api.baseUrl;
  }

  get aircraft() {
    // tslint:disable-next-line:no-console
    console.log(this.selectedModel)
    return this.aircraftModels.find(x => x.aircraft?.immat === this.selectedModel.toUpperCase()) || undefined;
  }

  get loads() {
    let loads = [] as Load[];
    if (this.aircraft) {
      loads = WnbFunctions.buildLoadsArray(this.aircraft);
    }
    return loads;
  }

  get chartDataPoints() {
    if (this.aircraft) {
      const chartData = this.aircraft.centrogram.map(x => ({label: x.designation, x: x.lever_arm, y: x.mass}))
      chartData.push(chartData[0]);
      return chartData;
    }
    return [];
  }

  get chartMaxX() {
    if (this.aircraft) {
      return Math.max(...this.aircraft?.centrogram.map(x => x.lever_arm));
    }
    return 0;
  }

  get chartMinX() {
    if (this.aircraft) {
      return Math.min(...this.aircraft?.centrogram.map(x => x.lever_arm));
    }
    return 0;
  }

  get chartMaxY() {
    if (this.aircraft) {
      return Math.max(...this.aircraft?.centrogram.map(x => x.mass));
    }
    return 0;
  }

  get chartMinY() {
    if (this.aircraft) {
      return Math.min(...this.aircraft?.centrogram.map(x => x.mass));
    }
    return 0;
  }

  get chartXValue() {
    const x = Math.ceil((this.chartMaxX + .005) / .1) * .1;
    return x > 1 ? 1 : x;
  }

  get gravityCenter() {
    if (this.aircraft)
      return WnbFunctions.calculateGravityCenter(this.aircraft, this.loads)
    return {lever_arm: 0, mass: 0, moment: 0} as GravityCenter;
  }

  get isInside() {
    if (this.aircraft)
      return WnbFunctions.insideCentrogram(this.gravityCenter, this.aircraft.centrogram)
    return true;
  }

  get chartOptions() {
    // @ts-ignore
    return {
      legend: {
        display: true,
        labels: {
          fontColor: 'pink'
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem) => {
            return ` x: ${Number(tooltipItem.xLabel).toFixed(3)}, y: ${Number(tooltipItem.yLabel).toFixed(1)}`;
          }
        }
      },
      title: {
        display: true,
        text: 'Weight and Balance',
        position: 'bottom'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },

      // @ts-ignore
      scales: {
        xAxes: [{
          ticks: {
            min: Math.floor((this.chartMinX - .005) / .1) * .1,
            max: this.chartXValue,

          },
          gridLines: {
            color: '#888',
            drawOnChartArea: false
          }
        }],
        yAxes: [{
          ticks: {
            min: this.chartMinY,
            max: Math.ceil(this.chartMaxY / 100) * 100 + 25,
            padding: 10
          },
          gridLines: {
            color: '#888',
            drawOnChartArea: false
          }
        }]
      }
    } as ChartOptions;
  }

  get chartData() {
    const dataPoints = this.chartDataPoints;
    return {
      datasets: [{
        label: 'Centrogram',
        data: dataPoints,
        borderColor: 'black',
        borderWidth: 1,
        pointBackgroundColor: ['#e50909', '#0bc5de', '#d800d9'],
        pointBorderColor: ['#000', '#00bcd6', '#d300d6'],
        pointRadius: 5,
        pointHoverRadius: 5,
        fill: true,
        tension: 0,
        showLine: true
      }, {
        label: 'Gravity Center',
        data: [{x: this.gravityCenter.lever_arm, y: this.gravityCenter.mass}],
        pointBackgroundColor: this.isInside ? '#65c672' : 'red',
        pointBorderColor: this.isInside ? '#65c672' : 'red',
        pointRadius: 12,
        pointHoverRadius: 12
      }]
    } as ChartData;
  }


  async onItemClick(aircraft: string) {
    const model = await this.api.getAircraft(aircraft);
    if (model) {
      this.selectedModel = aircraft;
      this.aircraftModels = WeightAndBalancePage.mergeAircraftModels(this.aircraftModels, [model]);
    }
  }

  async mounted() {
    this.aircraftList = await this.api.getAirCraftList();
  }

  // TODO: this should be moved from this class as S in SOLID
  static mergeAircraftModels(existingModels: AircraftModel[], newModels: AircraftModel[]): AircraftModel[] {
    const merge: AircraftModel[] = [...existingModels];
    for (const model of newModels) {
      if (!existingModels.some(x => x.aircraft?.immat === model.aircraft?.immat)) {
        merge.push(model);
      }
    }
    return merge;
  }

}
