import axios, {AxiosInstance, AxiosRequestConfig, AxiosStatic} from 'axios';
import yaml  from 'js-yaml';
import {AircraftModel} from 'src/models/Aircraft';

const index = 'index.yml';
const baseURL ='https://raw.githubusercontent.com/scls19fr/wnb/master/data/';

export class Api {
  private api = axios.create();
  constructor() {
    this.api = axios.create({baseURL});
  }

  private async fetchAirCraftIndex() : Promise<AircraftApiType[]> {
    const request: any = await this.api.get<string>(index);
    const response: AircraftApiType[] = [];
    try {
      response.push(yaml.safeLoad(request.data) as AircraftApiType);
    }
    catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
    }
    return response;
  }

  private async fetchAirCraft(aircraft: string) : Promise<AircraftModel[]> {
    const request: any = await this.api.get<string>(Api.addYmlExtension(aircraft));
    const response: AircraftModel[] = [];
    try {
      response.push(yaml.safeLoad(request.data) as AircraftModel);
    }
    catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
    }
    return response;
  }


  public async getAirCraftList() : Promise<string[]> {
    const data = await this.fetchAirCraftIndex();
    if (data.length > 0) {
      return data[0].aircrafts.map(e => Api.removeYmlExtension(e));
    }
    return [];
  }

  public async getAircraft(aircraftModel: string) : Promise<AircraftModel> {
    const data = await this.fetchAirCraft(aircraftModel);
    return data[0] as AircraftModel;
  }

  private static addYmlExtension(name: string) : string { return `${name}.yml`}
  private static removeYmlExtension(name: string) : string { return name.split('.yml')[0]}

}

type AircraftApiType = {
  title: string;
  aircrafts: string[];
}
