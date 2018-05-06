/**
 * Created by fangf on 2016/11/17.
 */
import { param2Query } from '../utils/requestUtil';
import axios from 'axios'

export function getAll() {
  return axios.get('/PublicNoticeManager/RetriveList.action');
}

export function del(id) {
  return axios.post('/PublicNoticeManager/Delete.action',param2Query({id}))
}

export function upd(id,content) {
  return axios.post('/PublicNoticeManager/Update.action',param2Query({id,content}))
}

export function add(content) {
  return axios.post('/PublicNoticeManager/create.action',param2Query({content}))
}
