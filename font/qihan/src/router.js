import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'dva/router';
import Layout from './components/Layout';
import Main from './routes/Main';
import LoginPage from './routes/LoginPage';
import Account from './routes/Account';
import Customer from './routes/Customer';
import Notification from './routes/Notification';
import EnterExam from './routes/EnterExam';
import Paper from './routes/Paper';
import PaperQuestions from './routes/PaperQuestions';
import Chapter from './routes/Chapter';
import Video from './routes/Video';
import NotFound from './routes/NotFound';

function requireAuth({location}, replace) {
  if (location.pathname!='/login'&&!sessionStorage.tokenID)
    replace({pathname: '/login'})
}

export default function({ history }) {

  return (
    <Router history={history}>
      <Route path="/login" component={LoginPage}/>
      <Route path="/" component={Layout} onEnter={requireAuth}>
        <Route component={Main}>
          <IndexRoute component={Account}/>
          <Route path="customer" component={Customer}/>
          <Route path="notification" component={Notification}/>
          <Route path="enter-exam" component={EnterExam}/>
          <Route path="paper/:menuId" component={Paper}/>
          <Route path="questions/:menuId" component={PaperQuestions}/>
          <Route path="questions/:courseId/:paperName" component={PaperQuestions}/>
          <Route path="chapter/:menuId" component={Chapter}/>
          <Route path="video/:menuId" component={Video}/>
        </Route>
        <Route path='*' component={NotFound} />
      </Route>
    </Router>
  );
};
