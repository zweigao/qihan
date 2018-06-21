import React from 'react';
import {
  connect
} from 'dva';
import {
  Form,
  Input,
  Button,
  Card
} from 'antd';
const FormItem = Form.Item;

const StaffsAdd = React.createClass({

  handleSubmit(e) {
    e.preventDefault();
    let {
      dispatch
    } = this.props;
    let form = this.refs['form'];
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'staffs/add',
          ...values
        });
        form.resetFields();
      }
    });
  },

  render() {
    return (
      <Card title="添加业务人员">
        <AddForm ref="form" onSubmit={this.handleSubmit} loading={this.props.loading.global}/>
      </Card>
    )
  }

});

export const AddForm = Form.create()(React.createClass({
  render() {
    const {
      getFieldDecorator
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6
      }
    };
    console.log(this.props.data)   //获取分页的数据
    let {
      name,
      mobile,
      identityCardCode
    } = this.props.data || {};
    return (
      <Form horizontal onSubmit={this.props.onSubmit}>
        <FormItem
          {...formItemLayout}
          label="姓名"
          hasFeedback>
          {getFieldDecorator('name', {
            initialValue: name,
            rules: [{
              required: true, message: '请填写姓名'
            }]
          })(
            <Input type="input"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="手机号码"
          hasFeedback>
          {getFieldDecorator('mobile', {
            initialValue: mobile,
            rules: [{
              required: true, pattern:/0?(13|14|15|16|17|18|19)[0-9]{9}/, message: '请填写正确手机号码'
            }]
          })(
            <Input type="input"/>
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

export const ExtractionForm = Form.create()(React.createClass({
  render() {
    const {
      getFieldDecorator
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6
      }
    };
    let {
      dividend
    } = this.props.data || {};
    return (
      <Form horizontal onSubmit={this.props.onSubmit}>
        <FormItem
          {...formItemLayout}
          label="提成">
          {getFieldDecorator('dividend', {
            initialValue: dividend,
            rules: [{
              required: true, message: '请填写提成'
            }]
          })(
            <Input type="input" addonAfter="元" />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button loading={this.props.loading} type="primary" htmlType="submit" size="large">保存</Button>
        </FormItem>
      </Form>
    )
  }
}));

export default connect(({
  loading
}) => ({
  loading
}))(StaffsAdd);