/**
 * Created by fangf on 2016/11/21.
 */
import { param2Query } from '../utils/requestUtil';
import axios from 'axios'

export function getExamList() {
  return axios.get('/ExamCheckInManager/ExamHistoryRetrieve.action',{params: {pageIndex:0,pageSize:0}})
}

export function setStatus(changeList) {
  return axios.post('/ExamCheckInManager/ExamStatusChangeMultiple.action',changeList)
}

export function del(examHistoryId) {
  return axios.post('/ExamCheckInManager/ExamCourseUncheckIn.action',param2Query({examHistoryId}))
}

export function exportArchives(registerItemIds) {
  return axios.post('/ExamCheckInManager/examCheckInExport.action', registerItemIds, {responseType: 'blob'})
}

export function exportStudentImg(registerItemIds) {
	alert('开始发送请求')
  return axios.post('/UserInfoManager/exportStudentImg.action', registerItemIds, {responseType: 'blob'})
}
