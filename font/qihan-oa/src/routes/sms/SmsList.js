import React from 'react';
import {connect} from 'dva';
import { Table, Card, Icon, Popconfirm, Spin } from 'antd';
import TimeAgo from 'timeago-react';

class SmsList extends React.Component{

  constructor(props){
    super(props);
    props.dispatch({
      type:'sms/getTemplateList'
    })
  }

  renderColumns = () => {
    return [{
      title: '内容',
      dataIndex: 'content'

    }, {
      title: '创建时间',
      width: '40%',
      dataIndex: 'createTimestamp',
      render: t => <TimeAgo datetime={t} locale='zh_CN' live={false}/>
    }, {
      title: '操作',
      width: '10%',
      render: (v,{id}) =>
        <Popconfirm title="确认删除?" onConfirm={()=>this.props.dispatch({type:'sms/delTemp',id})} okText="确定" cancelText="取消">
          <Icon type="delete" style={{color:'tomato'}}/>
        </Popconfirm>
    }];
  };

  render() {
    let {template,loading} = this.props.sms;
    return (
      <Card title="短信模板列表">
        <Spin spinning={loading}><Table columns={this.renderColumns()} dataSource={template} /></Spin>
      </Card>
    );
  }

};

export default connect(({sms})=>({sms}))(SmsList);
