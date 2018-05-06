import React from 'react';
import {connect} from 'dva';
import { Card, WhiteSpace, Icon, List } from 'antd-mobile';
import { routerRedux, Link } from 'dva/router';
import CourseList from '../components/Video/CourseList'

function Video({ dispatch, video, location }) {
  console.log(video.courseList)
  const listProps = {
    list: video.courseList,
    location,
    nextPrefix: '/exam/question',
    next: '/video/list'
  }
  return (
    <div>
      <WhiteSpace></WhiteSpace>
      <CourseList {...listProps}></CourseList>
    </div>
  );
}

export default connect(({ video }) => ({ video }))(Video);
