import React from 'react';
import md5 from '../../utils/md5'
import {connect} from 'dva';
import {Link} from 'dva/router';
import styles from './layout.less';
import { Menu, Icon, Modal, Form, Input } from 'antd';
import { browserHistory } from 'dva/router';
const SubMenu = Menu.SubMenu;
const FormItem = Form.Item;
// const MenuItemGroup = Menu.ItemGroup;

let avatar = "http://cdn.v2ex.co/gravatar/"+md5(sessionStorage.username)+"?s=300&d=identicon";

const Header = React.createClass({

  getInitialState(){
    return {
      visible: false
    }
  },

  handleMenuClick (obj) {
    if (obj.key === 'password') {
      this.setState({visible: true})
    }
    else if (obj.key === 'logout') {
      browserHistory.push('/login')
      sessionStorage.removeItem('tokenID')
      sessionStorage.removeItem('tokenType')
      sessionStorage.removeItem('id')
    }
  },

  changePwd() {
    let {dispatch} = this.props;
    let form = this.refs['form'];
    console.log(form);
    form.validateFields((err, values) => {
      if (!err) {
        if (values.newPwd == values.pwd) {
          dispatch({
            type: 'manager/changePwd',
            id: sessionStorage.id,
            ...values
          })
        } else {
          form.setFields({pwd: {errors:['两次输入密码不一致']}})
        }
      }
    });
  },

  render () {
    return (
      <div className={styles['ant-layout-header']} style={{height:'50px'}}>
        <Menu className="header-menu" mode="horizontal" style={{lineHeight:'50px'}} onClick={this.handleMenuClick}>
          <Menu.Item key="mail">
            <Icon type="user" style={{fontSize:'large'}} />
          </Menu.Item>
          <Menu.Item key="app">
            <Link to="/"><Icon type="appstore" />控制台</Link>
          </Menu.Item>
          <SubMenu title={<span>{sessionStorage.username} <Icon type="down"/><img src={avatar} style={{width:40,borderRadius:'50%',verticalAlign:'middle'}}/></span>}>
            {sessionStorage.tokenType=='SALEMAN'?null:<Menu.Item key="password">修改密码</Menu.Item>}
            <Menu.Item key="logout">注销</Menu.Item>
          </SubMenu>
          {/*<SearchInput placeholder="Search..." onSearch={value => console.log(value)} style={{ width: 200 }}/>*/}
        </Menu>
        <Modal title="修改密码" visible={this.state.visible}
               onCancel={()=>this.setState({visible:false})}
               onOk={this.changePwd}
        >
          <PasswordForm ref="form" onSubmit={this.changePwd}/>
        </Modal>
      </div>
    );
  }

});

const PasswordForm = Form.create()(React.createClass({

  render: function () {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form horizontal onSubmit={this.props.onSubmit}>
        <FormItem
          {...formItemLayout}
          label="原密码"
          hasFeedback>
          {getFieldDecorator('oldPwd', {
            rules: [{
              required: true, message: '请填写原密码'
            }]
          })(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="新密码"
          hasFeedback>
          {getFieldDecorator('newPwd', {
            rules: [{
              required: true, pattern:/.{6,}/, message: '密码长度必须不小于6位'
            }]
          })(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="重复密码"
          hasFeedback>
          {getFieldDecorator('pwd', {
            rules: [{
              required: true, message: '请确认您的密码'
            }]
          })(
            <Input type="password"/>
          )}
        </FormItem>
      </Form>
    );
  }

}));

export default connect()(Header);
