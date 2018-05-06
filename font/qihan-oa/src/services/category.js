/**
 * Created by fangf on 2016/11/16.
 */
import { param2Query } from '../utils/requestUtil';
import axios from 'axios'

export function getList() {
  return axios.get('MenuManager/RetrieveList.action');
}

export function add(fahterItem,name) {
  return axios.post('/MenuManager/create.action',param2Query({fahterItem,name}))
}

export function del(id) {
  return axios.post('/MenuManager/Delete.action',param2Query({id}))
}

export function upd(id,name) {
  return axios.post('/MenuManager/Update.action',param2Query({id,name}))
}

export function setStatus(id, status) {
  return axios.post('/MenuManager/Update.action',param2Query({id,...status}))
}

export function updateStruct(struct) {
  return axios.post('/MenuManager/structUpdate.action',struct)
}

export function getFieldsList() {
  return axios.get('/RegisterMateriaManager/retrieveMateriaList.action')
}

export function saveFields(menuId,fields) {
  return axios.post('/RegisterMateriaManager/addMateriaForRegister.action',{...fields,registerItem:{id:menuId}})
}

export function delFieldsSet(menuId) {
  return axios.post('/RegisterMateriaManager/deleteMateriaSet.action',{menuId})
}

export function copyResourse(sourceId, destinyId) {
  return axios.post('/CourseResourceCopy/copyQuestionBankAndVideo.action',{ sourceId: sourceId, destinyId })
}
