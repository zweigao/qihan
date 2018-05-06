import React, {Component} from 'react';
import styles from './layout.less';
import {browserHistory,Link} from 'dva/router';
import {Menu,Icon} from 'antd';

class Layout extends Component {

  constructor(props) {
    super(props);
  }

  logout = (obj) => {
    if (obj.key === 'logout') {
      browserHistory.push('/login')
      sessionStorage.removeItem('tokenID')
      sessionStorage.removeItem('userInfo')
    }
  }

  render() {
    return (
      <div className={styles["ant-layout-top"]}>
        <div className={styles["ant-layout-header"]}>
          <div className={styles["ant-layout-wrapper"]}>
            <div className={styles["ant-layout-logo"]}></div>
            <Menu onClick={this.logout} mode="horizontal" style={{lineHeight: '64px',float:'right'}} className="header-menu">
              <Menu.Item key="1"><Link to="/notification"><Icon type="bulb" style={{fontSize:'large'}}/>公告</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/customer"><Icon type="customer-service" style={{fontSize:'large'}}/>客服</Link></Menu.Item>
              <Menu.Item key="logout"><Icon type="logout" style={{fontSize:'large',color:'#666'}} title="退出登录"/></Menu.Item>
            </Menu>
          </div>
        </div>
        <div className={styles["ant-layout-wrapper"]}>
          <div className={styles["ant-layout-container"]}>
            {this.props.children}
          </div>
        </div>
        <div className={styles['ant-layout-footer']}>
          Copyright &copy; 2016 版权所有 启翰教育培训中心 <a target="_blank" href="http://www.miitbeian.gov.cn/state/outPortal/loginPortal.action;jsessionid=4PvpYY9fzPVkZ1FVbrLLfWTJyC442MnDFGn2vWyWkrFtpdQyVBQS!-1601873697">粤ICP备案号：4535060号</a>
        </div>
      </div>
    );
  }

}

export default Layout;
