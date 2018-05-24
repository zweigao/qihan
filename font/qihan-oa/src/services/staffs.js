/**
 * Created by fangf on 2016/12/21.
 */
import axios from 'axios'

export function getAll() {
	return axios.get('/SalemanManager/retrieveAllSaleman.action');
}

export function add(name,userName,mobile,password,identityCardCode) {
	return axios.post('/SalemanManager/createSaleman.action', {
		name,
		userName,
		mobile,
		password,
		identityCardCode,
		managerName:name,
		token_type:"SALEMAN",
		loginBandom: false,
		activityFlag:true
	})
}

export function upd(dividend, id, name, mobile, identityCardCode) {
	return axios.post('/SalemanManager/updateSaleman.action', {
		dividend,
		id,
		name,
		mobile,
		identityCardCode
	})
}

export function updd(dividend, id) {
	return axios.post('/SalemanManager/updatedividend.action', {
		dividend,
		id
	})
}

export function ban(salemanId, isBan) {
	return axios.post('/SalemanManager/changeSalemanStatus.action', {
		salemanId,
		isBan
	})
}

export function getAchievement(salemanId) {
	return axios.get('/SalemanManager/saleStatis.action', {
		params: {
			salemanId
		}
	})
}

export function exportAchievement(saleManIds) {
	return axios.post('/SalemanManager/BusinessExport.action', saleManIds, {
		responseType: 'blob'
	})
}