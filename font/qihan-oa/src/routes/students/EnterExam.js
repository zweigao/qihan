import React, {Component} from 'react';
import {connect} from 'dva';
import {Card,Table,Tag,Select,message,Icon,Popconfirm,Button,Modal,Tooltip} from 'antd';
let Option = Select.Option;
import SmsForm from '../../components/SmsForm';
import SearchInput from '../../components/ui/SearchInput';
import moment from 'moment';

let selectedKeys = [];
const rowSelection = {
  onChange(selectedRowKeys, selectedRows) {
    selectedKeys = selectedRowKeys;
  }
};

class EnterExam extends Component {

  constructor(props) {
    super(props);
    if (props.exam.data.length==0)
      props.dispatch({
        type:'exam/getExamList'
      });
    this.state = {
      visible: false,
      filter: ''
    }
  }

  renderColumns(){
    let {status} = this.props.exam;
    let {colors} = this.props;
    let colorsMap = {
      UNPASSED:colors.danger,
      PASSED:colors.success
    };
    return [{
      title: '姓名',
      dataIndex: 'student.name',
      render: (v,r) => (r.error?<span>{v}　<Tooltip title={r.error}><Icon type="info-circle-o" style={{color:'tomato',verticalAlign:'middle'}}/></Tooltip></span>:v),
      filterDropdown: (
        <SearchInput style={{width:150}} onSearch={v=>this.setState({filter:v})} />
      )
    },{
      title: '性别',
      dataIndex: 'student.sex',
      render: (v)=>(v=='MALE'?'男':'女'),
      filterMultiple:false,
      filters: [
        { text: '男', value: 'MALE' },
        { text: '女', value: 'FEMALE' }
      ],
      onFilter: (value, record) => record.student.sex==value
    },{
      title: '学校',
      dataIndex: 'student.schoolName',
      sorter: (a, b) => String(a.student.schoolName).localeCompare(b.student.schoolName)
    },{
      title: '身份证',
      dataIndex: 'student.identityCardCode',
      sorter: (a, b) => String(a.student.identityCardCode).localeCompare(b.student.identityCardCode)
    },{
      title: '报考状态',
      dataIndex: 'status',
      render:(v,r,i)=>(v=='HAS_BEEN_CHECKIN'?<Tag color={colorsMap[v]}>{status[v]}</Tag>:<Popconfirm title={"确认设置为已报考状态？"} onConfirm={()=>this.setStatus('HAS_BEEN_CHECKIN',r.index)}><Tag color={colorsMap[v]}>{status[v]}</Tag></Popconfirm>),
      filterMultiple:false,
      filters: Object.keys(status).map(k=>({text:status[k],value:k})),
      onFilter: (value, record) => record.status==value
    },{
      title: '报考科目',
      dataIndex: 'examCheckIn.courseItem.name',
      filterDropdown: (
        <SearchInput style={{width:150}} onSearch={v=>this.setState({filter:v})} />
      )
    },{
      title: '考试地区',
      dataIndex: 'examAra',
      filterDropdown: (
        <SearchInput style={{width:150}} onSearch={v=>this.setState({filter:v})} />
      )
    },{
      title: '报考时段',
      dataIndex: 'examCheckIn.displayContent',
      filterDropdown: (
        <SearchInput style={{width:150}} onSearch={v=>this.setState({filter:v})} />
      )
    },{
      title: '考试时间',
      dataIndex: 'examCheckIn.examTimestamp',
      render: (v)=>(moment(v).format('YYYY-MM-DD')),
      sorter: (a, b) => a-b
    },{
      title: '操作',
      render: (v,r,i) => (
        <Popconfirm title="确认删除报考记录？" onConfirm={()=>this.del(r.index)}><Icon type="delete" style={{color:'tomato'}}/></Popconfirm>
      )
    }];
  }

  del = (index) => {
    let {dispatch,exam} = this.props;
    let examId = exam.data[index].id;
    dispatch({
      type:'exam/del',
      examId,
      index
    })
  };

  setStatus = (v,i) => {
    if (i>=0)
      selectedKeys = [i];
    else if (selectedKeys.length==0) {
      message.warn('请选择至少一条报考记录');
      return;
    }
    let {dispatch,exam} = this.props;
    let ids = selectedKeys.map(i=>(exam.data[i].id));
    dispatch({
      type:'exam/setStatus',
      status:v,
      index:selectedKeys,
      ids
    })
    this.refs['table'].handleSelectAllRow({target:{checked:false}});
  };

  // extra=<span>修改报考状态：<Select disabled={loading} onSelect={this.setStatus} placeholder="报考状态" style={{width:100}}>{Object.keys(status).map(k=>(<Option key={k} value={k}>{status[k]}</Option>))}</Select></span>;

  showSmsModal = () => {
    if (selectedKeys.length==0){
      message.warning('请选择至少一个学员');
      return;
    }
    this.setState({
      visible: true
    });
  };

  sendSms = () =>{
    let {dispatch,exam} = this.props;
    let form = this.refs['sms'];
    let ids = selectedKeys.map(i=>{
      return exam.data[i].student.id;
    })
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

  exportArchives = () => {
    if (selectedKeys.length==0){
      message.warning('请选择至少一条数据');
      return;
    }
    this.props.dispatch({
      type: 'exam/exportArchives',
      payload: { ids: selectedKeys.map(v=>(this.props.exam.data[v].id)) }
    });
  };
  exportStudentImg = () => {
      if (selectedKeys.length==0){
        message.warning('请选择至少一条数据');
        return;
      }
      this.props.dispatch({
        type: 'exam/exportStudentImg',
        payload: { ids: selectedKeys.map(v=>(this.props.exam.data[v].id)) }
      });
    };

  render() {
    let {data,loading} = this.props.exam;
    let {errors,sending} = this.props.sms;
    let {visible,filter} = this.state;
    data = data.filter(v=>v.examAra.indexOf(filter)>=0||v.examCheckIn.displayContent.indexOf(filter)>=0||v.student.name.indexOf(filter)>=0||v.examCheckIn.courseItem.name.indexOf(filter)>=0);
    if (errors.length>0)
      data = data.map(v=>{
        v.error = errors[1][v.student.id];
        return v;
      });
    return (
      <Card title="报考管理" extra={<span>
        <Tooltip title="导出头像"><Button onClick={this.exportStudentImg} type="ghost" shape="circle" icon="picture" /></Tooltip>
        <Tooltip title="发送短信"><Button onClick={this.showSmsModal} type="ghost" shape="circle" icon="mail" /></Tooltip>
        <Tooltip title="导出报考表"><Button onClick={this.exportArchives} type="ghost" shape="circle" icon="folder" /></Tooltip>
      </span>}>
        <Button　onClick={()=>this.setStatus('PASSED')} disabled={loading} type="primary">已通过</Button>　
        <Button　onClick={()=>this.setStatus('UNPASSED')} disabled={loading}>未通过</Button><br/><br/>
        <Table ref="table" rowKey="index" loading={loading} rowSelection={rowSelection} columns={this.renderColumns()} dataSource={data} size="small" pagination={{pageSize:20}}
               rowClassName={(record)=>{return errors.length!=0&&errors[0].indexOf(record.student.id)>=0?'yellow':''}}/>
        <Modal title="发送短信"
               visible={visible}
               onOk={this.sendSms}
               confirmLoading={sending}
               onCancel={()=>this.setState({visible:false})}>
          <SmsForm {...this.props} ref="sms"/>
        </Modal>
      </Card>
    );
  }

}

export default connect(({exam,colors,sms})=>({exam,colors,sms}))(EnterExam)
