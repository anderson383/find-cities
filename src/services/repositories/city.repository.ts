export interface CityRepository {

  /**
   * Busca o trae todas las ciudades de un json
   * @param currentPage
   * @param search
   */
  searcherCity(currentPage?:number, search?:string): Promise<CityType[]>;

  /**
   * Busca o trae todas las ciudades que esten cerca a una ciudad basada en su latitude y longitud
   * @param currentPage
   * @param search
   */
  searchNearCities(lat: string, lng:string): Promise<CityType[]>;
}
