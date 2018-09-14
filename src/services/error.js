import request from '../utils/axios';

export async function query(code) {
  return request(`/api/${code}`);
}
