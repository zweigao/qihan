import React from 'react';
import {connect} from 'dva';
import { Form, Input, Button, Card, Table, Tooltip, Modal, Spin, Popconfirm, Icon } from 'antd';
import TimeAgo from 'timeago-react';
const FormItem = Form.Item;

class Notify extends React.Component{

  constructor(props){
    super(props);
    this.state = {visible:false};
    props.dispatch({
      type:'notify/getAll'
    })
  }

  renderColumns(){
    return [{
      title: '通知内容',
      dataIndex: 'content'
    },{
      title: '发布时间',
      dataIndex: 'pubTimestamp',
      render: (v) => <TimeAgo datetime={v} locale='zh_CN' live={false}/>
    },{
      title: '操作',
      render: (v,{id}) =>
        <Popconfirm title="确认撤回通知?" onConfirm={()=>this.props.dispatch({type:'notify/del',id})} okText="确定" cancelText="取消">
          <Icon type="rollback" style={{color:'tomato',fontSize:'1.5em'}}/>
        </Popconfirm>
    }];
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () =>{
    let {dispatch} = this.props;
    let form = this.refs['form'];
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'notify/add',
          ...values
        });
        this.setState({visible:false})
      }
    });
  };

  handleCancel = () =>{
    this.setState({
      visible: false
    });
  };

  renderExtraButtons(){
    return (
      <Tooltip title="发布新通知"><Button onClick={this.showModal} type="ghost" shape="circle" icon="notification" /></Tooltip>
    )
  }

  render(){
    let {data,loading} = this.props.notify;
    return (
      <Card title="系统通知管理" extra={this.renderExtraButtons()}>
        <Spin spinning={loading}><Table columns={this.renderColumns()} dataSource={data} /></Spin>
        <Modal title="系统通知"
               visible={this.state.visible}
               onOk={this.handleOk}
               confirmLoading={loading}
               onCancel={this.handleCancel}>
          <NotifyForm {...this.props} ref="form"/>
        </Modal>
      </Card>
    )
  }
}

const NotifyForm = Form.create()(React.createClass({

  render: function () {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="通知内容"
          hasFeedback>
          {getFieldDecorator('content', {
            rules: [{
              required: true, message: '请填写通知内容'
            }]
          })(
            <Input type="textarea" style={{height:'100px'}}/>
          )}
        </FormItem>
      </Form>
    );
  }

}));

export default connect(({notify})=>({notify}))(Notify);
