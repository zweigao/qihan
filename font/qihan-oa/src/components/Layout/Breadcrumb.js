import React from 'react';
import {connect} from 'dva';
import styles from './layout.less';
import { Breadcrumb } from 'antd';

const MyBreadcrumb = (props) => {
  return (
    <div className={styles['ant-layout-breadcrumb']}>
      <Breadcrumb>
        {props.bread.map((v,k) => (
          <Breadcrumb.Item key={k}>{v}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );

};

export default connect(({bread})=>({bread}))(MyBreadcrumb);
