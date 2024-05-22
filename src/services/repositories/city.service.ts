import {CityRepository} from './city.repository';
import dataMock from './mock-data.json';
import { injectable } from 'inversify';
@injectable()
export class CityService implements CityRepository {
  listCityData = dataMock;
  ITEMS_PER_PAGE = 10;
  totalPages = 0;

  constructor() {
    this.totalPages = Math.ceil(this.listCityData.length / this.ITEMS_PER_PAGE);
  }

  normalizeString(str:string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  searchByName(search:string) {
    if (search.trim() === '' || !search) {
      return this.listCityData;
    }

    return this.listCityData.filter(element => element.name.toLowerCase().includes(this.normalizeString(search.toLowerCase())));
  }

  async searcherCity(currentPage:number = 1, search = ''): Promise<CityType[]> {
    try {
      const indexOfLastItem = currentPage * this.ITEMS_PER_PAGE;
      const indexOfFirstItem = indexOfLastItem - this.ITEMS_PER_PAGE;
      const currentItems = this.searchByName(search).slice(indexOfFirstItem, indexOfLastItem);

      return currentItems;

    // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.error('Error al obtener usuarios:', error);

      return [];
    }
  }

  async searchNearCities(lat: string, lng: string, radio = 30): Promise<CityType[]> {
    const sugerencias:CityType[] = [];

    for (const element of this.listCityData) {
      const distance = this.calculateDistance(parseFloat(lat), parseFloat(lng), parseFloat(element.lat), parseFloat(element.lng));

      if (distance <= radio) {
        sugerencias.push({
          ...element,
          distance
        });
      }
    }

    return sugerencias.sort((a, b) => a.distance - b.distance).slice(1, 5);
  }

  calculateDistance(lat1:number, lon1:number, lat2:number, lon2:number) {
    const radlat1 = Math.PI * lat1 / 180;
    const radlat2 = Math.PI * lat2 / 180;
    const theta = lon1 - lon2;
    const radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;

    return dist;
  }
}
