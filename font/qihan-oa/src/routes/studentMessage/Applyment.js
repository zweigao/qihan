import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Card,Table,Tag,Icon,Modal,Button,Popover,Input,Popconfirm,Tooltip,message,Form,Select,Cascader} from 'antd';
import DateUtil from '../../utils/DateUtil'
import ApplymentArchiveTable from '../../components/ApplymentArchiveTable';
import SmsForm from '../../components/SmsForm';
import SearchInput from '../../components/ui/SearchInput';
import ExpressForm from '../../components/ExpressForm';

const FormItem = Form.Item;
const Option = Select.Option;

let selectedKeys = [];
// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange(selectedRowKeys, selectedRows) {
    selectedKeys = selectedRowKeys;
  }
};

class Applyment extends React.Component{

  constructor(props){
    super(props);
    if (props.applyment.data.length==0)
      props.dispatch({
        type:'applyment/getAll'
        // type:'applyment/getMessage'
      });
    /*if (props.category.data.length==0)
     props.dispatch({type:'category/getList'});*/
    console.log(props.applyment.data)
    this.state = {
      currentId: 0,
      filter: '',
      visible: false,
      visible2: false,
      visible3: false,
      visible4: false,
      visible5: false,
      visible6: false
    }
  }

  sendSms = () =>{
    let {dispatch,applyment} = this.props;
    let form = this.refs['sms'];
    let ids = selectedKeys.map(i=>{
      return applyment.data[i].student.id;
    });
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'sms/sendSms',
          ids,
          ...values
        });
        this.setState({visible4:false})
      }
    });
    this.refs['table'].handleSelectAllRow({target:{checked:false}});
  };

  showArchive = (v,r,i) => {
    this.setState({visible:true,currentId:i})
  };

  showPayment = (v,r,i) => {
    this.setState({visible2:true,currentId:i})
  };

  showExamOptions = (v,r,i) => {
    let {dispatch,applyment} = this.props;
    let registerId = applyment.data[i].registerItemInfo.registerItem.id;
    dispatch({
      type:'applyment/getExamOptions',
      registerId
    });
    this.setState({visible3:true,currentId:i})
  };

  handleCancel = () => {
    this.setState({visible:false,visible2:false,visible3:false,visible4:false,visible5:false,visible6:false})
  };

  reject = () => {
    let {dispatch,applyment} = this.props;
    let index = this.state.currentId;
    let id = applyment.data[index].id;
    let reason = document.getElementById('reason').value;
    if (reason.length==0) return;
    dispatch({
      type:'applyment/setStatus',
      status:false,
      id,
      index,
      reason
    });
    this.setState({visible:false})
  };

  confirm = () => {
    let {dispatch,applyment} = this.props;
    let index = this.state.currentId;
    let id = applyment.data[index].id;
    dispatch({
      type:'applyment/setStatus',
      status:true,
      id,
      index
    });
    this.setState({visible:false})
  };

  renderModalFooter(){
    return (
      <div>
        <Button type="ghost" onClick={this.handleCancel} size="large">取消</Button>
        <Popover title="驳回原因" content={<div style={{overflow:'hidden'}}><Input id="reason" type="textarea"/><Button onClick={this.reject} type="ghost" style={{float:'right'}}>确认</Button></div>}>
          <Button size="large">驳回</Button>
        </Popover>
        <Popconfirm title="确认通过审核？" onConfirm={this.confirm}>
          <Button type="primary" size="large">已审核</Button>
        </Popconfirm>
      </div>
    )
  }

  handlePayment = () => {
    let form = this.refs['form'];
    let {dispatch,applyment} = this.props;
    let index = this.state.currentId;
    let id = applyment.data[index].id;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type:'applyment/pay',
          id,
          index,
          ...values
        });
        this.setState({visible2:false})
      }
    });
  };

  selectExam = (examId) => {
    let {dispatch,applyment} = this.props;
    let userId = applyment.data[this.state.currentId].student.id;
    let examArea = applyment.data[this.state.currentId].examArea;
    dispatch({
      type:'applyment/selectExam',
      userId,
      examId,
      examArea
    });
    this.setState({visible3:false})
  };

  renderTimeColumns(){
    return [{
      title: '科目',
      dataIndex: 'courseItem.name'
    },{
      title: '时段',
      dataIndex: 'displayContent'
    },{
      title: '考试时间',
      dataIndex: 'examTimestamp',
      render: (v)=>(DateUtil.format(v,'yyyy-MM-dd'))
    },{
      title: '报考截止时间',
      dataIndex: 'optionActivityTimestamp',
      render: (v)=>(DateUtil.format(v,'yyyy-MM-dd'))
    },{
      title: '操作',
      render: (v,r) => (
        <Popconfirm title="确认报考该科目？" onConfirm={()=>this.selectExam(r.id)}><Icon type="select" style={{color:'cadetblue'}} /></Popconfirm>
      )
    }];
  }

  showSmsModal = () => {
    if (selectedKeys.length==0){
      message.warning('请选择至少一个学员');
      return;
    }
    this.setState({
      visible4: true
    });
  };

  renderExtraButtons(){
    return (
      <div>
        <Tooltip title="发送短信"><Button onClick={this.showSmsModal} type="ghost" shape="circle" icon="mail" /></Tooltip>
        <Tooltip title="导出快递单"><Button onClick={this.exportData} type="ghost" shape="circle" icon="export" /></Tooltip>
        <Tooltip title="导出学生档案"><Button onClick={this.exportArchives.bind(this)} type="ghost" shape="circle" icon="folder" /></Tooltip>
      </div>
    )
  }

  saveStudentInfo = (v) => {
    let {dispatch,applyment} = this.props;
    let index = this.state.currentId;
    v.registerId = applyment.data[index].id;
    dispatch({
      type:'applyment/upd',
      data:v,
      index
    });
  };

  showExpressInfo = (i) => {
    let {dispatch,applyment} = this.props;
    let registerId = applyment.data[i].id;
    dispatch({
      type: 'express/getListById',
      registerId
    });
    this.setState({
      currentId: i,
      visible5: true
    });
  };

  addExpressInfo = (e) => {
    e.preventDefault();
    let {dispatch,applyment,express} = this.props;
    let registerId = applyment.data[this.state.currentId].id;
    let form = this.refs['form'];
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'express/'+(express.list.length>0?'updById':'add'),
          registerId,
          id: express.list.length>0?express.list[0].id:null,
          ...values
        });
        form.resetFields();
        this.setState({visible6:false})
      }
    });
  };

  delExpressInfo = () => {
    let {dispatch,applyment,express} = this.props;
    let registerId = applyment.data[this.state.currentId].id;
    dispatch({
      type: 'express/delById',
      registerId,
      id: express.list[0].id
    });
  };

  renderExpressColumns = () => {
    return [{
      title: '单号',
      dataIndex: 'code'
    },{
      title: '物流公司',
      dataIndex: 'companyName'
    },{
      title: '费用（元）',
      dataIndex: 'fare',
      render: (v)=>(v/100)
    },{
      title: '操作',
      render: (v,r) => (
        <div>
          <Tooltip title="修改物流信息"><Icon type="edit" style={{color:'cadetblue'}} onClick={()=>this.setState({visible6: true})}/></Tooltip>　<Popconfirm title="确认删除该物流信息？" onConfirm={this.delExpressInfo}><Icon type="delete" style={{color:'tomato'}}/></Popconfirm>
        </div>
      )
    }];
  };

  renderColumns = () =>{
    return [{
      title: '姓名',
      dataIndex: "student.name",
      render: (v, r) => (r.error ?
        <span>{v} <Tooltip title={r.error}><Icon type="info-circle-o" style={{color:'tomato',verticalAlign:'middle'}}/></Tooltip></span> : v),
      filterDropdown: (
        <SearchInput style={{width:150}} onSearch={v=>this.setState({filter:v})} />
      )
    }, {
      title: '性别',
      dataIndex: "student.sex",
      render: v=>(v == 'MALE' ? '男' : '女'),
      filterMultiple: false,
      filters: [
        {text: '男', value: 'MALE'},
        {text: '女', value: 'FEMALE'}
      ],
      onFilter: (value, record) => record.student.sex == value
    }, {
      title: '报名地区',
      dataIndex: "examArea",
      sorter: (a, b) => String(a.examArea).localeCompare(b.examArea)
    }, {
      title: '状态',
      dataIndex: "status",
      render: (v, r)=><span><Tag>{v}</Tag>{v == '审核不通过' ? <Tooltip title={r.unPassReason||'未填写'}><Icon type="info-circle-o" style={{color:'tomato',verticalAlign:'middle'}}/></Tooltip> : ''}</span>,
      filters: [
        {text: '等待审核', value: '等待审核'},
        {text: '等待支付', value: '等待支付'},
        {text: '状态正常', value: '状态正常'},
        {text: '账号过期', value: '账号过期'},
        {text: '审核不通过', value: '审核不通过'}
      ],
      onFilter: (value, record) => record.status == value
    },
      sessionStorage.tokenType==='MANAGER'?
      {
        title: '报名时间',
        dataIndex: "registerTimestamp",
        render: v=>DateUtil.format(v||0,'YYYY-M-D'),
        sorter: (a, b) => a.registerTimestamp - b.registerTimestamp
      }:{
        title: '金额(元)',
        dataIndex: "amount",
        render: v=>v.toFixed(2),
        sorter: (a, b) => a.amount - b.amount
      }
      , {
        title: '支付方式',
        dataIndex: "payWay",
        filters: [
          {text: '微信转账', value: '微信转账'},
          {text: '支付宝转账', value: '支付宝转账'},
          {text: '银行转账', value: '银行转账'},
          // {text: '现金支付', value: '现金支付'},
          // {text: '合作院校转帐', value: '合作院校转帐'}
        ],
        render: v=><Tag>{v||'未支付'}</Tag>,
        onFilter: (value, record) => record.payWay == value
      }, {
        title: '报名科目',
        dataIndex: "registerItemInfo.registerItem.name",
        filterDropdown: (
          <SearchInput style={{width:150}} onSearch={v=>this.setState({filter:v})} />
        ),
        onFilter: (value,record) => value==record.registerItemInfo.registerItem.id
      }, {
        title: '报名场次',
        dataIndex: "registerItemInfo.displayContent",
        filterDropdown: (
          <SearchInput style={{width:150}} onSearch={v=>this.setState({filter:v})} />
        ),
        onFilter: (value,record) => value==record.registerItemInfo.registerItem.id
      }, /*{
       title: '办理人',
       dataIndex: "salesMan.name",
       sorter: (a, b) => String(a.salesMan ? a.salesMan.name : '').localeCompare(b.salesMan ? b.salesMan.name : '')
       },*/ {
        title: '学生确认',
        dataIndex: "hasConfirmed",
        filterMultiple: false,
        filters: [
          {text: '已确认', value: true},
          {text: '未确认', value: false}
        ],
        onFilter: (value, record) => String(record.hasConfirmed) == value,
        render: v => <Tag color={v ? '#87d068' : '#f50'}>{v ? '已确认' : '未确认'}</Tag>
      }, {
        title: '操作',
        render: this.renderAction
      }];
  };

  renderAction = (v,r,i) => (
    sessionStorage.tokenType=="MANAGER"?
      <div>
        <Tooltip title="查看资料"><Icon type="eye-o" onClick={()=>this.showArchive(v,r,r.index)} style={{color:'cadetblue'}} /></Tooltip>　
        <Tooltip title="报考科目"><Icon type="select"  onClick={()=>this.showExamOptions(v,r,r.index)} style={{color:'cadetblue'}} /></Tooltip>　
        <Tooltip title="查看物流"><Icon type="inbox"  onClick={()=>this.showExpressInfo(r.index)} style={{color:'cadetblue'}} /></Tooltip>　
        <Tooltip title="客服对话"><Link to={"/customer/"+r.student.id}><Icon type="message" style={{color:'cadetblue'}} /></Link></Tooltip>
      </div>:
      <div>
        <Tooltip title="查看资料"><Icon type="eye-o" onClick={()=>this.showArchive(v,r,r.index)} style={{color:'cadetblue'}} /></Tooltip>　
        <Tooltip title="确认支付"><Icon type="credit-card" onClick={()=>this.showPayment(v,r,r.index)} style={{color:'cadetblue'}} /></Tooltip>
      </div>
  );

  exportData = () => {
    if (selectedKeys.length==0){
      message.warning('请选择至少一条数据');
      return;
    }
    this.props.dispatch({
      type: 'express/exportData',
      ids: selectedKeys.map(v=>(this.props.applyment.data[v].id))
    });
  };

  exportArchives () {
    if (selectedKeys.length==0){
      message.warning('请选择至少一条数据');
      return;
    }
    this.props.dispatch({
      type: 'applyment/exportArchives',
      payload: { ids: selectedKeys.map(v=>(this.props.applyment.data[v].id)) }
    });
  }

  render() {
    let {data,paymentWay,examOptions,loading} = this.props.applyment;
    let {list} = this.props.express;
    let {errors,sending} = this.props.sms;
    let {currentId,visible,visible2,visible3,visible4,visible5,visible6,filter} = this.state;
    data = data.filter(v=>v.student.name.indexOf(filter)>=0||v.registerItemInfo.registerItem.name.indexOf(filter)>=0||v.registerItemInfo.displayContent.indexOf(filter)>=0);
    if (errors.length>0)
      data = data.map(v=>{
        v.error = errors[1][v.student.id];
        return v;
      });
    return (
      <Card title="报名信息管理" extra={sessionStorage.tokenType=='MANAGER'?this.renderExtraButtons():null}>
        <Table loading={this.props.loading} ref="table" rowKey="index" rowSelection={rowSelection} columns={this.renderColumns()} dataSource={data} size="small" pagination={{pageSize:20}}
               rowClassName={(record)=>{return errors.length!=0&&errors[0].indexOf(record.student.id)>=0?'yellow':''}}/>
        <Modal title="报名资料" width="50%"
               style={{ top: 20 }}
               footer={sessionStorage.tokenType=='MANAGER'?this.renderModalFooter():null}
               className="ant-table-content"
               visible={visible}
               onCancel={this.handleCancel}>
          {visible?<ApplymentArchiveTable onChange={this.saveStudentInfo} data={this.props.applyment.data[currentId]}/>:null}
        </Modal>
        <Modal title="确认支付"
               className="ant-table-content"
               visible={visible2}
               onOk={this.handlePayment}
               onCancel={this.handleCancel}>
          <PaymentForm ref="form" paymentWay={paymentWay} payment={this.props.applyment.data[currentId]}/>
        </Modal>
        <Modal title="选择报考科目"
               visible={visible3}
               onOk={this.handleCancel}
               onCancel={this.handleCancel}>
          <Table pagination={false} columns={this.renderTimeColumns()} dataSource={examOptions} />
        </Modal>
        <Modal title="发送短信"
               visible={visible4}
               onOk={this.sendSms}
               confirmLoading={sending}
               onCancel={this.handleCancel}>
          <SmsForm {...this.props} ref="sms"/>
        </Modal>
        <Modal title="查看物流" width="50%"
               onOk={this.handleCancel}
               visible={visible5}
               onCancel={this.handleCancel}>
          <Button type="primary" disabled={list.length>0} style={{marginBottom:10}} onClick={()=>this.setState({visible6:true})}>添加物流</Button>
          <Table rowKey="id" pagination={false} columns={this.renderExpressColumns()} dataSource={list} />
        </Modal>
        <Modal title="物流信息" width="50%"
               footer={false}
               visible={visible6}
               onCancel={()=>this.setState({visible6:false})}>
          <ExpressForm ref="form" onSubmit={this.addExpressInfo} data={list[0]}/>
        </Modal>
      </Card>
    );
  }

}

