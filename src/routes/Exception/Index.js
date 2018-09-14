import React from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import { Button } from 'antd';
import DocumentTitle from 'react-document-title';
import styles from './index.less';
// import logo from '../assets/logo.svg';
import { getRoutes } from '@/utils/utils';

class UserLayout extends React.PureComponent {
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title="exception">
        <div className={styles.container}>
          <Button
            type="primary"
            onClick={() => {
            window.location.href = '/pisapi/admin/logout';
          }}
          >登出
          </Button>
          <div className={styles.content}>
            <Switch>
              {getRoutes(match.path, routerData).map(item =>
                (
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                )
              )}
              <Redirect exact from="/exception" to="/exception/401" />
            </Switch>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
