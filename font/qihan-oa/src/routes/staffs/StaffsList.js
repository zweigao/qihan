import React from 'react';
import {connect} from 'dva';
import axios from 'axios';
import {Link} from 'dva/router';
import { Table, Card, Icon, Popconfirm, Tag, Modal, Popover, Tooltip, Button, message } from 'antd';
import {AddForm} from './StaffsAdd';
import QRCode from 'qrcode.react';
import moment from 'moment'
import AchievementTable from '../../components/AchievementTable'
import SearchInput from '../../components/ui/SearchInput';

let selectedKeys = [];
// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange(selectedRowKeys, selectedRows) {
    selectedKeys = selectedRowKeys;
  }
};

class StaffsList extends React.Component{

  constructor(props){
    super(props);
    if (props.staffs.data.length==0)
      props.dispatch({
        type:'staffs/getList'
      });
    this.state = {
      index: -1,
      visible: false,
      achievementVisible: false,
      filter: ''
    }
  }

  showEdit = (index) => {
    this.setState({visible:true,index});
  };

  saveEdit = (e) => {
    e.preventDefault();
    let {dispatch,staffs} = this.props;
    let {index} = this.state;
    let {id,loginBandom} = staffs.data[index];
    let form = this.refs['form'];
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'staffs/upd',
          id,
          loginBandom,
          index,
          ...values
        });
        this.setState({visible:false});
      }
    });
  };

  showAchievement (id) {
    this.props.dispatch({ type: 'staffs/fetchAchievement', payload: { id }})
    this.setState({ ...this.state, achievementVisible: true })
  }

  renderColumns = () => {
    return [{
      title: '姓名',
      dataIndex: 'name'
    }, {
      title: '手机号',
      dataIndex: 'mobile'
    }, {
      title: '身份证',
      dataIndex: 'identityCardCode'
    }, {
      title: '状态',
      dataIndex: 'loginBandom',
      filterMultiple: false,
      filters: [
        {text: '已禁用', value: true},
        {text: '已启用', value: false}
      ],
      onFilter: (value, record) => String(record.loginBandom) == value,
      render: (v)=>(<Tag color={v?'':'#87d068'}>{v?'已禁用':'已启用'}</Tag>)
    }, {
      title: '操作',
      render: (v,r,i) =>
        <div>
          <Tooltip title="查看业绩"><Icon type="search" style={{color:'cadetblue'}} onClick={() => this.showAchievement.bind(this)(r.id)}/></Tooltip>　
          <Popconfirm title={(r.loginBandom?'启用':'禁用')+"该账号？"} onConfirm={()=>this.props.dispatch({type:'staffs/ban',index:i})} okText="确定" cancelText="取消">
            <Tooltip title={r.loginBandom? '启用' : '禁用'}>{r.loginBandom?<Icon type="check-circle-o" style={{color:'#87d068'}}/>:<Icon type="minus-circle-o" style={{color:'tomato'}} />}</Tooltip>
          </Popconfirm>　
          <Tooltip title="编辑"><Icon type="edit" style={{color:'cadetblue'}} onClick={()=>this.showEdit(i)}/></Tooltip>　
          <Popover trigger="click" content={<QRCode value={axios.defaults.qrcodeURL+'?staff='+r.id} />}><Tooltip title={"二维码"}><Icon type="qrcode"/></Tooltip></Popover>
        </div>
    }];
  };

  exportAchievement = () => {
    if (selectedKeys.length==0) {
      message.warn('请选择至少一条数据');
      return;
    }
    this.props.dispatch({
      type: 'staffs/exportAchievement',
      ids: selectedKeys
    })
  };

  render() {
    let {data,achievement} = this.props.staffs;
    let {index,filter} = this.state;
    data = data.filter(v=>v.name.indexOf(filter)>=0||v.mobile.indexOf(filter)>=0||v.identityCardCode.indexOf(filter)>=0);
    return (
      <Card title="业务人员列表" extra={<div><Tooltip title="导出业绩"><Button onClick={this.exportAchievement} type="ghost" shape="circle" icon="folder" /></Tooltip></div>}>
        <SearchInput style={{width:150,marginBottom:20}} onChange={v=>this.setState({filter:v})}/>
        <Table rowKey="id" rowSelection={rowSelection} columns={this.renderColumns()} dataSource={data} loading={this.props.loading}/>
        <Modal title="修改业务人员信息"
               visible={this.state.visible}
               footer={false}
               onCancel={()=>this.setState({visible:false})}>
          <AddForm data={data[index]} ref="form" onSubmit={this.saveEdit} loading={this.props.loading.global}/>
        </Modal>
        <Modal width="50%"
               title="历史记录"
               footer={false}
               visible={this.state.achievementVisible}
               onCancel={() => this.setState({ ...this.state, achievementVisible: false })}>
            <AchievementTable achievement={achievement} loading={this.props.loading}/>
        </Modal>
      </Card>
    );
  }

}

export default connect(({staffs,loading})=>({staffs,loading: loading.global}))(StaffsList);
