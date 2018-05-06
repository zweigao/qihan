/**
 * Created by fangf on 2016/11/25.
 */
import axios from 'axios';
import {param2Query} from '../utils/requestUtil'

export function getList(studentId) {
  return axios.post('/CustomerServiceInfo/getCustomerServiceHistory.action',param2Query({studentId}))
}

export function sendMsg(studentId,content) {
  return axios.post('/CustomerServiceInfo/sendAnCoutemerRequest.action',param2Query({studentId,content}))
}
