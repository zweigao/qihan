import React from 'react';
import {connect} from 'dva';
import { Card, WhiteSpace, Icon, List } from 'antd-mobile';
import { routerRedux, Link } from 'dva/router';
import CourseList from '../components/Video/CourseList'

function Exam({ dispatch, exam, location }) {
  const listProps = {
    list: exam.courseList,
    location
  }
  return (
    <div>
      <WhiteSpace></WhiteSpace>
      <CourseList {...listProps}></CourseList>
    </div>
  );
}

export default connect(({ exam }) => ({ exam }))(Exam);
