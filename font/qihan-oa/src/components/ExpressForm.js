/**
 * Created by fangf on 2016/12/22.
 */
import React from 'react';
import {Form,Button,Input} from 'antd';
let FormItem = Form.Item;

const ExpressForm = Form.create()(React.createClass({
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
    let {code,companyName,fare} = this.props.data||{};
    return (
      <Form horizontal onSubmit={this.props.onSubmit}>
        <FormItem
          {...formItemLayout}
          label="单号"
          hasFeedback>
          {getFieldDecorator('code', {
            initialValue: code,
            rules: [{
              required: true, message: '请填写物流单号'
            }]
          })(
            <Input type="input"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="物流公司"
          hasFeedback>
          {getFieldDecorator('companyName', {
            initialValue: companyName,
            rules: [{
              required: true, message: '请填写物流公司'
            }]
          })(
            <Input type="input"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="费用（元）"
          hasFeedback>
          {getFieldDecorator('fare', {
            initialValue: fare&&fare/100,
            rules: [{
              required: true, pattern: /[0-9\.]+/, message: '请填写正确费用'
            }]
          })(
            <Input type="input"/>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">保存</Button>
        </FormItem>
      </Form>
    )
  }
}));

export default ExpressForm;
