import { mocked } from 'ts-jest/utils';
import { WnbFunctions as fn }  from 'src/composables/wnb-functions'
import {Load} from 'src/models/Aircraft';


test('load sample config', () => {
  const cfg = fn.loadConfigYML('./data/f-bubk.yml')
  // tslint:disable-next-line:no-console
  console.log(cfg)
  expect(cfg.file_format_version).toBe('0.0.1')

  expect(cfg.weight_and_balance?.version).toBe('1')
  expect(cfg.weight_and_balance?.date).toBe('21/03/2006')

  expect(cfg.aircraft?.designation).toBe('Cessna 150')
  expect(cfg.aircraft?.type).toBe('C150')
  expect(cfg.aircraft?.immat).toBe('F-BUBK')
  expect(cfg.aircraft?.picture).toBe('f-bubk.png')
  expect(cfg.aircraft?.owner).toBe('Aéro-Club du Poitou')
  expect(cfg.aircraft?.owner_picture).toBe('acp.png')
  expect(cfg.aircraft?.comment).toBe('')

  expect(cfg.constants?.liquids.fuel_100LL.density).toBe(0.72)

  expect(cfg.centrogram?.length).toBe(5)
  for(let i = 0; i < cfg.centrogram?.length; i++) {
    expect(cfg.centrogram[i].designation).toBe('Pt' + (i + 1))
  }
  expect(cfg.centrogram[0].designation).toBe('Pt1')
  expect(cfg.centrogram[0].mass).toBe(250)
  expect(cfg.centrogram[0].lever_arm).toBe(0.8)

  expect(cfg.loads.length).toBe(5)

  expect(cfg.loads[0].designation).toBe('Empty aircraft')
  expect(cfg.loads[0].lever_arm).toBe(0.862)
  expect(cfg.loads[0].mass).toStrictEqual({'default': 520})
  expect(cfg.loads[0].comment).toBe('')

  expect(cfg.loads[1].designation).toBe('Pilot')
  expect(cfg.loads[1].lever_arm).toBe(0.993)
  // expect(cfg.loads[1].mass).toStrictEqual({'default': 70, 'min': 0, 'max': 150, 'step': 1})
  expect(cfg.loads[1].mass).toStrictEqual({'default': 77, 'min': 0, 'max': 150, 'step': 1})
  expect(cfg.loads[1].comment).toBe('')
})

test('build loads array', () => {
  const cfg = fn.loadConfigYML('./data/f-bubk.yml')
  const loads : Load[] = fn.buildLoadsArray(cfg)
  for(let i = 0; i < cfg.loads.length; i++) {
    if (cfg.loads[i].hasOwnProperty('mass')) {
      expect(loads[i].mass?.current_value).toBe(cfg.loads[i].mass?.default)
    } else if (cfg.loads[i].hasOwnProperty('volume')) {
      expect(loads[i].volume?.current_value).toBe(cfg.loads[i].volume?.default)
    }
  }

  expect(loads.length).toBe(5)
  expect(loads[0].mass?.default).toBe(520)
  expect(loads[0].mass?.min).toBe(519)
  expect(loads[0].mass?.max).toBe(521)
  expect(loads[0].mass?.step).toBe(1)
  expect(loads[0].mass?.enabled).toBe(false)

  expect(loads[1].mass?.default).toBe(77)
  expect(loads[1].mass?.min).toBe(0)
  expect(loads[1].mass?.max).toBe(150)
  expect(loads[1].mass?.step).toBe(1)
  expect(loads[1].mass?.enabled).toBe(true)
})

test('calculate center of gravity', () => {
  const cfg = fn.loadConfigYML('./data/f-bubk.yml')
  const loads = fn.buildLoadsArray(cfg)
  const G = fn.calculateGravityCenter(cfg, loads)
  expect(G.mass).toBe(668.2)
  expect(G.lever_arm).toBeCloseTo(0.907, 3)
  expect(G.moment).toBeCloseTo(606.375, 3)
})

test('inside centrogram', () => {
  const cfg = fn.loadConfigYML('./data/f-bubk.yml')

  // in range
  let loads = fn.buildLoadsArray(cfg)
  let G = fn.calculateGravityCenter(cfg, loads)
  // tslint:disable-next-line:no-console
  console.log(cfg.centrogram)
  // tslint:disable-next-line:no-console
  console.log(G)
  expect(fn.insideCentrogram(G, cfg.centrogram)).toBe(true)

  // overweight
  loads = fn.buildLoadsArray(cfg)
  // @ts-ignore
  loads[2].mass?.current_value = 60;  // Passenger
  G = fn.calculateGravityCenter(cfg, loads)
  // tslint:disable-next-line:no-console
  console.log(G)
  expect(fn.insideCentrogram(G, cfg.centrogram)).toBe(false)

  // out of range / back limit
  loads = fn.buildLoadsArray(cfg)
  // @ts-ignore
  loads[1].mass.current_value = 90;  // Pilot
  // @ts-ignore
  loads[3].mass.current_value = 54;  // Luggage
  G = fn.calculateGravityCenter(cfg, loads)
  // tslint:disable-next-line:no-console
  console.log(G)
  expect(fn.insideCentrogram(G, cfg.centrogram)).toBe(false)

  // out of range / front limit
  /*
  loads = wnb.buildLoadsArray(cfg)
  loads[1].mass.current_value = 100;  // Pilot
  loads[2].mass.current_value = 0;  // Passenger
  loads[3].mass.current_value = 0;  // Luggage
  loads[4].volume.current_value = 0 / cfg.constants.liquids.fuel_100LL.density;  // Fuel
  G = wnb.calculateGravityCenter(cfg, loads)
  console.log(G)
  expect(wnb.insideCentrogram(G, cfg.centrogram)).toBe(false)
  */

  // too light
  loads = fn.buildLoadsArray(cfg)
  expect(loads.length).toBe(5);
  // @ts-ignore
  loads[0].mass?.current_value = 200;  // Empty aircraft
  // @ts-ignore
  loads[1].mass.current_value = 0;  // Pilot
  // @ts-ignore
  loads[2].mass.current_value = 0;  // Passenger
  // @ts-ignore
  loads[3].mass.current_value = 0;  // Luggage
  // @ts-ignore
  loads[4].volume.current_value = 0 / cfg.constants.liquids.fuel_100LL.density;  // Fuel
  G = fn.calculateGravityCenter(cfg, loads)
  // tslint:disable-next-line:no-console
  console.log(G)
  expect(fn.insideCentrogram(G, cfg.centrogram)).toBe(false)
})
