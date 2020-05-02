<template>
  <q-page padding>
      <div class="q-pa-md">
        <q-btn-dropdown color="secondary" label="Select Aircraft">
          <q-list>
            <q-item v-for="aircraft in aircraftList"
                    :key="aircraft"
                    :value="aircraft"
                    clickable
                    v-close-popup
                    @click="onItemClick(aircraft)"
                    >
              <q-item-section>
                <q-item-label>{{aircraft.toUpperCase()}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    <div>{{selectedModel}}</div>

  </q-page>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import {Api} from "src/data/aircrafts";
  import {AircraftModel} from "src/models/Aircraft";

  @Component( {name: 'WeightAndBalancePage'})
  export default class WeightAndBalancePage extends Vue {
    aircraftList: string[] = [];
    aircraftModels: AircraftModel[] = [];
    selectedModel: string = 'none';
    api: Api;
    constructor() {
      super();
      this.api = new Api();
      this.selectedModel = 'none';
    }
    get aircraft() {
      return this.aircraftModels.find(x => x.aircraft?.immat == this.selectedModel) || undefined;

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

    static mergeAircraftModels(existingModels: AircraftModel[], newModels: AircraftModel[]) : AircraftModel[] {
      const merge: AircraftModel[] = [];
      let start = 0;
      while(start < existingModels.length){
        if(existingModels[start].aircraft?.immat === newModels[start].aircraft?.immat){
          merge.push({...existingModels[start],...newModels[start]})
        }
        start = start+1
      }
      return merge;
    }

  }
</script>