const PaymentForm = Form.create()(React.createClass({

  render: function () {
    const { getFieldDecorator } = this.props.form;
    const {paymentWay,payment} = this.props;
    /*Object.keys(paymentWay).map(v=>{
     if (paymentWay[v]==payment.paymentWay)
     payment.paymentWay = v;
     });*/
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="支付方式"
          hasFeedback>
          {getFieldDecorator('payWay', {
            initialValue:payment.paymentWay,
            rules: [{
              required: true, message: '请选择支付方式'
            }]
          })(
            <Select placeholder="请选择支付方式">
              {Object.keys(paymentWay).map(v=>(
                <Option key={v} value={v}>{paymentWay[v]}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="支付金额(元)"
          hasFeedback>
          {getFieldDecorator('amount', {
            initialValue:payment.amount,
            rules: [{required: true, pattern: /[0-9]+/, message: '请填写正确的支付金额'}]
          })(
            <Input style={{width:'100%'}} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="支付单号"
          hasFeedback>
          {getFieldDecorator('payCode', {
            initialValue:payment.paymentCode,
            rules: [{
              required: true, message: '请填写支付单号'
            }]
          })(
            <Input type="textarea" />
          )}
        </FormItem>
      </Form>
    );
  }

}));

export default connect(({applyment,category,sms,express,loading:{global:loading}})=>({applyment,category,sms,express,loading}))(Applyment);