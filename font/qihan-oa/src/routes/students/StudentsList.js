import React from 'react';
import {connect} from 'dva';
import {Table,Card,Button,Tooltip,message,Modal,Icon} from 'antd';
import SmsForm from '../../components/SmsForm';
import SearchInput from '../../components/ui/SearchInput';
import StudentArchiveTable from '../../components/StudentArchiveTable';

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

class StudentsList extends React.Component {

  constructor(props) {
    super(props);
    if (props.students.data.length==0)
      props.dispatch({
        type: 'students/getAllAsync'
      });
    this.columns = [{
      title: '姓名',
      dataIndex: 'name',
      width:'10%',
      render: (v,r) => (r.error?<span>{v}　<Tooltip title={r.error}><Icon type="info-circle-o" style={{color:'tomato',verticalAlign:'middle'}}/></Tooltip></span>:v),
      sorter: (a, b) => String(a.name).localeCompare(b.name)
    }, {
      title: '性别',
      width:'5%',
      dataIndex: 'sex',
      render: text => (text=='MALE'?'男':'女'),
      filterMultiple: false,
      filters: [
        { text: '男', value: 'MALE' },
        { text: '女', value: 'FEMALE' }
      ],
      onFilter: (value, record) => record.sex==value
    }, /*{
     title: '籍贯',
     width:'10%',
     dataIndex: 'nativePlace',
     sorter: (a, b) => String(a.nativePlace).localeCompare(b.nativePlace)
     }, */{
      title: '身份证',
      width:'20%',
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
        <Icon type="eye-o" style={{color:'cadetblue'}} onClick={()=>this.showStudentInfo(i)}/>
      )
    }];
    this.state = {
      currentId: 0,
      visible:false,
      visible2:false,
      filter:''
    };
  }

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
      visible2: false
    });
  };

  renderExtraButtons(){
    return (
      <Tooltip title="发送短信"><Button onClick={this.showModal} type="ghost" shape="circle" icon="mail" /></Tooltip>
    )
  }

  render() {
    let {data,loading} = this.props.students;
    let {visible,visible2,filter,currentId} = this.state;
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
      </Card>
    );
  }

}

export default connect(({students,sms})=>({students,sms}))(StudentsList);
