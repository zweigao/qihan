import React, {Component} from 'react';
import {connect} from 'dva';
import {Card,Table,Icon,Tooltip,Modal,Input,Form,DatePicker,Popconfirm} from 'antd';
import DateUtil from '../../utils/DateUtil';
import moment from 'moment';
import SearchInput from '../../components/ui/SearchInput';

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

class ExamTime extends Component {

  constructor(props) {
    super(props);
    if (props.register.exams.length==0)
      props.dispatch({
        type:'register/getExamList'
      });
    this.state = {
      visible:false,
      visible2:false,
      filter:''
    }
  }

  renderColumns = () => {
    return [{
      title: '科目',
      dataIndex: 'name'
    },{
      title: '操作',
      render: (v,r) => (
        <div>
          <Tooltip title="添加报考时间"><Icon type="plus" style={{color:'cadetblue'}} onClick={()=>this.showTimeModal(true,r.id)}/></Tooltip>　
          <Tooltip title="报考时间列表"><Icon type="calendar" style={{color:'cadetblue'}} onClick={()=>this.showTimeListModal(true,r.id,null)}/></Tooltip>
        </div>
      )
    }];
  };

  renderTimeColumns = () => {
    return [{
      title: '时段名称',
      dataIndex: 'displayContent'
    },{
      title: '报考截止时间',
      dataIndex: 'optionActivityTimestamp',
      render: (v)=>(DateUtil.format(v,'yyyy-MM-dd'))
    },{
      title: '考试时间',
      dataIndex: 'examTimestamp',
      render: (v)=>(DateUtil.format(v,'yyyy-MM-dd'))
    },{
      title: '操作',
      render: (v,r) => (
        <div>
          <Tooltip title="更新时段"><Icon type="edit" style={{color:'cadetblue'}} onClick={()=>this.showTimeModal(true,null,r)}/></Tooltip>　
          <Popconfirm title="确认删除该时段？" onConfirm={()=>this.delTime(r.id)}><Icon type="delete" style={{color:'tomato'}}/></Popconfirm>
        </div>
      )
    }];
  };

  /**
   * 添加或更新报考时段对话框
   * @param visible 显示/关闭对话框
   * @param menuId 添加时段到某个报考项目下
   * @param time 更新的报考时段记录对象
   */
  showTimeModal(visible, menuId, time){
    if (time) this.showTimeListModal(false);
    this.setState({visible,menuId,time})
  }

  showTimeListModal(visible2,menuId){
    if (menuId) {
      this.props.dispatch({
        type:'register/getExamTimeList',
        menuId
      })
    }
    this.setState({visible2,menuId})
  }

  addTime = () =>{
    let {dispatch} = this.props;
    let {menuId,time} = this.state;
    let form = this.refs['timeForm'];
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.times = values.times.map(v=>{
          return v.unix()*1000
        });
        if (menuId)
          dispatch({
            type:'register/addExamTime',
            ...values,
            menuId
          });
        else
          dispatch({
            type:'register/updExamTime',
            ...values,
            timeId:time.id
          });
        form.resetFields();
        this.setState({visible:false})
      }
    });
  };

  delTime = (timeId) =>{
    let {dispatch} = this.props;
    dispatch({
      type:'register/delExamTime',
      timeId
    });
    this.setState({visible2:false})
  };

  render() {
    let {exams,examTimes,loading} = this.props.register;
    let {visible,visible2,time,filter} = this.state;
    exams = exams.filter(v=>(v.name.indexOf(filter)>=0));
    return (
      <Card title="报考时间管理">
        <SearchInput style={{width:150,marginBottom:20}} onChange={(v)=>this.setState({filter:v})}/>
        <Table columns={this.renderColumns()} dataSource={exams} />
        <Modal title={(time?'修改':'添加')+"报考时间"}
               visible={visible}
               onOk={this.addTime}
               confirmLoading={loading}
               onCancel={()=>this.showTimeModal(false)}>
          <TimeForm ref="timeForm" time={time}/>
        </Modal>
        <Modal title="报考时间列表"
               visible={visible2}
               confirmLoading={loading}
               onOk={()=>this.showTimeListModal(false)}
               onCancel={()=>this.showTimeListModal(false)}>
          <Table loading={this.props.loading} pagination={false} columns={this.renderTimeColumns()} dataSource={examTimes} />
        </Modal>
      </Card>
    );
  }

}


const TimeForm = Form.create()(React.createClass({

  render: function () {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    let {time}  = this.props;
    return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="时段名称"
          hasFeedback>
          {getFieldDecorator('timeName', {
            initialValue:time?time.displayContent:'',
            rules: [{
              required: true, message: '请填写时段名称'
            }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="报考时段"
          hasFeedback>
          {getFieldDecorator('times',{
            initialValue:time?[moment(time.optionActivityTimestamp),moment(time.examTimestamp)]:null,
            rules: [{
              type:'array', required: true, message: '请选择报考时段'
            }]
          })(
            <RangePicker placeholder={['报考截止时间', '考试时间']}/>
          )}
        </FormItem>
      </Form>
    );
  }

}));

export default connect(({register, loading})=>({register, loading:loading.global}))(ExamTime)
