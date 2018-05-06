import React, {Component} from 'react';
import {connect} from 'dva';
import axios from 'axios';
import {Card,Table,Popconfirm,Icon,Modal,Button,Tooltip,Upload,message,Alert} from 'antd';
import ExpressForm from '../../components/ExpressForm';
import SearchInput from '../../components/ui/SearchInput';

class Logistics extends Component {

  constructor(props) {
    super(props);
    if (props.express.data.length==0)
      props.dispatch({
        type: 'express/getAll'
      });
    this.host = axios.defaults.baseURL;
    this.state = {
      currentId: 0,
      visible: false,
      visible2: false,
      filter: '',
      errors: ''
    }
  }

  showExpressInfo = (i) => {
    this.setState({
      currentId: i,
      visible: true
    });
  };

  showExpressData = (i) => {
    let {express,dispatch} = this.props;
    dispatch({
      type: 'express/getExpressData',
      code: express.data[i].code
    });
    this.setState({visible2:true})
  };

  updExpressInfo = (e) => {
    e.preventDefault();
    let {dispatch,express} = this.props;
    let index = this.state.currentId;
    let id = express.data[index].id;
    let form = this.refs['form'];
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'express/upd',
          id,
          index,
          ...values
        });
        form.resetFields();
        this.setState({visible:false})
      }
    });
  };

  renderColumns = () => {
    return [{
      title: '单号',
      dataIndex: 'code'
    }, {
      title: '物流公司',
      dataIndex: 'companyName'
    }, {
      title: '费用（元）',
      dataIndex: 'fare',
      render: (v)=>(v/100)
    }, {
      title: '收件人',
      dataIndex: 'examRegister.student.name'
    }, {
      title: '手机号码',
      dataIndex: 'examRegister.student.mobile'
    }, {
      title: '报名科目',
      dataIndex: 'examRegister.registerItemInfo.registerItem.name'
    }, {
      title: '操作',
      render: (v,{id},i) =>
        <div>
          <Tooltip title="查询物流"><Icon type="eye-o" style={{color:'cadetblue'}} onClick={()=>this.showExpressData(i)}/></Tooltip>　
          <Tooltip title="修改物流"><Icon type="edit" style={{color:'orange'}} onClick={()=>this.showExpressInfo(i)}/></Tooltip>　
          <Popconfirm title="确认删除?" onConfirm={()=>this.props.dispatch({type:'express/del',id,index:i})} okText="确定" cancelText="取消">
            <Icon type="delete" style={{color:'tomato'}}/>
          </Popconfirm>
        </div>
    }];
  };

  render() {
    let {data,expressData} = this.props.express;
    let {visible,visible2,currentId,filter,errors} = this.state;
    data = data.filter(v=>{
      let b = false;
      Object.keys(v).map(k=>{
        if (typeof v[k] !== "object"&&String(v[k]).indexOf(filter)>=0) b = true;
        if (v.examRegister&&(v.examRegister.student.name.indexOf(filter)>=0
          ||v.examRegister.student.mobile.indexOf(filter)>=0
          ||v.examRegister.registerItemInfo.registerItem.name.indexOf(filter)>=0))
          b = true;
      });
      return b;
    });
    const uploadProps = {
      name: 'excelFile',
      showUploadList: false,
      action: this.host+'ExpressManager/infoImport.action',
      accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      headers: {
        Authorization: sessionStorage.tokenID
      },
      onChange: (info) => {
        if (info.file.status !== 'uploading') {
          let res = info.file.response;
          if (res.code==1)
            message.success('导入数据成功');
          else {
            message.error(res.message);
            this.setState({errors: res.data})
          }
        }
        if (info.file.status === 'done') {
          // message.success(`${info.file.name} 上传成功`);
          this.props.dispatch({
            type: 'express/getAll'
          });
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败`);
        }
      }
    };
    return (
      <Card title="教材物流管理" extra={<Upload {...uploadProps}><Tooltip title="导入快递单"><Button shape="circle" icon="upload" type="ghost"/></Tooltip></Upload>}>
        {errors&&errors.length>0?<Alert type="warning" message={<span dangerouslySetInnerHTML={{__html: errors}}/>} closable/>:null}
        <SearchInput style={{width:200,marginBottom:20}} onChange={v=>this.setState({filter:v})} placeholder="筛选数据" />
        <Table rowKey="id" columns={this.renderColumns()} dataSource={data} pagination={{pageSize:20}} size="small" />
        <Modal title="修改物流信息"
               onCancel={()=>this.setState({visible:false})}
               visible={visible}
               footer={false}>
          <ExpressForm ref="form" data={data[currentId]} onSubmit={this.updExpressInfo} />
        </Modal>
        <Modal width="50%" style={{top:20}}
               onCancel={()=>this.setState({visible2:false})}
               onOk={()=>this.setState({visible2:false})}
               visible={visible2>0}>
          <ExpressTable express={expressData} loading={this.props.loading} dispatch={this.props.dispatch} />
        </Modal>
      </Card>
    );
  }

}

class ExpressTable extends Component {

  constructor(props){
    super(props);
    this.columns = [{
      title: '时间',
      dataIndex: 'time'
    },{
      title: '位置',
      dataIndex: 'context'
    }]
  }

  render(){
    let {express,loading,dispatch} = this.props;
    return (
      <div>
        <SearchInput style={{width:200,marginBottom:20}} onSearch={v=>dispatch({type:'express/getExpressData', code: v})} placeholder="物流单号" />
        <Table loading={loading} size="small" columns={this.columns} dataSource={express.data} pagination={false}/>
      </div>
    )
  }
}

export default connect(({express,loading:{global:loading}})=>({express,loading}))(Logistics)
