<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/wnb-logo-full.svg">
    <div class="q-pa-md">
      <q-btn-dropdown color="primary" label="Select Aircraft">
        <q-list>
          <q-item v-for="aircraft in aircraftList" clickable v-close-popup @click="onItemClick">
            <q-item-section>
              <q-item-label>{{aircraft.toUpperCase()}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </q-page>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import {Aircrafts} from "src/data/aircrafts";

  @Component( {name: 'IndexPage'})
  export default class IndexPage extends Vue {
    aircraftList: string[] = [];

    onItemClick() {

    }

    async mounted() {
      this.aircraftList = await Aircrafts.getAirCraftList();
    }

  }
</script>
