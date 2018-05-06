import React from 'react';
import {connect} from 'dva';
import { Card, WhiteSpace, Icon, List } from 'antd-mobile';
import { routerRedux, Link } from 'dva/router';
import SubCourseList from '../components/Video/SubCourseList'

function Paper({ dispatch, exam, location, params, loading }) {
  const listProps = {
    ...exam,
    location,
    id: params.paperId,
    loading,
    getMoreList (id) {
      dispatch({ type: 'exam/fetchSubMenuList', payload: { id, type: 'paper' } })
    },
    next: (id, paperName) => {
      dispatch({ type: 'exam/fetchQuestions', payload: { type: 'paper', id, paperName } })
    }
  }
  return (
    <div>
      <SubCourseList {...listProps}></SubCourseList>
    </div>
  );
}

export default connect(({ exam, loading: { global }}) => ({ exam, loading: global }))(Paper);
