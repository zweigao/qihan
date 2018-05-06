import axios from 'axios';
let baseUrl = axios.defaults.baseURL;

export default function (img) {
  return baseUrl + 'FileManager/access.action?fileName=' + encodeURIComponent(img)
}