import React from 'react';
import {connect} from 'dva';
import {Icon,Popover,Popconfirm,Input,Spin,Dropdown,Menu,Button,Tag,Modal,message} from 'antd';
import SortableTree from 'react-sortable-tree';
import SearchInput from '../../components/ui/SearchInput';
import MenuTree from '../../components/MenuTree'
let ButtonGroup = Button.Group;
const CheckableTag = Tag.CheckableTag;

class Category extends React.Component{

  constructor(props){
    super(props);
    if (props.category.data.length==0)
      props.dispatch({type:'category/getList'});
    else
      props.dispatch({type:'category/setList'});
    if (Object.keys(props.category.fieldsList).length==0)
      props.dispatch({type:'category/getFieldsList'});
    this.state = {
      search: '',
      menuId: -1,
      visible: false,
      menuTreeVisible: false
    }
  }

  addTopLevel = (event) => {
    event.preventDefault()
    let text = document.getElementById("addTopText").value;
    if (text.length==0) return;
    let {dispatch} = this.props;
    dispatch({
      type: 'category/add',
      pid: 0,
      text
    })
  };

  saveMenu = () => {
    let {dispatch,category} = this.props;
    dispatch({
      type:'category/saveMenu',
      data:category.data
    });
  };

  setStatus = (row,stat) => {
    if (stat.key==='selectFields'){ //选择报名字段
      this.setState({visible:true,menuId:row.node.id});
      return;
    } else if (stat.key === 'copyResourse') {
      this.setState({
        ...this.state,
        menuTreeVisible: true,
        menuId: row.node.id
      })
    }
    let {dispatch} = this.props;
    stat = stat.key;
    let status = {};
    status[stat] = !row.node[stat];
    dispatch({
      type: 'category/setStatus',
      id: row.node.id,
      path: row.path,
      status
    })
  };

  add(event, row){
    event.preventDefault()
    let {dispatch} = this.props;
    let addText = document.getElementById("addText"+row.treeIndex).value;
    dispatch({
      type: 'category/add',
      pid: row.node.id,
      key: row.treeIndex,
      text: addText
    })
  }

  upd(event, row){
    event.preventDefault()
    let {dispatch} = this.props;
    let updText = document.getElementById("updText"+row.treeIndex).value;
    dispatch({
      type: 'category/upd',
      id: row.node.id,
      path: row.path,
      text: updText
    })
  }

  del(row){
    let {dispatch} = this.props;
    dispatch({
      type: 'category/del',
      id: row.node.id,
      path: row.path
    })
  }

  handleCancel = () => {
    this.setState({visible:false})
  };

  toggleField = (flag) => {
    let {category,dispatch} = this.props;
    let {menuId} = this.state;
    if (flag){
      dispatch({
        type: 'category/setFields',
        menuId,
        flag
      })
    } else {
      if (category.fieldsList[menuId].id)
        dispatch({
          type: 'category/delFieldsSet',
          menuId
        });
    }
  };

  selectFields = () => {
    let {menuId} = this.state;
    let {category,dispatch} = this.props;
    dispatch({
      type: 'category/saveFields',
      menuId,
      fields: category.fieldsList[menuId]
    });
    this.setState({visible:false})
  };

  renderMoreButtons(row) {
    return (
      <Menu onClick={(item) => this.setStatus(row,item)}>
        <Menu.Item key={'isRegisterItem'}>{row.node.isRegisterItem?'取消报名项目标记':'标记为报名项目'}</Menu.Item>
        <Menu.Item key={'isCourse'}>{row.node.isCourse?'取消课程项目标记':'标记为课程项目'}</Menu.Item>
        <Menu.Item key={'isChapter'}>{row.node.isChapter?'取消课程章节标记':'标记为章节项目'}</Menu.Item>
        <Menu.Item key={'hiddenFlag'}>{row.node.hiddenFlag?'显示':'隐藏'}菜单项目</Menu.Item>
        <Menu.Item key={'selectFields'}>报名材料管理</Menu.Item>
        {row.node.isCourse ? <Menu.Item key={'copyResourse'}>导入视频和题目</Menu.Item> : null}
      </Menu>
    )
  };

