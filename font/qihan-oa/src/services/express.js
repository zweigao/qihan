/**
 * Created by fangf on 2016/12/22.
 */
import axios from 'axios';

export function add(code,companyName,fare,registerId) {
  return axios.post('/ExpressManager/sendAnExpress.action',{code,companyName,fare,examRegister: {id: registerId}})
}

export function upd(id,code,companyName,fare) {
  return axios.post('/ExpressManager/updateInfo.action',{id,code,companyName,fare})
}

export function del(id) {
  return axios.post('/ExpressManager/deleteAnInfo.action',{id})
}

export function getAll() {
  return axios.get('/ExpressManager/retrieveAllInfo.action')
}

export function getListById(registerId) {
  return axios.get('/ExpressManager/getInfoByRegisterId.action', {params:{registerId}})
}

export function exportData(registerItemIds) {
  return axios.post('/ExpressManager/ExpressInfoExport.action', registerItemIds, {responseType: 'blob'})
}

export function getExpressData(expressCode) {
  return axios.get('/HTTPProxy/getExpressRealtimeInfo.action',{params:{expressCode}});
}
