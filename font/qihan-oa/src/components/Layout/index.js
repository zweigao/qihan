/**
 * Created by fangf on 2016/10/11.
 */
import React from 'react';
import styles from './layout.less';
import Breadcrumb from './Breadcrumb';
import {BackTop} from 'antd';
import Aside from './Aside';
import Header from './Header';
import Footer from './Footer';

const Layout = React.createClass({

  render: function () {
    return (
      <div className={styles['ant-layout-aside']+' '+styles['ant-layout-aside-collapse']}>
        <Aside/>
        <BackTop/>
        <div className={styles['ant-layout-main']}>
          <Header/>
          <Breadcrumb/>
          <div className={styles['ant-layout-container']}>
            <div className={styles['ant-layout-content']}>
              {this.props.children}
            </div>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }

});

export default Layout;
