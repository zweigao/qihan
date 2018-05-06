import axios from 'axios'

export function getMenu () {
  return axios.get('MenuAction/RetrieveList.action')
}

export function getIdCardInfo (idCode) {
  return axios.post('IdentityCardInfo/getIdCardInfo.action', { idCode })
}

export function getMenuItemRegisterInfo (registerItemId) {
  return axios.get('RegisterAction/getMenuItemRegisterInfo.action', { params: { registerItemId }})
}

export function fileUpload (uploadFile, fileType) {
  let formData = new FormData()
  formData.append('uploadFile', uploadFile)
  formData.append('fileType', fileType)
  return axios.post('FileManager/fileUpload.action', formData)
}

export function register (postData) {
  return axios.post('RegisterAction/infoRegister.action', postData)
}

export function getPhoneCodeValidator (phone) {
  return axios.get('RegisterAction/getVerificationSms.action', { params: { phone }})
}

export function getPhoneCodeValidatorForModify (phone) {
  return axios.get('RegisterAction/getVerificationSmsForModify.action', { params: { phone }})
}

export function getApplymentInfo (registerId, idCode) {
  return axios.get('RegisterAction/getOriginInfo.action', { params: { registerId, idCode }})
}

export function updateRegisterInfo (postData) {
  return axios.post('RegisterAction/updateRegisterInfo.action', postData)
}
