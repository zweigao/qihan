import { param2Query } from '../utils/requestUtil';
import axios from 'axios'

export function getSessionList(hasRead) {
  return axios.post('/CustomerServicesManager/getCustomerServiceAskStudentList.action',{hasRead});
}

export function getCurrentSession(studentId) {
  return axios.post('/CustomerServicesManager/getCustomerServiceSingle.action',{studentId})
}

export function getAllBak() {
  return axios.get('CustomerServicesManager/getCustomerSessionList.action');
}

export function reply(userId,content) {
  return axios.post('CustomerServicesManager/replyToCustomer.action', param2Query({userId,content}));
}

export function getUserInfo(id) {
  return axios.post('/UserInfoManager/getUserInfo.action',param2Query({id}))
}