  renderButtons(row) {
    let {loading} = this.props.category;
    let btnStyle = {verticalAlign: 'middle',fontSize:'1.2em',marginRight:'.5em'};
    return [
      <Popover title="添加子分类" trigger="click"
               content={<Spin spinning={loading}><form onSubmit={(event) => this.add(event, row)}><Input id={"addText"+row.treeIndex}/></form></Spin>}><Icon
        type="plus-circle-o" style={{color:'cadetblue',...btnStyle}}/></Popover>,
      <Popover title="编辑" trigger="click"
               content={<Spin spinning={loading}><form onSubmit={(event) => this.upd(event, row)}><Input defaultValue={row.node.title} id={"updText"+row.treeIndex}/></form></Spin>}><Icon
        type="edit" style={{color:'orange',...btnStyle}}/></Popover>,
      <Popconfirm title="确认删除(删除无法恢复)？" onConfirm={() => this.del(row)} okText="确认" cancelText="取消">
        <Icon type="delete" style={{color:'tomato',...btnStyle}}/>
      </Popconfirm>,
      <Dropdown overlay={this.renderMoreButtons(row)} trigger={["click"]}>
        <Icon type="ellipsis" style={{...btnStyle,transform:'rotate(90deg)',marginRight:0}} />
      </Dropdown>
    ];
  }

  onCopyModalOk () {
    const { selCategory } = this.props.category
    if (selCategory.length !== 1) {
      message.warn('请选择一个课程')
    }
    this.props.dispatch({ type:'category/copyResourse', payload: { sourId: selCategory[0].id, destId: this.state.menuId} })
    this.setState({ menuTreeVisible: false })
  }

  componentDidUpdate(){
    let innerTree = document.getElementsByClassName('ReactVirtualized__Grid__innerScrollContainer');
    if (innerTree.length!=0&&innerTree[0].style.height!=this.state.height) {
      let height = innerTree[0].style.height;
      this.setState({height})
    }
  }

  render() {
    let {category,dispatch} = this.props;
    let height = this.state.height?this.state.height:category.data.length * 62;
    let feilds = {
      addressNeedFlag: "联系地址",
      examAreaNeedFlag: "报考城市",
      idCardImgNeedFlag: "身份证图片",
      nativePlaceNeedFlag: "籍贯",
      oriSchoolNameNeedFlag: "学校",
      professionalNeedFlag: "专业",
      qqNeedFlag: "QQ",
      standerImgNeedFlag: "标准头像",
      studentCardImgNeedFlag: "学生证图片"
    };
    let currentFields = category.fieldsList[this.state.menuId]||{};
    return (
      <div>
        <ButtonGroup size="large">
          <Popover title="添加顶级分类"
                   content={<Spin spinning={category.loading}><form onSubmit={this.addTopLevel}><Input id={"addTopText"}/></form></Spin>}>
            <Button type="primary" icon="plus" />
          </Popover>
          <Popconfirm title="确认保存菜单？" onConfirm={this.saveMenu} okText="确认" cancelText="取消">
            <Button icon={category.loading?'loading':'save'} />
          </Popconfirm>
        </ButtonGroup>
        <br/><br/>
        <SearchInput placeholder="搜索分类菜单" style={{ width: 300 }} onSearch={v=>this.setState({search:v})}/>
        <SortableTree
          style={{height}}
          treeData={category.data}
          searchQuery={this.state.search}
          onChange={treeData => dispatch({type:'category/change',treeData})}
          generateNodeProps={row => ({buttons:this.renderButtons(row)})}
        />
        <Modal title="报名材料管理"
               visible={this.state.visible}
               onOk={this.selectFields}
               onCancel={this.handleCancel}>
          {Object.keys(feilds).map(k=>(
              <CheckableTag key={k} checked={currentFields[k]} onChange={()=>this.toggleField(k)}>{feilds[k]}</CheckableTag>
            ))
          }
          {currentFields.id?<div><br/><Button style={{color:'tomato',borderColor:'tomato'}} size="small" type="dashed" icon="reload" onClick={()=>this.toggleField(false)}>清除报名材料</Button></div>:null}
        </Modal>
        <Modal title="选择分类"
               visible={this.state.menuTreeVisible}
               onOk={this.onCopyModalOk.bind(this)}
               onCancel={() => {this.setState({ menuTreeVisible: false })}}>
          <MenuTree courseFilter={true}></MenuTree>
        </Modal>
      </div>
    );
  }

};

export default connect(({category})=>({category}))(Category);
