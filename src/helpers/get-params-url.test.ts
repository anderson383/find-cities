import { getParamsUrl } from './get-params-url';

describe('Test helper getParamsUrl', () => {
  test('get param id', () => {
    const params = getParamsUrl('id', 'https://www.test.com?id=hola');

    expect(params).toBe('hola');
  });

  test('Should error', () => {
    const params = getParamsUrl('esto no es una url');

    expect(params).toBe('');
  });
});
