import request from '@/utils/request'

const MODULE_BASE_URL = '/softwaremanage'

export function softwareRegistrationReview(rsoftwareId, isApproved) {
  return request({
    url: `${MODULE_BASE_URL}/approve-software-register/`,
    method: 'post',
    data: {
      rsoftware_id: rsoftwareId,
      is_approved: isApproved
    }
  })
}

export function softwareRegister(registerInfo) {
  return request({
    url: `${MODULE_BASE_URL}/registsoftware-add/`,
    method: 'post',
    data: registerInfo
  })
}

export function RegisteredSoftwareQuery(params) {
  return request({
    url: `${MODULE_BASE_URL}/registsoftware-query-all/`,
    method: 'post',
    data: params
  })
}

export function softwareQuery(params) {
  return request({
    url: `${MODULE_BASE_URL}/software-query-all/`,
    method: 'post',
    data: params
  })
}

export function softwareUpdate(editedSoftware) {
  return request({
    url: `${MODULE_BASE_URL}/update-software/`,
    method: 'post',
    data: editedSoftware
  })
}

export function softwarDelete(softwarId) {
  return request({
    url: `${MODULE_BASE_URL}/software-delete/`,
    method: 'post',
    data: {
      software_id: softwarId
    }
  })
}
