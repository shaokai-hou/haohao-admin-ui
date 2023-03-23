import request from '@/utils/request'

export function apiPage(query) {
  return request({
    url: '/system/param/page',
    method: 'get',
    params: query
  })
}

export function apiSave(data) {
  return request({
    url: '/system/param',
    method: 'post',
    data
  })
}

export function apiUpdate(data) {
  return request({
    url: '/system/param',
    method: 'put',
    data
  })
}

export function apiDelete(id) {
  return request({
    url: '/system/param/' + id,
    method: 'delete'
  })
}
