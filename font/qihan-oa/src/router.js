import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'dva/router';
import Container from './routes/Container';
import LoginPage from './routes/LoginPage';
import IndexPage from './routes/IndexPage';
import Notify from './routes/students/Notify';
import Applyment from './routes/students/Applyment';
import Logistics from './routes/students/Logistics';
import StudentsList from './routes/students/StudentsList';
import EnterExam from './routes/students/EnterExam';
/*import Form from './routes/component/Form';
import Table from './routes/component/Table';
import Tree from './routes/component/Tree';
import TreeFull from './routes/component/TreeFull';
import Products from './routes/component/Products';*/
import Customer from './routes/customer/Customer';
import SmsAdd from './routes/sms/SmsAdd';
import SmsList from './routes/sms/SmsList';
import VideoAdd from './routes/videos/VideoAdd';
import VideoList from './routes/videos/VideoList';
import QuestionAdd from './routes/questions/QuestionAdd';
import QuestionList from './routes/questions/QuestionList';
import Category from './routes/category/Category';
import ApplymentTime from './routes/register/ApplymentTime';
import ExamTime from './routes/register/ExamTime';
import StaffsAdd from './routes/staffs/StaffsAdd';
import StaffsList from './routes/staffs/StaffsList';
import Achievement from './routes/staffs/Achievement';
import ManagerAdd from './routes/manager/ManagerAdd';
import ManagerList from './routes/manager/ManagerList';
import FinanceAdd from './routes/finance/FinanceAdd';
import FinanceList from './routes/finance/FinanceList';
import MarketAdd from './routes/market/MarketAdd';
import MarketList from './routes/market/MarketList';

function requireAuth({location}, replace) {
  if (location.pathname!='/login'&&!sessionStorage.tokenID)
    replace({pathname: '/login'})
}

export default function({ history }) {
  return (
    <Router history={history}>
      <Route path="login" component={LoginPage} />
      <Route path="/" component={Container} onEnter={requireAuth}>
        <IndexRoute component={IndexPage} />
        <Route path="dashboard" component={IndexPage} />
        <Route path="students">
          <Route path="notify" component={Notify} />
          <Route path="applyment" component={Applyment} />
          <Route path="logistics" component={Logistics} />
          <Route path="list" component={StudentsList} />
          <Route path="enter-exam" component={EnterExam} />
        </Route>
        <Route path="questions">
          <Route path="add" component={QuestionAdd}/>
          <Route path="list" component={QuestionList}/>
        </Route>
        <Route path="register">
          <Route path="applyment-time" component={ApplymentTime} />
          <Route path="exam-time" component={ExamTime} />
        </Route>
        <Route path="videos">
          <Route path="add" component={VideoAdd}/>
          <Route path="list" component={VideoList}/>
        </Route>
        <Route path="category" component={Category}/>
        <Route path="sms">
          <Route path="add" component={SmsAdd}/>
          <Route path="list" component={SmsList}/>
        </Route>
        <Route path="staffs">
          <Route path="add" component={StaffsAdd}/>
          <Route path="list" component={StaffsList}/>
          <Route path="achievement" component={Achievement}/>
        </Route>
        <Route path="manager">
          <Route path="add" component={ManagerAdd}/>
          <Route path="list" component={ManagerList}/>
        </Route>
        <Route path="finance">
          <Route path="add" component={FinanceAdd}/>
          <Route path="list" component={FinanceList}/>
        </Route>
        <Route path="market">
          <Route path="add" component={MarketAdd}/>
          <Route path="list" component={MarketList}/>
        </Route>
        <Route path="customer" component={Customer}/>
        <Route path="customer/:id" component={Customer}/>
        {/*
         <Route path="component">
         <Route path="form" component={Form} />
         <Route path="table" component={Table} />
         <Route path="tree" component={Tree} />
         <Route path="treefull" component={TreeFull} />
         <Route path="redux" component={Products} />
         </Route>
        */}
      </Route>
    </Router>
  );
};
