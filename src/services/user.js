// import { stringify } from 'qs';
import request from '../utils/axios';

export async function query(params) {
  return request('/pisapi/admin/users', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryCurrent() {
  return request('/pisapi/admin/checkLogin');
}
export async function logout() {
  return request('/pisapi/admin/logout');
}

export async function add(params) {
  return request('/pisapi/admin/user', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function edit(params) {
  return request(`/pisapi/admin/user/${params.key}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
export async function remove(params) {
  return request(`/pisapi/admin/user/${params.key}`, {
    method: 'DELETE',
  });
}
