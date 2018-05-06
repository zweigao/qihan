import React from 'react';
import {connect} from 'dva';
import { Card, WhiteSpace, Icon, List } from 'antd-mobile';
import { routerRedux, Link } from 'dva/router';
import VideoListComponent from '../components/Video/VideoList'

function VideoList({ dispatch, video }) {
  const listProps = {
    list: video.videoList
  }
  return (
    <div>
      <WhiteSpace></WhiteSpace>
      <VideoListComponent {...listProps}></VideoListComponent>
    </div>
  );
}

export default connect(({ video }) => ({ video }))(VideoList);
