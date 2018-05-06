import React from 'react';
import {connect} from 'dva';
import { Card, WhiteSpace, Icon, List } from 'antd-mobile';
import styles from './Notification.less'
import moment from 'moment'
import EmptyHint from '../components/EmptyHint'

function Notification({ dispatch, account: { noticeInfo } }) {
  
  return (
    <div>
      {
        noticeInfo.length > 0 ?
        noticeInfo.map((n, index) => {
          return (
            <div key={index}>
              <p className={styles.time}>{moment(n.pubTimestamp).format('YYYY年MM月DD日 HH:mm')}</p>
              <div className={styles.body}>{n.content}</div>
              <WhiteSpace size="lg"></WhiteSpace>
            </div>
          )
        }) :
        <EmptyHint imgNode={<img src={require('../assets/no-message.png')} alt="nothing"/>}></EmptyHint>
      }
    </div>
  );
}

export default connect(({ account }) => ({ account }))(Notification);
