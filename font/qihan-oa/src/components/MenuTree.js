import React from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode
import {connect} from 'dva';

class MenuTree extends React.Component {

  getNodes (category) {
    return (
      category.map((node) => {
        return (
          <TreeNode title={node.title} key={node.id} disableCheckbox={this.props.courseFilter && !node.isCourse}>
            {this.getNodes(node.children)}
          </TreeNode>
        )
      })
    )
  }

  onCheck (info) {
    const rawData = this.props.category.rawData
    const selCategory = info.map((k) => {
      return rawData[k]
    }).filter((k) => {
      if (this.props.courseFilter) {
        return k.isCourse
      } else {
        return k.isCourse || k.isChapter
      }
      // return (k.isCourse || k.isChapter) && (this.props.courseFilter && k.isCourse)
    }).map((k) => {
      return {
        key: `${k.name}(${k.id})`,
        label: k.name,
        id: k.id + '',
        isCourse: k.isCourse
      }
    })
    this.props.dispatch({
      type: 'category/setSelCategory',
      selCategory
    })
  }

  render () {
    const checkedKeys = this.props.category.selCategory.map((k) => {
      return k.id
    })
    return (
      <Tree checkedKeys={checkedKeys} showline checkable multiple onCheck={this.onCheck.bind(this)}>{this.getNodes(this.props.category.data)}</Tree>
    )
  }
}

export default connect(({category})=>({category}))(MenuTree);
