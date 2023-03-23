import request from '@/utils/request'

// 分页
export function apiPage(query) {
  return request({
    url: '/system/menu/page',
    method: 'get',
    params: query
  })
}

export function apiSave(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data
  })
}

export function apiUpdate(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    data
  })
}

export function apiDelete(id) {
  return request({
    url: '/system/menu/' + id,
    method: 'delete'
  })
}
