import React from 'react';
import {connect} from 'dva';
import { Form, Input, Button, Card } from 'antd';
const FormItem = Form.Item;

const FinanceAdd = React.createClass({

  handleSubmit(e) {
    e.preventDefault();
    let {dispatch} = this.props;
    let form = this.refs['form'];
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'manager/add',
          tokenType: 'FINANCE',
          ...values
        });
        form.resetFields();
      }
    });
  },

  render(){
    return (
      <Card title="添加财务人员">
        <AddForm ref="form" onSubmit={this.handleSubmit} loading={this.props.loading.global}/>
      </Card>
    )
  }

});

export const AddForm = Form.create()(React.createClass({
  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6
      }
    };
    let {id,managerName,userName,identityCardCode} = this.props.data||{};
    return (
      <Form horizontal onSubmit={this.props.onSubmit}>
        <FormItem
          {...formItemLayout}
          label="姓名"
          hasFeedback>
          {getFieldDecorator('name', {
            initialValue: managerName,
            rules: [{
              required: true, message: '请填写姓名'
            }]
          })(
            <Input type="input"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="账号"
          hasFeedback>
          {getFieldDecorator('userName', {
            initialValue: userName,
            rules: [{
              required: true, message: '请填写账号'
            }]
          })(
            <Input type="input"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密码"
          hasFeedback>
          {getFieldDecorator('password', {})(
            <Input type="password" placeholder={id?"留空不修改密码":""}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="身份证号"
          hasFeedback>
          {getFieldDecorator('idCard', {
            initialValue: identityCardCode,
            rules: [{
              required: true, pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请填写正确身份证号码'
            }]
          })(
            <Input type="input"/>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button loading={this.props.loading} type="primary" htmlType="submit" size="large">保存</Button>
        </FormItem>
      </Form>
    )
  }
}));

export default connect(({loading})=>({loading}))(FinanceAdd);
