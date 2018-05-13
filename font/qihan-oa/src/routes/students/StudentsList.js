import React from 'react';
import {connect} from 'dva';
import {Table,Card,Button,Tag,Tooltip,message,Modal,Icon,Popconfirm} from 'antd';
import SmsForm from '../../components/SmsForm';
import SearchInput from '../../components/ui/SearchInput';
import StudentArchiveTable from '../../components/StudentArchiveTable';
import moment from 'moment';

let selectedKeys = [];
// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange(selectedRowKeys, selectedRows) {
    selectedKeys = selectedRowKeys;
  },
  /*onSelect(record, selected, selectedRows) {
   console.log(record, selected, selectedRows);
   },
   onSelectAll(selected, selectedRows, changeRows) {
   console.log(selected, selectedRows, changeRows);
   }*/
};

let selectedExamKeys = [];
  const rowExamSelection = {
    onChange(selectedRowKeys, selectedRows) {
      selectedExamKeys = selectedRowKeys;
    },
  };

//route文件
class StudentsList extends React.Component {
  //props是cennect的model导出的数据加上其他数据的json
  constructor(props) {
    super(props);
    if (props.students.data.length==0)
      props.dispatch({
        type: 'students/getAllAsync'
      });
    this.columns = [{
      title: '姓名',
      dataIndex: 'name',
      width:'8%',
      render: (v,r) => (r.error?<span>{v}　<Tooltip title={r.error}><Icon type="info-circle-o" style={{color:'tomato',verticalAlign:'middle'}}/></Tooltip></span>:v),
      sorter: (a, b) => String(a.name).localeCompare(b.name)
    }, {
      title: '性别',
      width:'7%',
      dataIndex: 'sex',
      render: text => (text=='MALE'?'男':'女'),
      filterMultiple: false,
      filters: [
        { text: '男', value: 'MALE' },
        { text: '女', value: 'FEMALE' }
      ],
      onFilter: (value, record) => record.sex==value
    }, {
      title: '身份证',
      width:'18%',
      dataIndex: 'identityCardCode',
      sorter: (a, b) => String(a.identityCardCode).localeCompare(b.address)
    }, {
      title: '学校',
      width:'20%',
      dataIndex: 'schoolName',
      sorter: (a, b) => String(a.schoolName).localeCompare(b.schoolName)
    }, {
      title: '专业',
      width:'15%',
      dataIndex: 'profession',
      sorter: (a, b) => String(a.profession).localeCompare(b.profession)
    }, {
      title: '手机',
      width:'10%',
      dataIndex: 'mobile',
      sorter: (a, b) => String(a.mobile).localeCompare(b.mobile)
    }, {
      title: 'QQ',
      width:'10%',
      dataIndex: 'qqCode',
      sorter: (a, b) => String(a.qqCode).localeCompare(b.qqCode)
    }, {
      title: '操作',
      width:'5%',
      render: (v,r,i) => (
        <Icon type="eye-o" style={{fontSize:16,color:'cadetblue'}} onClick={()=>this.showStudentInfo(i)}/>
      )
    }, {
      title: '管理',
      width:'5%',
      render: (v,r,i) => (
        <Icon type="bars" style={{ fontSize:16,color: '#08c' }} onClick={()=>this.showExamInfo(r.index)}/>
      )
    }];
    this.state = {
      currentId: 0,
      visible:false,
      visible2:false,
      visibleExam:false,
      filter:''
    };
  }
  //报考管理
  renderColumns(){
    let {status} = this.props.students;
    let {colors} = this.props;
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
      dataIndex: 'coursename',
    },{
      title: '考试地区',
      dataIndex: 'examAra',
    },{
      title: '报考时段',
      dataIndex: 'displayContent',
    },{
      title: '考试时间',
      dataIndex: 'examTimestamp',
      // width:'10%',
      render: (v)=>(moment(v).format('YYYY-MM-DD')),
      sorter: (a, b) => a.examTimestamp-b.examTimestamp
    },{
      title: '删除',
      render: (v,r,i) => (
        <Popconfirm title="确认删除报考记录？" onConfirm={()=>this.del(r.index)}><Icon type="delete" style={{color:'tomato'}}/></Popconfirm>
      )
    }];
  };

  //删除某一科
  del = (examIndex) => {
    let {dispatch,students} = this.props;
    let {currentId} = this.state;
    let examId = students.examdata[currentId][examIndex].examid;
    dispatch({
      type:'students/del',
      examId,
      stuIndex:currentId,
      examIndex
    })
  };

  //修改报考状态
  //单击某一项已通过可以改为已报考，此时examIndex大于等于0
  setStatus = (v,index) => {
    let {currentId} = this.state;
    let select;
    if (index>=0)
      select = [index];
    else if (selectedExamKeys.length==0) {
      message.warn('请选择至少一条报考记录');
      return;
    }else{
      select = selectedExamKeys;
    }
    let {dispatch,students} = this.props;
    let ids = select.map(i=>(students.examdata[currentId][i].examid));
    // console.log( "select:" + select)
    dispatch({
      type:'students/setStatus',
      status:v,
      stuIndex:currentId,
      examIndex:select,
      ids
    });
    this.refs['table2'].handleSelectRow('removeAll');
  };

  //显示考勤管理的表格
  showExamInfo = (i) => {
    this.setState({
      currentId: i,
      visibleExam: true
    });
  }

  //隐藏考勤管理的表格，并清空所有已选项
  hideExamInfo = ()=>{
    this.setState({
      visibleExam: false
    });
    if(selectedExamKeys&&this.refs['table2'].handleSelectRow){
      this.refs['table2'].handleSelectRow('removeAll');
    }
  }

  //学员管理
  showModal = () => {
    if (selectedKeys.length==0){
      message.warning('请选择至少一个学员');
      return;
    }
    this.setState({
      visible: true
    });
  };

  showStudentInfo = (i) => {
    this.setState({
      currentId: i,
      visible2: true
    });
  };

  saveStudentInfo = (v) => {
    let {dispatch,students} = this.props;
    let index = this.state.currentId;
    v.id = students.data[index].id;
    dispatch({
      type:'students/upd',
      data:v,
      index
    });
  };

  handleOk = () =>{
    let {dispatch,students} = this.props;
    let form = this.refs['sms'];
    let ids = selectedKeys.map(i=>{
      return students.data[i].id;
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

  handleCancel = () =>{
    this.setState({
      visible: false,
      visible2: false,
      visibleExam: false
    });
  };

  renderExtraButtons(){
    return (
      <Tooltip title="发送短信"><Button onClick={this.showModal} type="ghost" shape="circle" icon="mail" /></Tooltip>
    )
  }

  render() {
    let {visible,visible2,filter,currentId,visibleExam} = this.state;
    let {data,loading,examdata} = this.props.students;
    data = data.filter(v=>v.name&&v.name.indexOf(filter)>=0||v.identityCardCode&&v.identityCardCode.indexOf(filter)>=0
    ||v.schoolName&&v.schoolName.indexOf(filter)>=0||v.profession&&v.profession.indexOf(filter)>=0
    ||v.mobile&&v.mobile.indexOf(filter)>=0||v.qqCode&&v.qqCode.indexOf(filter)>=0);

    let {errors} = this.props.sms;
    if (errors.length>0)
      data = data.map(v=>{
        v.error = errors[1][v.id];
        return v;
      });
    return (
      <Card title="学员管理" extra={this.renderExtraButtons()}>
        <SearchInput style={{width:200,marginBottom:20}} onChange={v=>this.setState({filter:v})} placeholder="筛选数据" />
        <Table ref="table" rowKey="index" rowSelection={rowSelection} columns={this.columns} dataSource={data} loading={loading} size="small" pagination={{pageSize:20}}
               rowClassName={(record)=>{return errors.length!=0&&errors[0].indexOf(record.id)>=0?'yellow':''}}/>
        <Modal title="发送短信"
               visible={visible}
               onOk={this.handleOk}
               confirmLoading={this.props.sms.sending}
               onCancel={this.handleCancel}>
          <SmsForm {...this.props} ref="sms"/>
        </Modal>
        <Modal title="报名资料" width="50%"
               style={{ top: 20 }}
               onOk={this.handleCancel}
               className="ant-table-content"
               visible={visible2}
               onCancel={this.handleCancel}>
          {visible2?<StudentArchiveTable onChange={this.saveStudentInfo} data={{student:data[currentId]}}/>:null}
        </Modal>
        <Modal title="报考管理" width="70%"
               onOk={this.hideExamInfo}
               visible={visibleExam}
               onCancel={this.hideExamInfo}>
          <Button　onClick={()=>this.setStatus('PASSED')} disabled={loading} type="primary">已通过</Button>　
          <Button　onClick={()=>this.setStatus('UNPASSED')} disabled={loading}>未通过</Button><br/><br/>
          <Table ref="table2" rowKey="index" rowSelection={rowExamSelection} columns={this.renderColumns()} dataSource={examdata[currentId]} size="small" pagination={false}
               rowClassName={(record)=>{return errors.length!=0&&errors[0].indexOf(record.examid)>=0?'yellow':''}}/>
        </Modal>
      </Card>
    );
  }

}

export default connect(({students,sms,colors})=>({students,sms,colors}))(StudentsList);
