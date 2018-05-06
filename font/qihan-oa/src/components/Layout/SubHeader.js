import React from 'react';
import styles from './layout.less';
import { Menu } from 'antd';

const SubHeader = React.createClass({

  render: function () {
    return (
      <div className={styles['ant-layout-subheader']}>
        <div className={styles['ant-layout-wrapper']}>
          <Menu mode="horizontal"
                defaultSelectedKeys={['1']} style={{marginLeft: 124}}>
            <Menu.Item key="1">二级导航</Menu.Item>
            <Menu.Item key="2">二级导航</Menu.Item>
            <Menu.Item key="3">二级导航</Menu.Item>
          </Menu>
        </div>
      </div>
    );
  }

});

export default SubHeader;
