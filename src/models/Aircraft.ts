  export type AircraftModel = {
    application?: string;
    usage?: string;
    file_format_version?: string;
    weight_and_balance?: WeightAndBalance;
    aircraft?: Aircraft;
    constants: Constants;
    centrogram: Centrogram[];
    loads: Load[];
  }
  export type WeightAndBalance = {
    date: string;
    version: string;
  }

  export type Aircraft = {
    category: string;
    designation: string;
    type: string;
    immat: string;
    picture?: string;
    owner: string;
    owner_picture?: string;
    comment?: string;
  }

  export type Fuel100LL = {
    density: number;
  }

  export type Liquids = {
    fuel_100LL: Fuel100LL;
  }

  export type Constants = {
    liquids: Liquids;
  }

  export type Centrogram = {
    designation: string;
    lever_arm: number;
    mass: number;
  }

  export interface SliderProperties  {
    default: number;
    min?: number;
    max?: number;
    step?: number;
    enabled?: boolean;
    current_value?: number;
  }
  export interface Mass extends SliderProperties {
    default: number;
    min?: number;
    max?: number;
    step?: number;
    enabled?: boolean;
    current_value?: number;
  }

  export interface Volume extends SliderProperties {
    default: number;
    min: number;
    max: number;
    step: number;
    enabled?: boolean;
    current_value?: number;
  }

  export type Load = {
    designation: string;
    lever_arm: number;
    comment: string;
    liquid: string;
    mass?: Mass;
    volume?: Volume;
  }

  export type AircraftApiType = {
    title: string;
    aircrafts: string[];
  }

