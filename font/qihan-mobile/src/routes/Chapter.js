import React from 'react';
import {connect} from 'dva';
import { Card, WhiteSpace, Icon, List } from 'antd-mobile';
import { routerRedux, Link } from 'dva/router';
import CourseList from '../components/Video/CourseList'

function Chapter({ dispatch, exam, location, params, loading }) {
  const listProps = {
    list: exam.chapterList,
    location,
    next: (id) => {
      dispatch({ type: 'exam/fetchQuestions', payload: { type: 'chapter', id } })
    }
  }
  return (
    <div>
      <CourseList {...listProps}></CourseList>
    </div>
  );
}

export default connect(({ exam }) => ({ exam }))(Chapter);
