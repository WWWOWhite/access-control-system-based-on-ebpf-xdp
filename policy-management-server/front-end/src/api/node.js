import request from '@/utils/request'

const MODULE_BASE_URL = '/nodemanage'

export function nodeAdd(params) {
  return request({
    url: `${MODULE_BASE_URL}/node-add/`,
    method: 'post',
    data: params
  })
}
export function nodeLoadConfig(params) {
  return request({
    url: `${MODULE_BASE_URL}/node-load-config/`,
    method: 'post',
    data: params
  })
}

export function nodeQuery(params) {
  return request({
    url: `${MODULE_BASE_URL}/node-query-all/`,
    method: 'post',
    data: params
  })
}

export function nodeUpdate(editedNode) {
  return request({
    url: `${MODULE_BASE_URL}/node-update/`,
    method: 'post',
    data: editedNode
  })
}

export function nodeDelete(params){
	return request({
	  url: `${MODULE_BASE_URL}/node-delete/`,
	  method: 'post',
	  data: params
	})
}




export function logQuery(params) {
  return request({
    url: `${MODULE_BASE_URL}/log-query-all/`,
    method: 'post',
    data: params
  })
}




export function addWhite(params) {
  return request({
    url: `${MODULE_BASE_URL}/add-white/`,
    method: 'post',
    data: params
  })
}

export function delWhite(params) {
  return request({
    url: `${MODULE_BASE_URL}/del-white/`,
    method: 'post',
    data: params
  })
}


export function deleteAllWhite(params){
  return request({
    url: `${MODULE_BASE_URL}/del-all-white/`,
    method: 'post',
    data: params
  })
}