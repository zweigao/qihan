import React from 'react';
import styles from './layout.less';

const Footer = React.createClass({

  render: function () {
    return (
      <div className={styles['ant-layout-footer']}>
        Copyright &copy; 2016 版权所有 启翰教育培训中心 <a target="_blank" href="http://www.miitbeian.gov.cn/state/outPortal/loginPortal.action;jsessionid=4PvpYY9fzPVkZ1FVbrLLfWTJyC442MnDFGn2vWyWkrFtpdQyVBQS!-1601873697">粤ICP备15066005号</a>
      </div>
    );
  }

});

export default Footer;
