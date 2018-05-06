import axios from 'axios'
import qs from 'qs'

export function login (userName, password) {
  return axios.post('SecurityAction/getTokenWithPhoneCode.action', qs.stringify({ phoneCode: userName, password }))
}

export function getExamRegistorInfo (studentId) {
  return axios.post('UserInfo/getExamRegistorInfo.action', qs.stringify({ studentId }))
}

export function confirmInfo (registerId) {
  return axios.post('UserInfo/confirmAnRegisterInfo.action', qs.stringify({ registerId }))
}

export function getStudentInfo (studentId) {
  return axios.post('UserInfo/getStudentInfo.action', qs.stringify({ studentId }))
}

export function getExamChenInInfo (studentId) {
  return axios.post('UserInfo/getExamChenInInfo.action', qs.stringify({ studentId }))
}

export function getNoticeInfo () {
  return axios.get('PublicNoticeInfoFetch/getPublicInfoList.action')
}

export function getMoreService (studentId) {
  return axios.get('CustomerServiceInfo/hadNewMessage.action', { params: { studentId } })
}
