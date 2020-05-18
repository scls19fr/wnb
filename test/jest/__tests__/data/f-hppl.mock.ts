import {AircraftModel, Load} from 'src/models/Aircraft';

export const fHppl : AircraftModel = {
  application: 'wnb',
  usage: 'aircraft-wnb-data',
  file_format_version: '0.0.1',
  weight_and_balance: {date: '01/09/2015', version: '1'},
  aircraft: {
    category: 'airplane',
    designation: 'Evektor Sportstar',
    type: 'Light sport aircraft',
    immat: 'F-HPPL',
    picture: 'f-hppl.png',
    owner: 'Aéro-Club du Poitou',
    owner_picture: 'acp.png',
    comment: ''},
    constants: {liquids: {fuel_100LL: { density: 0.72 } }},
    centrogram: [
      {designation: 'Pt1', lever_arm: 0.2473, mass: 374},
      {designation: 'Pt2', lever_arm: 0.3128, mass: 374},
      {designation: 'Pt3', lever_arm: 0.3696, mass: 395},
      {designation: 'Pt4', lever_arm: 0.4049, mass: 452},
      {designation: 'Pt5', lever_arm: 0.4, mass: 600},
      {designation: 'Pt6', lever_arm: 0.3733, mass: 600},
      {designation: 'Pt7', lever_arm: 0.3292, mass: 524},
      {designation: 'Pt8', lever_arm: 0.2473, mass: 374}
    ],
  loads: [
    {
      designation: 'Empty aircraft',
      lever_arm: 0.25,
      mass: {
        default: 325,
      },
      comment: ''
    } as Load,
    {
      designation: 'Pilot',
      lever_arm: 0.545,
      mass: {
        default: 100,
        min: 0,
        max: 150,
        step: 1
      },
      comment: ''
    } as Load,
    {
      designation: 'Passenger',
      lever_arm: 0.545,
      mass: {
        default: 90,
        min: 0,
        max: 150,
        step: 1
      },
      comment: ''
    } as Load,
    {
      designation: 'Luggage',
      lever_arm: 1.083,
      mass: {
        default: 5,
        min: 0,
        max: 25,
        step: 0.1
      },
      comment: ''
    } as Load,
    {
      designation: 'Fuel',
      lever_arm: 0.68,
      liquid: 'fuel_100LL',
      volume: {
        default: 78,
        min: 0,
        max: 118,
        step: 1
      },
      comment: '120L  - 2L'
    } as Load
  ]
};
