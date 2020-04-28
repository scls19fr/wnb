import { safeLoad } from 'js-yaml'
import { readFileSync } from 'fs'
import inside from 'point-in-polygon'

export function loadConfigYML(filename) {
  try {
    const cfg = safeLoad(readFileSync(filename, 'utf8'))
    return cfg
  } catch (e) {
    console.log(e)
  }
}

function defineLoadSliderProperties(slider_properties) {
  slider_properties.current_value = slider_properties.default
  if (!slider_properties.hasOwnProperty('step')) {
    slider_properties.step = 1
  }
  if (slider_properties.hasOwnProperty('min') && slider_properties.hasOwnProperty('max')) {
    slider_properties.enabled = true
  } else {
    slider_properties.min = slider_properties.default - slider_properties.step
    slider_properties.max = slider_properties.default + slider_properties.step
    slider_properties.enabled = false
  }
  return slider_properties
}

export function buildLoadsArray(cfg) {
  const loads = []
  let new_load
  for(let i = 0; i < cfg.loads.length; i++) {
    const load = cfg.loads[i]
    if (load.hasOwnProperty('mass')) {
      new_load = load
      new_load.mass = defineLoadSliderProperties(new_load.mass)
      loads.push(new_load)
    } else if (load.hasOwnProperty('volume')) {
      new_load = load
      new_load.volume = defineLoadSliderProperties(new_load.volume)
      loads.push(new_load)
    } else {
      loads.push({})
    }
  }
  return loads
}

export function calculateGravityCenter(cfg, loads) {
  let total_mass = 0.0
  let total_moment = 0.0
  let mass = 0.0

  for(let i = 0; i < loads.length; i++) {
    const load = cfg.loads[i]
    if (load.hasOwnProperty('mass')) {
      mass = load.mass.current_value
    } else if (load.hasOwnProperty('volume')) {
      mass = load.volume.current_value * cfg.constants.liquids[load.liquid].density
    }
    total_mass += mass
    const moment = mass * load.lever_arm
    total_moment += moment
  }
  const lever_arm = total_moment / total_mass
  return {'mass': total_mass, 'lever_arm': lever_arm, 'moment': total_moment}
}

export function insideCentrogram(G, centrogram) {
  const polygon = []
  centrogram.forEach(function(pt) {
    polygon.push([pt.lever_arm, pt.mass]); 
  })
  return inside([G.lever_arm, G.mass], polygon)
}
