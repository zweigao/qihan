import React from 'react';
import {connect} from 'dva';
import { Card, WhiteSpace, Icon, List, ActionSheet } from 'antd-mobile';
import { Link } from 'dva/router';
import EmptyHint from '../EmptyHint'
import { browserHistory } from 'dva/router'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class CourseList extends React.Component {

  constructor (...props) {
    super(...props)
    this.showActionSheet = this.showActionSheet.bind(this)
    this.onItemClick = this.onItemClick.bind(this)
  }

  onItemClick (id) {
    const { pathname } = this.props.location
    const { next } = this.props
    if (pathname === '/exam') {
      this.showActionSheet(id)
    } else {
      if (typeof next === 'function') {
        next(id)
      } else {
        browserHistory.push(`${next}/${id}`)
      }
    } 
  }

  showActionSheet (id) {
    const BUTTONS = ['模拟试卷', '章节练习', '取消'];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length - 1,
      message: '选择练习方式',
      maskClosable: true,
      'data-seed': 'logId',
      wrapProps,
    },
    (buttonIndex) => {
      browserHistory.push(buttonIndex === 0? `/exam/paper/${id}` : `/exam/chapter/${id}`)
    });
  }

  render () {
    const list = this.props.list
    const type = /\/(\w*)/.exec(this.props.location.pathname)[1]
    return (
      <div>
        <List renderHeader={() => '选择一个科目'} className="no-last-line">
          {
            list.length > 0 ?
            list.map((l, index) => {
              return (
                <List.Item arrow="horizontal" key={l.id} onClick={() => this.onItemClick(l.id)}>{l.name}</List.Item>
              )
            }) :
            <EmptyHint></EmptyHint>
          }
        </List>
      </div>
    );
  }
  
}

export default CourseList
