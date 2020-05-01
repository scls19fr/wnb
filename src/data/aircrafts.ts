import axios, {AxiosRequestConfig, AxiosStatic} from 'axios';
import yaml  from 'js-yaml';
const index = 'index.yml';

export class Aircrafts {
  private readonly api: AxiosStatic;
  private aircraft: string[] = [];
  constructor() {
    this.api = axios.create() as AxiosStatic;
  }

  private static async getAirCraftIndex() : Promise<AircraftApiType[]> {
    const request: any = await axios.get<string>(`https://raw.githubusercontent.com/scls19fr/wnb/master/data/${index}`);
    let response: AircraftApiType[] = [];
    try {
      response.push(yaml.safeLoad(request.data) as AircraftApiType);
    }
    catch (e) {
      console.log(e);
    }
    return response;
  }

  public static async getAirCraftList() : Promise<string[]> {
    const data = await this.getAirCraftIndex();
    if (data.length > 0) {
      return data[0].aircrafts.map(e => e.split('.yml')[0]);
    }
    return [];
  }
}

type AircraftApiType = {
  title: string;
  aircrafts: string[];
}
