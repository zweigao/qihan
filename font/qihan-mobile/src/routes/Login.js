import React from 'react';
import {connect} from 'dva';
import LoginForm from '../components/Login/LoginForm.js'

function Login({ dispatch, account }) {
  const loginFormProps = {
    userName: sessionStorage.getItem('phoneCode'),
    login (userName, password) {
      dispatch({ type: 'account/login', payload: { userName, password }})
    }
  }

  return (
    <LoginForm {...loginFormProps} />
  );
}

export default connect(({ account }) => ({ account }))(Login);
