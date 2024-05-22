
import {
  fireEvent, render, screen
} from '@testing-library/react';
import { act } from 'react';
import { AutoComplete } from './autocomplete';
import { unmountComponentAtNode } from 'react-dom';

describe('Test component autocomplete', () => {
  let containerToast:any = null;
  const mockList = [
    {
      'country': 'US',
      'name': 'University Park',
      'lat': '32.28343',
      'lng': '-106.75334'
    },
    {
      'country': 'US',
      'name': 'Upper Fruitland',
      'lat': '36.71584',
      'lng': '-108.31424'
    },
    {
      'country': 'US',
      'name': 'Vado',
      'lat': '32.11176',
      'lng': '-106.6625'
    }
  ];

  const onChangeTextMock = jest.fn();
  const setCurrentValueMock = jest.fn();
  const onScrollMock = jest.fn();

  afterEach(() => {
    unmountComponentAtNode(containerToast);
    containerToast?.remove();
    containerToast = null;
  });

  beforeEach(() => {
    containerToast = document.createElement('div');
    containerToast.setAttribute('id', 'portal-root');

    document.body.appendChild(containerToast);
  });

  const setup = () => {
    return render(
      <AutoComplete
        items={mockList}
        name='Search'
        setCurrentValue={setCurrentValueMock}
        onChangeText={onChangeTextMock}
        value={''}
        valueText=''
        itemLabel='name'
        onScroll={onScrollMock}
        placeholder='Buscar prueba'
      />
    );
  };

  test('Should render component', async () => {
    // Arrange
    const {asFragment} = setup();

    // Act

    await act(() => Promise.resolve());

    // Assert
    expect(asFragment()).toMatchSnapshot();
  });

  test('Should write in input', async () => {
    // Arrange
    setup();
    const inputSearch = screen.getByPlaceholderText('Buscar prueba');

    // Act

    fireEvent.click(inputSearch);
    fireEvent.change(inputSearch, { target: { value: 'University' } });
    await act(() => Promise.resolve());

    // Assert
    expect(onChangeTextMock).toHaveBeenCalledWith('University');
  });

  test('Should clear text in input', async () => {
    // Arrange
    setup();
    const iconClear = screen.getByRole('icon-clear');
    const inputSearch = screen.getByPlaceholderText('Buscar prueba');

    // Act

    fireEvent.change(inputSearch, { target: { value: 'University' } });
    fireEvent.click(iconClear);
    await act(() => Promise.resolve());

    // Assert
    expect(onChangeTextMock).toHaveBeenCalledWith('');
  });

  test('Should press key for div', async () => {
    // Arrange
    const {container} = setup();
    const {firstChild} = container;

    fireEvent.keyDown(firstChild, { key: 'Enter'});

    // Act
    fireEvent.keyDown(firstChild, { key: 'ArrowDown' });
    fireEvent.keyDown(firstChild, { key: 'ArrowDown' });
    fireEvent.keyDown(firstChild, { key: 'ArrowDown' });

    fireEvent.keyDown(firstChild, { key: 'Enter' });
    await act(() => Promise.resolve());

    // Assert
    // Expect vado in array
    expect(setCurrentValueMock).toHaveBeenCalledWith(mockList[2]);
  });

  test('Should click in second option', async () => {
    // Arrange
    setup();

    const optionList = screen.getByText('Upper Fruitland');

    // Act
    fireEvent.click(optionList);
    await act(() => Promise.resolve());

    // Assert
    // Expect Upper Fruitland
    expect(setCurrentValueMock).toHaveBeenCalledWith(mockList[1]);
  });
});
