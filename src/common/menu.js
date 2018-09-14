import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '主页',
    icon: 'dashboard',
    path: 'index',
    children: [{
      name: '首页',
      path: 'index',
    }],
  },
  {
    name: '系统设置',
    icon: 'dashboard',
    path: 'system',
    authority: 'super_admin',
    children: [
      {
        name: '用户管理',
        path: 'user',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    hideInMenu: true,
    children: [{
      name: '401',
      path: '401',
    }, {
      name: '403',
      path: '403',
    }, {
      name: '404',
      path: '404',
    }, {
      name: '500',
      path: '500',
    }],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
