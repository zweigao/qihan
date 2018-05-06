import React from 'react';
import {connect} from 'dva';
import { Table, Card, Icon, Popconfirm, Spin, Modal, Row, Col, Cascader, Button, Message } from 'antd';
import { VideoForm } from './VideoAdd';
import MenuTree from '../../components/MenuTree'

class VideoList extends React.Component{

  constructor (props){
    super(props);
    this.state = {
      updateVisible: false,
      menuEditable: false,
      showMenuTreeModal: false
    };
    
    if (props.category.data.length==0) {
      props.dispatch({type: 'category/getList'})
    }
    props.dispatch({type: 'videos/getAll'})
    this.onRowChange = this.onRowChange.bind(this)
    this.toggleMenuTreeModal = this.toggleMenuTreeModal.bind(this)
    this.onCascaderChange = this.onCascaderChange.bind(this)
    this.handleRelativeOk = this.handleRelativeOk.bind(this)
    this.handleOk = this.handleOk.bind(this)
  }

  handleOk (){
    let {dispatch} = this.props;
    let form = this.refs['form'];
    form.validateFieldsAndScroll((err, values) => {
      values.category = values.category && values.category.map((v) => {
        return v.id
      })
      if (!err) {
        dispatch({
          type: 'videos/upd',
          id: this.state.row.id,
          ...values
        });
        this.setState({updateVisible:false})
      }
    });
  };

  handleRelativeOk () {
    let postData = []
    if (this.props.category.selCategory.length === 0) {
      message.error('请选择一个分类', 4)
    }
    const menuItems = this.props.category.selCategory.map(c => ({id: c.id, name: c.label}))
    this.props.videos.selectedRows.map((v) => {
      postData.push({learnVideoId: v.id, menuItems})
    })
    this.props.dispatch({
      type: 'videos/updRelativeSync',
      data: postData
    })
    this.toggleMenuTreeModal(false)
  }

  handleCancel () {
    this.setState({
      updateVisible: false
    });
  };

  showVideoForm (row) {
    row.category = this.initMenuTree(row)
    this.setState({updateVisible:true,row});
  };

  renderColumns () {
    let {dispatch} = this.props;
    return [{
      title: '标题',
      dataIndex: 'name',
      width: '30%'
    }, {
      title: '链接',
      dataIndex: 'videoUrl',
      render: url=><a target="_blank" href={url}>{url}</a>
    }, {
      title: '操作',
      width: '15%',
      render: (v,row) =>{
        let style = {fontSize:'1.5em',marginRight:'.5em',verticalAlign:'middle'};
        return [
          <Icon key={1} type="edit" style={{color:'cadetblue',...style}} onClick={() => this.showVideoForm(row)}/>,
          <Popconfirm key={2} title="确认删除?" onConfirm={()=>dispatch({type:'videos/del',ids:[row.id]})} okText="确定" cancelText="取消">
            <Icon type="delete" style={{color:'tomato',...style}}/>
          </Popconfirm>
        ]
      }
    }];
  };

  initMenuTree (row) {
    const category = row.menuArray.map((k) => {
      return {
        key: k.name,
        label: k.name,
        id: k.id + ''
      }
    })
    this.props.dispatch({
      type: 'category/setSelCategory',
      selCategory: category
    })
    return category
  }

  toggleMenuTreeModal (show) {
    const row = this.props.videos.selectedRows[0]
    this.setState({
      ...this.state,
      showMenuTreeModal: show
    })
  }

  onCascaderChange (value) {
    const id = value[value.length - 1]
    this.props.dispatch({type: 'videos/getAll', menuItemId: id})
  }

  onRowChange(selectedRowKeys, selectedRows) {
    this.props.dispatch({type: 'videos/setSelectedRows', selectedRows})
    this.setState({menuEditable: selectedRowKeys.length > 0})
  }

  render() {
    let { data } = this.props.videos
    let vLoading = this.props.videos.loading
    let category = this.props.category.data
    const { dispatch } = this.props
    const locale = { emptyText: '暂无数据，点击左上方选择一个类别'}
    const rowSelection = {
      onChange: this.onRowChange
    }
    const cascaderRender = (label, selectedOptions) => {
      // console.log(label, selectedOptions)
    }

    return (
      <Card title="视频列表">
        <Row style={{marginBottom: '10px'}}>
          <Col span={16}><Spin style={{width: "300px"}} spinning={this.props.loading}><Cascader style={{width: "300px"}} size="large" options={category} onChange={this.onCascaderChange} placeholder="选择一个类别"/></Spin></Col>
          <Col style={{float: 'right'}}>
            <Button size="large" disabled={!this.state.menuEditable} onClick={() => this.toggleMenuTreeModal(true)}>编辑所属类别</Button>
            <Popconfirm key={3} title="确认删除选中的视频?" onConfirm={()=>dispatch({type:'videos/del',ids:this.props.videos.selectedRows.map(v=>v.id)})} okText="确定" cancelText="取消">
              <Button type="dashed" size="large" disabled={!this.state.menuEditable}>删除</Button>
            </Popconfirm>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Spin spinning={vLoading}><Table locale={locale} rowSelection={rowSelection} columns={this.renderColumns()} dataSource={data} /></Spin>
          </Col>
        </Row>
        <Modal title="修改视频信息"
               visible={this.state.updateVisible}
               onOk={this.handleOk}
               confirmLoading={vLoading}
               onCancel={this.handleCancel.bind(this)}>
          <VideoForm {...this.props} ref="form" row={this.state.row} />
        </Modal>
        <Modal title="选择分类"
               visible={this.state.showMenuTreeModal}
               onOk={this.handleRelativeOk}
               onCancel={() => this.toggleMenuTreeModal(false)}>
          <MenuTree></MenuTree>
        </Modal>
      </Card>
    );
  }

}

export default connect(({videos, category, loading})=>({videos, category, loading: loading.global}))(VideoList);
