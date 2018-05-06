import axios from 'axios'
import qs from 'qs'

export function getCustomerServiceHistory (studentId) {
  return axios.post('CustomerServiceInfo/getCustomerServiceHistory.action', qs.stringify({ studentId }))
}

export function sendRequest (studentId, content) {
  return axios.post('CustomerServiceInfo/sendAnCoutemerRequest.action', qs.stringify({ studentId, content }))
}
