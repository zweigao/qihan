/**
 * Created by fangf on 2016/11/25.
 */
import axios from 'axios';
import {param2Query} from '../utils/requestUtil'

export function getAll(studentId) {
  return axios.post('/UserInfo/getExamChenInInfo.action',param2Query({studentId}))
}
