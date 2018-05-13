import React from 'react';
import {
  connect
} from 'dva';
import {
  Link
} from 'dva/router';
import {
  Table,
  Card,
  Icon,
  Popconfirm,
  Tag,
  Modal,
  Popover,
  Tooltip
} from 'antd';
import {
  AddForm
} from './MarketAdd';

class MarketList extends React.Component {

  constructor(props) {
    super(props);
    props.dispatch({
      type: 'manager/getList',
      tokenType: 'MARKET'
    });
    this.state = {
      index: -1,
      visible: false,
      achievementVisible: false
    }
  }

  showEdit = (index) => {
    this.setState({
      visible: true,
      index
    });
  };

  saveEdit = (e) => {
    e.preventDefault();
    let {
      dispatch,
      manager
    } = this.props;
    let {
      index
    } = this.state;
    let {
      id,
      activityFlag
    } = manager.data[index];
    let form = this.refs['form'];
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'manager/upd',
          id,
          activityFlag,
          index,
          ...values
        });
        this.setState({
          visible: false
        });
      }
    });
  };

  renderColumns = () => {
    return [{
      title: '姓名',
      dataIndex: 'managerName'
    }, {
      title: '账号',
      dataIndex: 'userName'
    }, {
      title: '身份证',
      dataIndex: 'identityCardCode'
    }, {
      title: '状态',
      dataIndex: 'activityFlag',
      render: (v) => (<Tag color={!v?'':'#87d068'}>{!v?'已禁用':'已启用'}</Tag>)
    }, {
      title: '操作',
      render: (v, r, i) =>
        <div>
          <Popconfirm title={(!r.activityFlag?'启用':'禁用')+"该账号？"} onConfirm={()=>this.props.dispatch({type:'manager/ban',index:i})} okText="确定" cancelText="取消">
            <Tooltip title={!r.activityFlag? '启用' : '禁用'}>{!r.activityFlag?<Icon type="check-circle-o" style={{color:'#87d068'}}/>:<Icon type="minus-circle-o" style={{color:'tomato'}} />}</Tooltip>
          </Popconfirm>
          <Tooltip title="编辑"><Icon type="edit" style={{color:'cadetblue'}} onClick={()=>this.showEdit(i)}/></Tooltip>
         
        </div>
    }];
  };

  render() {
    let {
      data
    } = this.props.manager;
    let {
      index
    } = this.state;
    return (
      <Card title="市场人员列表">
        <Table rowKey="id" columns={this.renderColumns()} dataSource={data} loading={this.props.loading}/>
        <Modal title="修改市场人员信息"
               visible={this.state.visible}
               footer={false}
               onCancel={()=>this.setState({visible:false})}>
          <AddForm data={data[index]} ref="form" onSubmit={this.saveEdit} loading={this.props.loading.global}/>
        </Modal>
      </Card>
    );
  }

}

export default connect(({
  manager,
  loading
}) => ({
  manager,
  loading: loading.global
}))(MarketList);