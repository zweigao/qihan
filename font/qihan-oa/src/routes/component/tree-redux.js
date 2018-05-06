import React from 'react';
import {connect} from 'dva';
import {Icon,Tooltip,Popover,Popconfirm,Input,Spin} from 'antd';
import SortableTree from 'react-sortable-tree';

const Category = React.createClass({

  add(row){
    let {dispatch} = this.props;
    return ()=>{
      let addText = document.getElementById("addText"+row.treeIndex).value;
      dispatch({
        type: 'category/addDelay',
        key: row.treeIndex,
        text: addText
      })
    }
  },
  upd(row){
    let {dispatch} = this.props;
    return ()=>{
      let updText = document.getElementById("updText"+row.treeIndex).value;
      dispatch({
        type: 'category/upd',
        path: row.path,
        text: updText
      })
    }
  },
  del(row){
    let {dispatch} = this.props;
    return ()=>{
      dispatch({
        type: 'category/del',
        path: row.path
      })
    }
  },

  renderButtons(row) {
    let {loading} = this.props.category;
    let btnStyle = {verticalAlign: 'middle',fontSize:'1.2em',marginRight:'.5em'};
    return [
      <Popover title="添加子分类" trigger="click"
               content={<Spin spinning={loading}><form onSubmit={this.add(row)}><Input id={"addText"+row.treeIndex}/></form></Spin>}><Icon
        type="plus-circle-o" style={{color:'cadetblue',...btnStyle}}/></Popover>,
      <Popover title="编辑" trigger="click"
               content={<Spin spinning={loading}><form onSubmit={this.upd(row)}><Input defaultValue={row.node.title} id={"updText"+row.treeIndex}/></form></Spin>}><Icon
        type="edit" style={{color:'orange',...btnStyle}}/></Popover>,
      <Popconfirm title="确认删除(将会删除子分类)？" onConfirm={this.del(row)} okText="好的" cancelText="取消">
        <Icon type="delete" style={{color:'tomato',...btnStyle}}/>
      </Popconfirm>
    ];
  },

  render: function () {
    let {category,dispatch} = this.props;
    return (
      <SortableTree
        style={{top:'10px',bottom:0,left:'10px',right:0,position:'absolute'}}
        treeData={category.data}
        searchQuery={''}
        onChange={treeData => dispatch({type:'category/change',treeData})}
        generateNodeProps={row => ({buttons:this.renderButtons(row)})}
      />
    );
  }

});

export default connect(({category})=>({category}))(Category);
