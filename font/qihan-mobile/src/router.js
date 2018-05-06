import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, IndexRedirect } from 'dva/router';
import IndexPage from './routes/IndexPage';
import Container from './routes/Container';
import Login from './routes/Login';
import Account from './routes/Account';
import Info from './routes/Info';
import Service from './routes/Service';
import Checkin from './routes/Checkin';
import Register from './routes/Register';
import Notification from './routes/Notification';
import Video from './routes/Video';
import VideoList from './routes/VideoList';
import Exam from './routes/Exam';
import Chapter from './routes/Chapter';
import Paper from './routes/Paper';
import Question from './routes/Question';
import NoFound from './routes/NoFound';
import Applyment from './routes/Applyment';

function requireAuth({location}, replace) {
  if (!/(\/login)|(\/applyment)/.test(location.pathname) && !sessionStorage.tokenID) {
    sessionStorage.setItem('nextPath', location.pathname)
    replace({pathname: '/login'})
  }
}

export default function({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={Container} onEnter={requireAuth}>
        <IndexRedirect to="/account" />
        <Route path="/login" component={Login} name="登录"></Route>
        <Route path="/account" component={Account}></Route>
        <Route path="/account/info" component={Info}></Route>
        <Route path="/account/service" component={Service}></Route>
        <Route path="/account/checkin" component={Checkin}></Route>
        <Route path="/account/register" component={Register}></Route>
        <Route path="/account/notification" component={Notification}></Route>
        <Route path="/video" component={Video}></Route>
        <Route path="/video/list/:vedeoId" component={VideoList}></Route>
        <Route path="/exam" component={Exam}></Route>
        <Route path="/exam/chapter/:chapterId" component={Chapter}></Route>
        <Route path="/exam/paper/:paperId" component={Paper}></Route>
        <Route path="/exam/question/:queId" component={Question}></Route>
        <Route path="/applyment" component={Applyment}></Route>
      </Route>
      <Route path="*" component={NoFound} />
    </Router>
  );
};
