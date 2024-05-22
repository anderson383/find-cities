import {
  useEffect, useState
} from 'react';
import { AutoComplete } from '../../ui/atoms/autocomplete/autocomplete';
import styles from './search-city.module.scss';
import useCityRepository from '../../../hooks/use-city-repository';
export const SearchCity = () => {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState(1);
  const [itemSelect, setItemSelect] = useState<CityType>();
  const [cityList, setCityList] = useState<CityType[]>([]);
  const [nearByList, setNearByList] = useState<CityType[]>([]);

  const cityRepository = useCityRepository();

  useEffect(() => {
    getCities(page);
  }, []);

  const getCities = (pageParam:number) => {
    cityRepository.searcherCity(pageParam, search).then(res => {
      setCityList(last => [...last, ...res]);
    });
  };

  const handleOnSearch = (searchString:string) => {
    setNearByList(lastValue => (searchString ? lastValue : []));
    setSearch(searchString);
    setPage(1);
    cityRepository.searcherCity(1, searchString).then(res => {
      setCityList(last => res);
    });
  };

  const handleScroll = (containerRef: any) => {
    const { current } = containerRef;

    if (current) {
      const {
        scrollTop, clientHeight, scrollHeight
      } = current;

      if (Number((scrollHeight - scrollTop).toFixed(0)) === clientHeight) {
        // Al llegar al final, carga la siguiente página
        setPage(prevPage => {
          const newPage = prevPage + 1;

          getCities(newPage);

          return newPage;
        });
      }
    }
  };

  const onSelectCity = (citySelect:CityType) => {
    handleOnSearch(citySelect.name);
    setItemSelect(citySelect);

    cityRepository.searchNearCities(citySelect.lat, citySelect.lng).then(res => {
      setNearByList(res);
    });
  };

  return (
    <section className={styles.searcher_content}>
      <div>
        <h1>Find a city</h1>
      </div>
      <div>
        <AutoComplete
          name='searcher'
          placeholder='Which city do you want to search for?'
          valueText={search}
          onChangeText={str => handleOnSearch(str.toString())}
          value={itemSelect}
          setCurrentValue={va => onSelectCity(va)}
          onScroll={handleScroll}
          items={cityList}
          itemLabel='name'
        />
      </div>
      {
        nearByList.length ? (
          <div className={styles.nearby_cities}>
            <h2>Nearby cities</h2>

            <ul>
              {
                nearByList.map((nearItem, inx) => (
                  <li key={'list-neat-' + inx}>{nearItem.name} -  <i>{nearItem.distance.toFixed(2)} km</i></li>
                ))
              }
            </ul>
          </div>
        ) : null
      }

    </section>
  );
};
