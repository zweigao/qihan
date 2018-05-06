import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';
import { Link } from 'dva/router';
import styles from './IndexPage.less';
import moment from 'moment'

function IndexPage() {
  return (
    <Row gutter={16}>
      <Col span={15}>
        <Card title="启翰教育CMS系统">
          <div className={styles.normal}>
            {moment(+new Date()).format('a')}好，欢迎登陆启翰教育CMS系统。
          </div>
        </Card>
      </Col>
    </Row>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
