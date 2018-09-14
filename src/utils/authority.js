// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  const auth = localStorage.getItem('antd-pro-authority');
  return auth;
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
}
