/**
 * Created by fangf on 2016/11/18.
 */
import { param2Query } from '../utils/requestUtil';
import axios from 'axios'

export function getAll() {
  return axios.post('/StudentRegisterManager/retrieveStudentRegisterList.action',param2Query({pageIndex:0,pageSize:0}))
}

export function setStatus(registerId,checkPass,unPassReason) {
  let data = {registerId,checkPass};
  if (unPassReason) data.unPassReason = unPassReason;
  return axios.post('/StudentRegisterManager/checkStudentRegister.action',param2Query(data))
}

export function setMultipleStatus(registerActivityTimerIds,checkResult,unPassReason) {
  let data = {registerActivityTimerIds,checkResult};
  if (unPassReason) data.unPassReason = unPassReason;
  return axios.post('/StudentRegisterManager/multipleCheckStudentRegister.action',data)
}

export function pay(registerId,payWay,amount,payCode) {
  // console.log(4444)
  return axios.post('/StudentRegisterManager/StudentPayForRegisterFirstCheck.action',param2Query({registerId,payWay,amount,payCode}))
}

export function paySecond(registerId,payWay,amount,payCode) {
  console.log(4444)
  return axios.post('/StudentRegisterManager/StudentPayForRegister.action',param2Query({registerId,payWay,amount,payCode}))
}

export function getExamOptions(registItemId) {
  return axios.post('/ExamCheckInManager/retrieveExamCheckInOptionList.action',param2Query({registItemId}))
}

export function selectExam(userId,examTimerOption,examArea) {
  return axios.post('/ExamCheckInManager/CheckInAnExamItem.action',param2Query({userId,examTimerOption,examArea}))
}

export function upd(data) {
  return axios.post('/StudentRegisterManager/updateRegisterInfo.action',data)
}

export function exportArchives(registerItemIds) {
  return axios.post('/StudentRegisterManager/exportStudentFile.action', registerItemIds, {responseType: 'blob'})
}
