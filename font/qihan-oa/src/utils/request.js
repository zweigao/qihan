import fetch from 'dva/fetch';
import {message} from 'antd';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  message.error('服务器异常：'+response.statusText);
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => ({ data }))
    .catch((err) => ({ err }));
}

export const host = 'http://192.168.88.248/QihanOA/';

export function post(url, params) {
  let headers = {"Content-Type": "application/x-www-form-urlencoded"};
  let body = '';
  if (Array.isArray(params)){
    headers['Content-Type'] = 'application/json';
    body = '['+params+']';
  } else {
    let keys = Object.keys(params);
    keys.map(k=> {
      let v = params[k];
      body += ('&' + k + '=' + v);
    });
    body = body.substr(1);
  }
  let options = {
    method: 'post',
    headers,
    body
  };
  return request(host+url,options).then((d)=>{
    if (d.data.code<0)
      message.error(d.data.message);
    return d;
  })
}
