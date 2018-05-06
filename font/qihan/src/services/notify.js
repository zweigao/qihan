/**
 * Created by fangf on 2016/11/25.
 */
import axios from 'axios'
export function getAll() {
  return axios.get('/PublicNoticeInfoFetch/getPublicInfoList.action');
}
