import { CityRepository } from '../services/repositories/city.repository';
import { TYPES } from '../services/config/types';
import { useRepositoryIoc } from '../services/config/context';

const useCityRepository = (): CityRepository => {
  const { container } = useRepositoryIoc();

  return container.get(TYPES.CITY_REPOSITORY);
};

export default useCityRepository;
