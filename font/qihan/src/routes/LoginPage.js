import React, {Component} from 'react';
import {connect} from 'dva';
import {Icon,Form,Input,Button,Row,Col} from 'antd';
import styles from '../components/Layout/layout.less';
import classNames from './LoginPage.less';
import * as auth from '../services/auth';
let FormItem = Form.Item;

let login_bg = require('../assets/login_bg.jpg');

class LoginPage extends Component {

  render() {
    return (
      <div className={styles["ant-layout-top"]}>
        <div className={styles["ant-layout-header"]} style={{position:'fixed',width:'100%'}}>
          <div className={styles["ant-layout-wrapper"]}>
            <div className={styles["ant-layout-logo"]}></div>
          </div>
        </div>
        <div className={styles["ant-layout-wrapper"]} style={{background:"url('"+login_bg+"')",backgroundSize:'cover',height:'100%'}}>
          <Row type="flex">
            <Col span="12" offset="6" lg={{span:8,offset:8}}>
              <div className={styles["ant-layout-container"]}>
                <div className={classNames['login-wrapper']}>
                  <LoginForm {...this.props}/>
                </div>
              </div>
            </Col>
          </Row>
          <div className={styles['ant-layout-footer']} style={{color:'white'}}>
            启翰教育 版权所有 © 2017 Web Cube Studio 微立方团队 提供技术支持
          </div>
        </div>
      </div>
    );
  }

}

const LoginForm = Form.create()(React.createClass({

  getInitialState() {
    return {
      loading: false
    }
  },

  contextTypes: {
    router: React.PropTypes.object
  },

  handleSubmit(e) {
    e.preventDefault();
    let {form,dispatch} = this.props;
    form.validateFields((err, values) => {
      if (!err){
        auth.login(values.phone, values.password).then((resp) => {
          this.setState({ loading : false })
          if (resp.data.code === 1) {
            sessionStorage.setItem('tokenID', resp.data.data.tokenId)
            sessionStorage.setItem('userInfo', JSON.stringify(resp.data.data))
            dispatch({
              type:'user/save',
              user:resp.data.data
            });
            const nextPath = sessionStorage.getItem('nextPath')
            this.context.router.push(nextPath || '/')
            sessionStorage.removeItem('nextPath')
          } else {
            form.setFields({
              password: {
                errors: [{
                  field: "",
                  message: resp.data.message
                }]
              }
            });
          }
        }).catch((err)=>{
          form.setFields({
            password: {
              errors: [{
                field: "",
                message: '网络连接异常'
              }]
            }
          });
        });
      }
    });
  },

  render: function () {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state
    const formItemLayout = {
      wrapperCol: { span: 24 }
    };
    return (
      <Form horizontal onSubmit={this.handleSubmit} className={classNames['login-form']}>
        <FormItem
          {...formItemLayout}>
          {getFieldDecorator('phone',{
            rules: [{
              required: true, message: '请填写手机号'
            }]
          })(
            <Input placeholder="请输入手机号" addonBefore={<Icon type="user" className={classNames['input-icon']} />} className={classNames['login-input']}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}>
          {getFieldDecorator('password',{
            rules: [{
            required: true, message: '请填写密码'
          }]
          })(
            <Input type="password" placeholder="请输入密码" addonBefore={<Icon type="lock" className={classNames['input-icon']} />} className={classNames['login-input']}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}>
          <Button loading={loading} htmlType="submit" className={classNames['form-button']}>
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }

}));

export default connect(({user})=>({user}))(LoginPage);
