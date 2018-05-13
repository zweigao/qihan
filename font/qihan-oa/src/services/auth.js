import axios from 'axios'


export function login (userName, password) {
  return axios.post('SecurityManager/getTokenWithPassword.action', { userName, password })
}