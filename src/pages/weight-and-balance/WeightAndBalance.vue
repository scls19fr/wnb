<template>
  <q-page padding>
      <div class="q-pa-md">
        <q-btn-dropdown color="secondary" :label="$t('select_aircraft')">
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
        <div class="row">
          <div class="col-12 col-md-4">
            <div class="q-ma-md">
              <q-img v-if="aircraft && aircraft.aircraft.owner_picture"
                class="q-my-sm"
                :src="`${baseUrl}/${aircraft.aircraft.owner_picture}`"
              >
                <div class="absolute-bottom text-subtitle1 text-center">
                  {{ aircraft.aircraft.owner }}
                </div>
              </q-img>
            </div>
            <div class="q-ma-md">
              <q-img v-if="aircraft && aircraft.aircraft.picture"
                class="q-my-sm"
                :src="`${baseUrl}/${aircraft.aircraft.picture}`"
              >
                <div class="absolute-bottom text-subtitle1 text-center">
                  {{ aircraft.aircraft.immat }}
                </div>
              </q-img>
            </div>
            <div v-if="aircraft" class="text-center">
                {{ aircraft.aircraft.designation }} ({{ aircraft.aircraft.type }})
                <div v-if="aircraft.aircraft.comment">{{ aircraft.aircraft.comment }}</div>
            </div>
            <div v-for="massSlider in currentLoads.filter(x => !!x.mass)" :key="massSlider.designation">
              <div class="q-pa-md">
                <q-badge color="primary" class="q-pa-sm">
                  {{$t(massSlider.designation)}} {{ massSlider.mass.default }} kg
                  &nbsp;
                  <em v-if="massSlider.comment">
                    ({{ massSlider.comment }})
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
                  {{$t(volumeSlider.designation)}} {{ volumeSlider.volume.default }} L
                  &nbsp;
                  <em v-if="volumeSlider.comment">
                    ({{ volumeSlider.comment }})
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
        </div>
          <div class="col-12 col-md-6 col-lg-8">
            <div class="q-ma-md">
            <p class="q-pl-lg" :class="{'bs-outside': !isInside}" v-if="gravityCenter.mass > 0">
              <em>{{ $t('mass') }}:</em> {{gravityCenter.mass.toFixed(1)}} kg,
              <em>{{ $t('lever_arm') }}:</em> {{gravityCenter.lever_arm.toFixed(3)}} m,
              <em>{{ $t('moment') }}:</em> {{gravityCenter.moment.toFixed(1)}} kg.m</p>
            <radar-chart v-if="aircraft" :chartData="chartData" :options="chartOptions" style="max-width: 700px;"/>
            </div>

          </div>
        </div>
      </div>
  </q-page>
</template>

<script lang="ts" src="./WeightAndBalance.ts" />
<style lang="scss">
  .bs-outside {
    text-decoration: underline dotted red !important;
  }
</style>
