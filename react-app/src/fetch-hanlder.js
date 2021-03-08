const getDomainUrl = (url) => {
  const serviceUrl = '/api/'
  const newUrl = serviceUrl + url;
  return newUrl;
};

const getHeaders = () => {
  const headers = new Headers();
  headers.set('Accept', 'application/json');
  headers.set('Pragma', 'no-cache');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Content-Type', 'application/json');
  headers.set('Access-Control-Allow-Origin', '*');
  return headers;
};

const fetchResult = async (response) => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(response);
};

const getAll = async (url) => {
  const newUrl = getDomainUrl(url);
  const response = await fetch(newUrl, { method: 'GET', headers: getHeaders() });
  const result = await fetchResult(response);
  return result;
};

const post = async (url, body = {}) => {
  const newUrl = getDomainUrl(url);
  const response = await fetch(newUrl, { method: 'POST', body: JSON.stringify(body), headers: getHeaders() });
  const result = await fetchResult(response);
  return result;
};

const put = async (url, body = {}) => {
  const newUrl = getDomainUrl(url);
  const response = await fetch(newUrl, { method: 'PUT', body: JSON.stringify(body), headers: getHeaders() });
  const result = await fetchResult(response);
  return result;
};

module.exports = {
  getAll,
  post,
  put,
};
