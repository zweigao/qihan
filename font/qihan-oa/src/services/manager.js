/**
 * Created by fangf on 2016/12/21.
 */
import axios from 'axios'

export function getAll(token_type) {
  return axios.get('/SUManager/getManagerList.action',{params:{token_type}});
}

export function add(managerName,userName,password,identityCardCode,token_type) {
  return axios.post('/SUManager/createAManager.action',{managerName,userName,password,identityCardCode,token_type})
}

export function upd(id,managerName,userName,password,identityCardCode) {
  return axios.post('/SUManager/updateManagerInfo.action',{id,managerName,userName,password,identityCardCode})
}

export function ban(id,isBand) {
  return axios.post('/SUManager/bandAManager.action',{id,isBand})
}

export function changePwd(managerId,oldPassword,newPassword) {
  return axios.post('/SUManager/updatePassword.action',{managerId,oldPassword,newPassword})
}
