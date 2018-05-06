import React from 'react';
import {connect} from 'dva';
import { Flex, WingBlank } from 'antd-mobile';

const FlexItem = Flex.Item

function EmptyHint({ loading, imgNode }) {

  return (
    !loading ?
    <Flex justify="center" align="center" className="nothing">
        <WingBlank>
          { imgNode || <img src={require('../assets/nothing.png')} alt="nothing"/> }
          <p>暂无记录</p>
        </WingBlank>
    </Flex>:
    null
  )
}

export default connect(({ loading }) => ({ loading: loading.global }))(EmptyHint);

