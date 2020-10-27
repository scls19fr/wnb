import axios from 'axios';
import yaml from 'js-yaml';
import {AircraftModel, AircraftApiType} from 'src/models/Aircraft';

const INDEX = 'index.yml';

const BASE_URL ='https://raw.githubusercontent.com/scls19fr/wnb-data-acp/master/data';
const REPOSITORY_URL = 'https://github.com/scls19fr/wnb-data-acp/';
const REPOSITORY_CAPTION = 'github.com/scls19fr/wnb-data-acp';

export class Api {
  public static readonly baseUrl = BASE_URL;
  public static readonly repositoryUrl = REPOSITORY_URL;
  public static readonly repositoryCaption = REPOSITORY_CAPTION;

  private static async fetchAirCraftIndex() : Promise<AircraftApiType[]> {
    const request: any = await axios.get<string>(`${BASE_URL}/${INDEX}`);
    const response: AircraftApiType[] = [];
    return request && request.data ? [yaml.safeLoad(request.data)] : response;
  }

  private static async fetchAirCraft(aircraft: string) : Promise<AircraftModel[]> {
    const request: any = await axios.get<string>(`${BASE_URL}/${Api.addYmlExtension(aircraft)}`);
    const response: AircraftModel[] = [];
    return request && request.data ? [yaml.safeLoad(request.data)] : response;
  }

  public async getAirCraftList() : Promise<string[]> {
    const data = await Api.fetchAirCraftIndex();
    const airCraftList: string[] = [];
    if (data && data.length > 0) {
      data[0].aircrafts.forEach(x => airCraftList.push(Api.removeYmlExtension(x)))
    }
    return airCraftList;
  }

  public async getAircraft(aircraftModel: string) : Promise<AircraftModel> {
    const data = await Api.fetchAirCraft(aircraftModel);
    return data[0] as AircraftModel;
  }

  private static addYmlExtension(name: string) : string { return `${name}.yml`}
  private static removeYmlExtension(name: string) : string { return name.split('.yml')[0]}
}
