import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import inside from 'point-in-polygon';
import { AircraftModel, Centrogram, Load, Mass, SliderProperties, Volume } from 'src/models/Aircraft';
import { GravityCenter } from 'src/models/GravityCenter';

export class WnbFunctions {
  public static loadConfigYML(filename: string): AircraftModel {
    try {
      return safeLoad(readFileSync(filename, 'utf8')) as AircraftModel;
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e)
    }
    return {} as AircraftModel;
  }

  public static defineLoadSliderProperties(sliderProperties: SliderProperties): SliderProperties {
    sliderProperties.current_value = sliderProperties.default
    if (!sliderProperties.step) {
      sliderProperties.step = 1
    }
    if (sliderProperties.hasOwnProperty('min') && sliderProperties.hasOwnProperty('max')) {
      sliderProperties.enabled = true
    } else {
      sliderProperties.min = sliderProperties.default - sliderProperties.step
      sliderProperties.max = sliderProperties.default + sliderProperties.step
      sliderProperties.enabled = false
    }
    return sliderProperties
  }

  public static buildLoadsArray(cfg: AircraftModel): Load[] {
    const loads: Load[] = [];
    let newLoad
    for (let i = 0; i < cfg.loads.length; i++) {
      const load = cfg.loads[i]
      if (load.mass) {
        newLoad = load
        newLoad.mass = WnbFunctions.defineLoadSliderProperties(newLoad.mass as SliderProperties) as Mass;
        loads.push(newLoad)
      } else if (load.volume) {
        newLoad = load
        newLoad.volume = WnbFunctions.defineLoadSliderProperties(newLoad.volume as SliderProperties) as Volume;
        loads.push(newLoad)
      } /* else { // why push empty object?
        loads.push({})
      } */
    }
    return loads
  }

  public static calculateGravityCenter(cfg: AircraftModel, loads: Load[]) : GravityCenter {
    let mass = 0.0;
    const gravityCenter : GravityCenter = {
      mass: 0.0,
      lever_arm: 0.0,
      moment: 0.0
    }
    for(let i = 0; i < loads.length; i++) {
      const load = cfg.loads[i]
      if (load.mass) {
        mass = load.mass.current_value;
      } else if (load.volume) {
        mass = load.volume.current_value * cfg.constants.liquids.fuel_100LL.density;
      }
      gravityCenter.mass += mass;
      const moment = mass * load.lever_arm;
      gravityCenter.moment += moment;
    }
    gravityCenter.lever_arm = gravityCenter.moment / gravityCenter.mass
    return gravityCenter;
  }

  public static insideCentrogram(G: GravityCenter, centrogram: Centrogram[]) {
    let polygon: any[];
    polygon = [];
    centrogram.forEach((pt: any) => {
      polygon.push([pt.lever_arm, pt.mass]);
    })
    return inside([G.lever_arm, G.mass], polygon)
  }
}

