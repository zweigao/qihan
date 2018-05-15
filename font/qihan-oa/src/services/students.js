/**
 * Created by fangf on 2016/11/14.
 */
import axios from 'axios'
import { param2Query } from '../utils/requestUtil';

export async function getAll() {
  return axios.post('UserInfoManager/getStudentList.action',param2Query({pageIndex:0,pageSize:0}));
}

export async function upd(data) {
  return axios.post('UserInfoManager/updateStudentInfo.action',data)
}

export function exportStudentImg(registerItemIds) {
  return axios.post('/UserInfoManager/exportStudentImg.action', registerItemIds, {responseType: 'blob'})
}
