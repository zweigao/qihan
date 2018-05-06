import './index.html';
import './index.less';
import dva from 'dva';
import { message } from 'antd';
import axios from 'axios'
import moment from 'moment';
import createLoading from './utils/loading'
import { browserHistory } from 'dva/router';
import 'moment/locale/zh-cn';

// 1. Initialize
const app = dva({
  initialState: {},
  history: browserHistory
});

moment.locale('zh-cn');

// axios.defaults.baseURL = 'http://192.168.88.248/QihanOA/'
axios.defaults.baseURL = 'http://114.215.220.4:8080/QihanOA/'
// axios.defaults.baseURL = 'http://123.207.119.159:8080/QihanOA/'
// axios.defaults.baseURL = 'http://u2.webcube.cc:8080/QihanOA/'

axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('tokenID')
  if (token) {
    config.headers.common['Authorization'] = token
  }
  return config
})

axios.interceptors.response.use((res) => {
  /*if (res.status >= 200 && res.status < 300) {
    if (res.data.code < 0) {
      message.error(res.data.message, 4);
    }
  } else {
    message.error('服务器异常：'+res.statusText, 4);
  }*/
  return res
}, (err) => {
  if (err.response.status === 403) { // token不存在或已过期
    sessionStorage.setItem('nextPath', location.pathname)
    sessionStorage.removeItem('tokenID')
    message.warn('请先登录');
    browserHistory.push('/login')
    return Promise.resolve({data: null, code: -1})
  } else {
    message.error('服务器异常：'+ err, 4);
  }
  return Promise.reject(err)
})


message.config({
  duration: 2
});

// 2. Plugins
app.use(createLoading());

// 3. Model
//app.model(require('./models/example'));
app.model(require('./models/user'));
app.model(require('./models/notify'));
app.model(require('./models/customer'));
app.model(require('./models/exam'));
app.model(require('./models/course'));
app.model(require('./models/account'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
