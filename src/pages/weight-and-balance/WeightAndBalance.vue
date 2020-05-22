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

        <div v-for="massSlider in currentLoads.filter(x => !!x.mass)" :key="massSlider.designation">
          <div class="q-pa-md">
            <q-badge color="primary" class="q-pa-sm">
              {{massSlider.designation}} {{ massSlider.mass.default }}
              &nbsp;
              <em v-if="massSlider.comment">
                {{massSlider.comment}}
              </em>
            </q-badge>
            <q-slider
              @change="val => { massSlider.mass.default = val}"
              :value="massSlider.mass.default"
              :min="massSlider.mass.min"
              :max="massSlider.mass.max"
              :step="massSlider.mass.step"
              :readonly="!massSlider.mass.enabled"
              :color="massSlider.mass.enabled ? 'blue' : 'grey'"
              label
            />
          </div>
        </div>
        <div v-for="volumeSlider in currentLoads.filter(x => !!x.volume)" :key="volumeSlider.designation">
          <div class="q-pa-md">
            <q-badge color="primary" class="q-pa-sm">
              {{volumeSlider.designation}} {{ volumeSlider.volume.default }}
              &nbsp;
              <em v-if="volumeSlider.comment">
                {{volumeSlider.comment}}
              </em>
            </q-badge>
            <q-slider
              @change="val => { volumeSlider.volume.default = val}"
              :value="volumeSlider.volume.default"
              :min="volumeSlider.volume.min"
              :max="volumeSlider.volume.max"
              :step="volumeSlider.volume.step"
              :readonly="!volumeSlider.volume.enabled"
              :color="volumeSlider.volume.enabled ? 'blue' : 'grey'"
              label
            />
          </div>
        </div>

      </div>
    <div style="max-width: 800px" >
      <p :class="{'bs-outside': !isInside}" v-if="gravityCenter.mass > 0">Mass: {{gravityCenter.mass.toFixed(1)}},
        Lever Arm: {{gravityCenter.lever_arm.toFixed(3)}},
        Moment: {{gravityCenter.moment.toFixed(1)}}</p>
    <radar-chart v-if="aircraft" :chartData="chartData" :options="chartOptions" />
    </div>
  </q-page>
</template>

<script lang="ts" src="./WeightAndBalance.ts" />
<style lang="scss">
  .bs-outside {
    text-decoration: underline dotted red !important;
  }
</style>
