import 'reflect-metadata';
import { CityRepository } from '../repositories/city.repository';
import { CityService } from '../repositories/city.service';
import { Container } from 'inversify';

import { TYPES } from './types';

const repositoryContainer = new Container();

repositoryContainer.bind<CityRepository>(TYPES.CITY_REPOSITORY).to(CityService);

export {repositoryContainer};
