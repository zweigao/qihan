import axios from 'axios'
import {param2Query} from '../utils/requestUtil'

export function login (phoneCode, password) {
  return axios.post('SecurityAction/getTokenWithPhoneCode.action', param2Query({ phoneCode, password }))
}
