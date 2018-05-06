import './index.html';
import './index.less';
import dva from 'dva';
import axios from 'axios'
import createLoading from 'dva-loading'
import moment from 'moment';
import { browserHistory } from 'dva/router';
import { Toast, WhiteSpace, WingBlank, Button } from 'antd-mobile';

// 1. Initialize
const app = dva({
  initialState: {},
  history: browserHistory,
  onError (e) {
    // Toast.fail(`系统错误: ${e}`)
    console.error(e)
  }
});

// axios.defaults.baseURL = 'http://192.168.88.248/QihanOA/'
axios.defaults.baseURL = 'http://114.215.220.4:8080/QihanOA/'
// axios.defaults.baseURL = 'http://123.207.119.159:8080/QihanOA/'

axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('tokenID')
  if (token) {
    config.headers.common['Authorization'] = token
  }
  return config
})

axios.interceptors.response.use((res) => {
  if (res.status >= 200 && res.status < 300) {
    if (res.data.code < 0) {
      Toast.fail(res.data.message, 4);
    }
  } else {
    Toast.offline('服务器异常：'+res.statusText, 3)
  }
  return res
}, (err) => {
  if (err.response && err.response.status === 403) { // token不存在或已过期
    !sessionStorage.getItem('nextPath') && sessionStorage.setItem('nextPath', location.pathname)
    sessionStorage.removeItem('tokenID')
    Toast.info('请先登录');
    browserHistory.push('/login')
    return Promise.resolve({ data: { data: null, code: -1 } })
  } else {
    Toast.offline('服务器异常：'+ err, 3)
  }
  return Promise.reject(err)
})

import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// 2. Plugins
app.use(createLoading())

// 3. Model
app.model(require('./models/account'));
app.model(require('./models/service'));
app.model(require('./models/video'));
app.model(require('./models/exam'));
app.model(require('./models/global'));
app.model(require('./models/applyment.js'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
