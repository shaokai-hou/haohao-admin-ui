import request from '@/utils/request'

// 分页
export function apiPage(query) {
  return request({
    url: '/system/user/page',
    method: 'get',
    params: query
  })
}

export function apiSave(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}

export function apiUpdate(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data
  })
}

export function apiDelete(id) {
  return request({
    url: '/system/user/' + id,
    method: 'delete'
  })
}

export function apiResetPassword(userIds) {
  return request({
    url: '/system/user/reset/password/' + userIds,
    method: 'put'
  })
}
