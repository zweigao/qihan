import React, {Component} from 'react'
import {connect} from 'dva';
import { Table, Tag, Modal, Button, Tooltip, Icon, message } from 'antd'
import moment from 'moment'
import SmsForm from '../components/SmsForm';

const status = {
  WAIT_FOR_CHECK:'等待审核',
  WAIT_FOR_PAY:'等待支付',
  NORMAL:'状态正常',
  SERVICE_TIMEOUT:'账号过期',
  UNPASSED:'审核不通过'
};

let selectedKeys = [];
// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange(selectedRowKeys, selectedRows) {
    selectedKeys = selectedRowKeys;
  }
};

class AchievementTable extends Component {

  constructor(props){
    super(props);
    this.state = {
      visible: false
    }
  }

  showSmsModal = () => {
    if (selectedKeys.length==0){
      message.warning('请选择至少一个学员');
      return;
    }
    this.setState({
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({ visible: false })
  };

  sendSms = () =>{
    let {dispatch,achievement} = this.props;
    let form = this.refs['sms'];
    let ids = selectedKeys.map(i=>{
      return achievement[i].student.id;
    });
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'sms/sendSms',
          ids,
          ...values
        });
        this.setState({visible:false})
      }
    });
    this.refs['table'].handleSelectAllRow({target:{checked:false}});
  };

  renderAchivColumns () {
    return [
      {
        title: '学生',
        dataIndex: 'student.name',
        render: (v, r) => (r.error ?
          <span>{v} <Tooltip title={r.error}><Icon type="info-circle-o" style={{color:'tomato',verticalAlign:'middle'}}/></Tooltip></span> : v)
      },
      {
        title: '报名项目',
        dataIndex: 'registerItemInfo.displayContent'
      },
      {
        title: '电话',
        dataIndex: 'student.mobile'
      },
      {
        title: '报名时间',
        dataIndex: 'registerTimestamp',
        render: (v) => <span>{moment(v).format('ll')}</span>
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (v) => <Tag>{status[v]}</Tag>
      },
      {
        title: '金额',
        dataIndex: 'amount'
      }
    ]
  }

  render () {
    let { achievement } = this.props;
    let {errors,sending} = this.props.sms;
    if (errors.length>0)
      achievement = achievement.map(v=>{
        v.error = errors[1][v.student.id];
        return v;
      });
    return (
      <div>
        {achievement.length > 0 ? <Tag style={{marginBottom: '15px'}}>{'总交易额：' + achievement.reduce(((a, b) => a + b.amount), 0)}</Tag> : null }
        {sessionStorage.tokenType=='MARKET'?<div style={{marginBottom: 10}}><Button onClick={this.showSmsModal} type="primary" >发送短信</Button></div>:null}
        <Table size="small" ref="table" rowKey="index" rowSelection={sessionStorage.tokenType=='MARKET'?rowSelection:null} columns={this.renderAchivColumns()} dataSource={achievement} loading={this.props.loading}
               rowClassName={(record)=>{return errors.length!=0&&errors[0].indexOf(record.student.id)>=0?'yellow':''}}/>
        <Modal title="发送短信"
               visible={this.state.visible}
               onOk={this.sendSms}
               confirmLoading={sending}
               onCancel={this.handleCancel}>
          <SmsForm {...this.props} ref="sms"/>
        </Modal>
      </div>
    )
  }
}

export default connect(({sms})=>({sms}))(AchievementTable)
