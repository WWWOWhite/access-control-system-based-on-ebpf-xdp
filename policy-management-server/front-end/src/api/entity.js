import request from '@/utils/request'

const MODULE_BASE_URL = '/entitymanage'

export function entityWithdraw(entityPid) {
  return request({
    url: `${MODULE_BASE_URL}/withdraw-entity/`,
    method: 'post',
    data: {
      entity_pid: entityPid
    }
  })
}

export function entityCalculateParticalkey(entityPid) {
  return request({
    url: `${MODULE_BASE_URL}/calculate-particalkey/`,
    method: 'post',
    data: {
      entity_pid: entityPid
    }
  })
}

export function entityQuery(params) {
  return request({
    url: `${MODULE_BASE_URL}/query-entity-all/`,
    method: 'post',
    data: params
  })
}

export function entityQueryAlive(params) {
  return request({
    url: `${MODULE_BASE_URL}/entity-query-alive/`,
    method: 'post',
    data: params
  })
}