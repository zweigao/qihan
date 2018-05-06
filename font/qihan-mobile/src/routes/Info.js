import React from 'react';
import {connect} from 'dva';
import { Card, WhiteSpace, Icon, List } from 'antd-mobile';
import InfoList from '../components/Info/InfoList.js'
import { browserHistory } from 'dva/router'

function Info({ dispatch, account }) {
  const infoProps = {
    info: account.info,
    logout () {
      dispatch({ type: 'account/logout' })
      browserHistory.push('/login')
    }
  }

  return (
    <div>
      <WhiteSpace size="lg"></WhiteSpace>
      <InfoList {...infoProps}></InfoList>
    </div>
  );
}

export default connect(({ account }) => ({ account }))(Info);
