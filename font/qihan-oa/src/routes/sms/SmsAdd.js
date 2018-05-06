import React from 'react';
import {connect} from 'dva';
import { Form, Input, Button, Tag, Card } from 'antd';
const FormItem = Form.Item;
import SmsForm from '../../components/SmsForm';

class SmsAdd extends React.Component{

  render(){
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6
      }
    };

    return (
      <Card title="添加短信模板">
        <SmsForm {...this.props} ref="sms">
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" loading={this.props.sms.loading} size="large">保存</Button>
          </FormItem>
        </SmsForm>
      </Card>
    )
  }

}

export default connect(({sms})=>({sms}))(SmsAdd);
