import React from 'react';
import {connect} from 'dva';
import RegisterInfoPopup from '../components/Account/RegisterInfoPopup.js'
import styles from './Account.less'
import { Card, WhiteSpace, Icon, List, Badge } from 'antd-mobile';
import { routerRedux, Link } from 'dva/router';

function Account({ dispatch, account }) {
  const regisProps = {
    examRegistorInfo: account.examRegistorInfo,
    curInfoIndex: account.curInfoIndex,
    confirmInfo: (id) => {
      dispatch({type: 'account/confirmInfo', payload: { id }})
    }
  }
  return (
    <div className={styles.card}>
      <Link to="/account/info">
      <Card full>
        <WhiteSpace size="sm"></WhiteSpace>
        <Card.Header
          title={account.info.name}
          thumb={require('../assets/avatar.png')}
          extra={<Icon type="right" />}
        />
      </Card>
      </Link>
      <WhiteSpace size="lg"></WhiteSpace>
      <List className={styles.accountList}>
        <Link to="/account/notification"><List.Item thumb={<Icon type="notification" />} arrow="horizontal" key={1}>{'公告'}</List.Item></Link>
        <Link to="/account/service"><List.Item thumb={<Badge dot={account.moreService}><Icon type="customerservice" /></Badge>} arrow="horizontal" key={2}>{'客服'}</List.Item></Link>
        <Link to="/account/register"><List.Item thumb={<Icon type="book" />} arrow="horizontal" key={3}>{'报名信息'}</List.Item></Link>
        <Link to="/account/checkin"><List.Item thumb={<Icon type="file-text" />} arrow="horizontal" key={3}>{'报考信息'}</List.Item></Link>
      </List>
      { account.examRegistorInfo.length > 0 ? <RegisterInfoPopup {...regisProps}></RegisterInfoPopup>: null }
    </div>
  );
}

export default connect(({ account }) => ({ account }))(Account);
