/**
 * Created by fangf on 2016/11/15.
 */
import axios from 'axios'

export function getAll(postData){
  return axios.get('/QuestionBankManager/Retrive.action', {params: {...postData,pageIndex:0,pageSize:0}});
}

export function add(data){
  return axios.post('QuestionBankManager/create.action', {...data})
}

export function del(ids) {
  return axios.post('/QuestionBankManager/Delete.action',ids)
}

export function upd(data) {
  return axios.post('QuestionBankManager/Update.action', {...data})
}

export function updRelative(data) {
  return axios.post('QuestionBankManager/RalativeUpdate.action', data)
}
