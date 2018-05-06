/**
 * Created by fangf on 2016/12/23.
 */
import axios from 'axios';
let baseUrl = axios.defaults.baseURL;

export default function (img) {
  return baseUrl + 'FileManager/access.action?fileName=' + encodeURIComponent(img)
}
