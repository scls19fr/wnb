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

<script lang="ts" src="./WeightAndBalance.ts" />
