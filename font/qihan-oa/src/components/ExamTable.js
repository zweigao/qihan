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
    this.state = {
      visible: false,
      filter: ''
    }
  }

  renderColumns(){
    let {status} = this.props.exam.students;
    let {colors} = this.props.exam;
    let colorsMap = {
      UNPASSED:colors.danger,
      PASSED:colors.success
    };
    return [{
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
  //删除
  del = (index) => {
    let {dispatch,exam} = this.props;
    let examId = exam[index].id;
    dispatch({
      type:'exam/del',
      examId,
      index
    })
  };
  //改变考试状态
  setStatus = (v,i) => {
    if (i>=0)
      selectedKeys = [i];
    else if (selectedKeys.length==0) {
      message.warn('请选择至少一条报考记录');
      return;
    }
    let {dispatch,exam} = this.props;
    let ids = selectedKeys.map(i=>(exam[i].id));
    dispatch({
      type:'exam/setStatus',
      status:v,
      index:selectedKeys,
      ids
    })
    this.refs['table'].handleSelectAllRow({target:{checked:false}});
  };

  showSmsModal = () => {
    if (selectedKeys.length==0){
      message.warning('请选择至少一个学员');
      return;
    }
    this.setState({
      visible: true
    });
  };

  exportArchives = () => {
    if (selectedKeys.length==0){
      message.warning('请选择至少一条数据');
      return;
    }
    this.props.dispatch({
      type: 'exam/exportArchives',
      payload: { ids: selectedKeys.map(v=>(this.props.exam[v].id)) }
    });
  };

  render() {
    let {data,loading} = this.props.exam;
    let {errors,sending} = this.props.sms;
    let {visible,filter} = this.state;
    return (
        <Table ref="table" rowKey="index" loading={loading} rowSelection={rowSelection} columns={this.renderColumns()} dataSource={data} size="small" pagination={{pageSize:20}}
               rowClassName={(record)=>{return errors.length!=0&&errors[0].indexOf(record.student.id)>=0?'yellow':''}}/>
    );
  }

}

export default connect(({exam,colors,sms})=>({exam,colors,sms}))(EnterExam)
