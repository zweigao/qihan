import React from 'react';
import {connect} from 'dva';
import { Card, WhiteSpace, Icon, List, ListView, ActivityIndicator } from 'antd-mobile';
import { Link } from 'dva/router';
import EmptyHint from '../EmptyHint'

const { Item } = List

const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
const dataSource = new ListView.DataSource({
  getRowData,
  getSectionHeaderData: getSectionData,
  rowHasChanged: (row1, row2) => row1 !== row2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});
const SIZE = 10

class SubCourseList extends React.Component {

  constructor (...props) {
    super(...props)
  }

  componentDidMount() {
    this.props.getMoreList(this.props.id)
  }

  onEndReached(event) {
    // load new data
    // return
    console.log('reach end', event);
    if (!this.props.loading) {
      const { dataSource, pageIndex, total } = this.props
      if (pageIndex * SIZE < total) {
        this.props.getMoreList(this.props.id)
      }
    }
  }

  render () {
    let newDataSource = dataSource.cloneWithRowsAndSections(this.props.dataSource.dataBlob, this.props.dataSource.sectionIDs, this.props.dataSource.rowIDs)
    const { id, next } = this.props
    return (
      <ListView
        dataSource={newDataSource}
        renderHeader={() => <span>选择一个试卷</span>}
        renderFooter={() => <div style={{ padding: 10, textAlign: 'center', justifyContent: 'center' }}>
          {this.props.loading ? <ActivityIndicator className="loading-indicator" text="加载中..."/> : '加载完毕'}
        </div>}
        renderRow={(rowData) => (<Item wrap arrow="horizontal" onClick={() => next(id, rowData)}>{rowData}</Item>)}
        style={{
          height: document.body.clientHeight - 45
        }}
        pageSize={2}
        scrollRenderAheadDistance={500}
        scrollEventThrottle={20}
        onScroll={() => { console.log('scroll'); }}
        onEndReached={this.onEndReached.bind(this)}
        onEndReachedThreshold={10}
        delayTime={10}
      />
    );
  }
}

export default SubCourseList
