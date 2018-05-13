/**
 * Created by fangf on 2016/11/22.
 */
import React,{Component} from 'react';
import styles from './LoginPage.less';
import {Row,Col,Form,Input,Icon,Button,message} from 'antd';
import Footer from '../components/Layout/Footer';
import * as auth from '../services/auth';
let FormItem =Form.Item;

let logo = require('../asset/logo.png');

class LoginPage extends Component{

  render(){
    return(
      <Row type="flex" justify="center" align="middle" className={styles.container}>
        <Col span={8} lg={6} className={styles['login-wrapper']}>
          <h1><img src={logo}/></h1>
          <LoginForm/>
          <Footer/>
        </Col>
      </Row>
    )
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
    this.props.form.validateFields((err, values) => {
      if (!values.user) message.warn('请填写用户名');
      else if (!values.password) message.warn('请填写密码');
      else {
        this.setState({ loading : true })
        auth.login(values.user, values.password).then((resp) => {
          this.setState({ loading : false })
          if (resp.data.code === 1) {
            message.success('登录成功')
            sessionStorage.setItem('tokenID', resp.data.data.tokenId)
            sessionStorage.setItem('tokenType', resp.data.data.token_type)
            // sessionStorage.setItem('tokenType', "FINANCE")
            sessionStorage.setItem('username', resp.data.data.name)
            sessionStorage.setItem('id', resp.data.data.id)
             // sessionStorage.setItem('username',"财务")
             // sessionStorage.setItem('id', "2")
            //跳转路由  
            // if(resp.data.data.token_type=="SALEMAN"){
            //    this.context.router.push( '/')
            // }  
            const nextPath = sessionStorage.getItem('nextPath')
            this.context.router.push(nextPath&&nextPath!='/login' || '/')
            sessionStorage.removeItem('nextPath')      
          }
        }).catch((err) => {
          this.setState({ loading : false })
        })
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
      <Form horizontal onSubmit={this.handleSubmit} className={styles['login-form']}>
        <FormItem style={{marginBottom:0}}
          {...formItemLayout}>
          {getFieldDecorator('user')(
            <Input placeholder="请输入用户名" addonBefore={<Icon type="user" className={styles['input-icon']} />} className={styles['login-input']}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}>
          {getFieldDecorator('password')(
            <Input type="password" placeholder="请输入密码" addonBefore={<Icon type="lock" className={styles['input-icon']} />} className={styles['login-input']}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}>
          <Button loading={loading} htmlType="submit" className={styles['form-button']}>
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }

}));

export default LoginPage;
