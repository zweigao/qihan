/**
 * Created by fangf on 2016/11/21.
 */
import axios from 'axios';
import { param2Query } from '../utils/requestUtil';

export function getApplymentList() {
  return axios.get('/RegisterTimingOptionManager/getRegisterItesList.action');
}

export function addTime(menuId,displayContent,optionActivityTimestamp,registerActivityTimstamp) {
  return axios.post('/RegisterTimingOptionManager/create.action',
    {displayContent,registerActivityTimstamp,optionActivityTimestamp,registerItem:{id:menuId}});
}

export function getTimeList(menuItemId) {
  return axios.get('/RegisterTimingOptionManager/Retrive.action',{params:{menuItemId}})
}

export function delTime(id) {
  return axios.post('/RegisterTimingOptionManager/Delete.action',param2Query({id}))
}

export function updTime(id,displayContent,optionActivityTimestamp,registerActivityTimstamp) {
  return axios.post('/RegisterTimingOptionManager/Update.action',
    {id,displayContent,registerActivityTimstamp,optionActivityTimestamp});
}

export function getExamList() {
  return axios.get('/CourseExamTimingOptionManager/getCourseItesList.action');
}

export function addExamTime(menuId,displayContent,optionActivityTimestamp,examTimestamp) {
  return axios.post('/CourseExamTimingOptionManager/create.action',
    {displayContent,examTimestamp,optionActivityTimestamp,courseItem:{id:menuId}});
}

export function getExamTimeList(menuItemId) {
  return axios.get('/CourseExamTimingOptionManager/Retrive.action',{params:{menuItemId}})
}

export function delExamTime(id) {
  return axios.post('/CourseExamTimingOptionManager/Delete.action',param2Query({id}))
}

export function updExamTime(id,displayContent,optionActivityTimestamp,examTimestamp) {
  return axios.post('/CourseExamTimingOptionManager/Update.action',
    {id,displayContent,examTimestamp,optionActivityTimestamp});
}
