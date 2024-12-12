import request from '@/utils/request'

const MODULE_BASE_URL = '/usermanage'

export function login(data) {
  return request({
    url: `${MODULE_BASE_URL}/user-login/`,
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `${MODULE_BASE_URL}/user-info/`,
    method: 'post',
    // params: { token }
    data: { user_id: token }
  })
}

export function logout() {
  return request({
    url: `${MODULE_BASE_URL}/user-logout/`,
    method: 'post'
  })
}

export function userApply(user) {
  return request({
    url: `${MODULE_BASE_URL}/user-register/`,
    method: 'post',
    data: user
  })
}

export function userApplyReview(userId, isApproved) {
  return request({
    url: `${MODULE_BASE_URL}/approve-register/`,
    method: 'post',
    data: {
      user_id: userId,
      is_approved: isApproved
    }
  })
}

export function userDelete(userId) {
  return request({
    url: `${MODULE_BASE_URL}/delete-user/`,
    method: 'post',
    data: {
      user_id: userId
    }
  })
}

export function userUpdate(editedUser) {
  return request({
    url: `${MODULE_BASE_URL}/user-update/`,
    method: 'post',
    data: editedUser
  })
}

export function AppliedUserQuery(params) {
  return request({
    url: `${MODULE_BASE_URL}/registered-user-query-all/`,
    method: 'post',
    data: params
  })
}

export function userQuery(params) {
  return request({
    url: `${MODULE_BASE_URL}/user-query-all/`,
    method: 'post',
    data: params
  })
}
