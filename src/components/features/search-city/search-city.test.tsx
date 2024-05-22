
import {
  render, screen
} from '@testing-library/react';
import { act } from 'react';
import { RepositoryIocProvider } from '../../../services/config/context';
import { SearchCity } from './search-city';
import { unmountComponentAtNode } from 'react-dom';

describe('Test feature search-city', () => {
  let containerToast:any = null;

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
      <RepositoryIocProvider>
        <SearchCity />
      </RepositoryIocProvider>
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
});
