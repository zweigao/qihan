import React from 'react';
import {Card,Button,Form,Input,Tag,Dropdown,Menu} from 'antd';
let FormItem = Form.Item;

const SmsForm = Form.create()(React.createClass({

  componentDidMount(){
    let {dispatch} = this.props;
    dispatch({
      type:'sms/getTemplateList'
    });
    dispatch({
      type:'sms/getStatus'
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    let {dispatch,form} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type:'sms/addTemp',
          content: values.content
        })
      }
    });
  },

  appendKeyword(keyword) {
    let {getFieldsValue,setFieldsValue} = this.props.form;
    return ()=>{
      let value = getFieldsValue(['content']).content;
      if (!value) value='';
      value += keyword;
      setFieldsValue({content:value});
    }
  },

  handleTemplate({key}) {
    let {template} = this.props.sms;
    let {setFieldsValue} = this.props.form;
    let content = template[key].content;
    setFieldsValue({content});
  },

  renderSmsTemplate: function () {
    let {template} = this.props.sms;
    return (
      <Menu style={{width:'400px'}} onClick={this.handleTemplate}>
        {template.map((v,k)=>(
          [<Menu.Item style={{whiteSpace:'inherit'}} key={k}>{v.content}</Menu.Item>,<Menu.Divider/>]
        ))}
      </Menu>
    )
  },

  render: function () {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    let {status} = this.props.sms;
    return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormItem
          wrapperCol={{span: 14, offset: 6}}>
          <span style={{color:'tomato'}}>{status}</span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="短信内容"
          hasFeedback>
          {getFieldDecorator('content', {
            rules: [{
              required: true, message: '请填写短信内容'
            }]
          })(
            <Input type="textarea" style={{height:'100px'}}/>

          )}
          <div style={{marginTop:'10px'}}>
            {this.props.sms.keywords.map((v,k)=>(
              <Tag key={k} onClick={this.appendKeyword(v.key)}>{v.word}</Tag>
            ))}
            <Dropdown overlay={this.renderSmsTemplate()} trigger={["click"]}>
              <Button size="small" type="dashed" icon="plus">短信模板</Button>
            </Dropdown>
          </div>
        </FormItem>
        {this.props.children}
      </Form>
    );
  }

}));

export default SmsForm;
