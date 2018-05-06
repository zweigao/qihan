export const param2Query = (params) => {
  let keys = Object.keys(params);
  let body = ''
  keys.map(k=> {
    let v = params[k];
    body += ('&' + k + '=' + v);
  });
  body = body.substr(1);
  return body
}
