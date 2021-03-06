import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
// import Cookies from 'js-cookie';

import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './rollbar';

import './index.less';


// Cookies.set('JSESSIONID', 'value');
// 1. Initialize
const app = dva({
  history: createHistory(),
});
// 2. Plugins
app.use(createLoading());

// 3. Register global model

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store;  // eslint-disable-line
