/**
 * Created by fangf on 2016/11/15.
 */
import { param2Query } from '../utils/requestUtil';
import axios from 'axios'

export function sendSms(smsModelString,receiverUsersId) {
  return axios.post('SmsNotificationManager/SendUserNotify.action?smsModelString='+smsModelString,receiverUsersId);
}

export function create(content) {
  return axios.post('SmsModelManager/create.action', param2Query({content}));
}

export function getTemplateList() {
  return axios.get('SmsModelManager/RetriveList.action');
}

export function delTemp(id) {
  return axios.post('SmsModelManager/Delete.action',param2Query({id}));
}

export function getStatus() {
  return axios.post('/SmsNotificationManager/SmsSupportStatus.action');
}
