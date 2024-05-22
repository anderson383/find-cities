
export const getParamsUrl = (param:string, url = typeof window === 'undefined' ? '' : window.location.href) => {
  try {
    const urlInstance = new URL(url).searchParams;

    return urlInstance.get(param) || '';
  } catch (e) {
    return '';
  }
};
