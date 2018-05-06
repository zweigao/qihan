import React from 'react';
import { List, InputItem, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import { createForm } from 'rc-form';

const LoginForm = React.createClass ({

  submit () {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        this.props.login(value.userName, value.password)
      }
    })
  },

  render () {
    const { getFieldProps, getFieldError } = this.props.form
    return (
      <div>
      <WhiteSpace size="xl"/>
      <List>
        <InputItem
          {...getFieldProps('userName', {
            initialValue: this.props.userName,
            rules: [{ required: true }]
          })}
          placeholder="手机号码"
          clear={true}
          error={getFieldError('userName')}>
          账号
        </InputItem>
        <InputItem
          {...getFieldProps('password', {
            rules: [{ required: true }]
          })}
          placeholder="密码"
          clear={true}
          type="password"
          error={getFieldError('password')}>
          密码
        </InputItem>
      </List>
      <WhiteSpace />
      <WingBlank><Button type="primary" size="large" onClick={this.submit}>登录</Button></WingBlank>
      </div>
    )
  }
})

LoginForm.propTypes = {

}

export default createForm()(LoginForm)