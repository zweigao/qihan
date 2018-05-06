import React from 'react';
import {connect} from 'dva';
import { List } from 'antd-mobile';
import moment from 'moment'
import EmptyHint from '../components/EmptyHint'

const Item = List.Item
const Brief = Item.Brief

const STATUS = {
  HAS_BEEN_CHECKIN: '已报考',
  UNPASSED: '未通过',
  PASSED: '已通过'
}

function Checkin({ dispatch, account: { examCheckInfo } }) {
  
  return (
    <div>
      {
        examCheckInfo.length > 0 ?
        examCheckInfo.map((e, index) => {
          return (
            <List renderHeader={() => e.examCheckIn.courseItem.name} key={`${e.id}`} className="no-last-line">
              <Item
                extra={<div>{e.examCheckIn.courseItem.name}<Brief>{e.examCheckIn.displayContent}</Brief></div>}
                key={`${e.id}_1`}
              >科目
              </Item>
             <Item extra={STATUS[e.status]} key={`${e.id}_2`}>状态</Item>
             <Item extra={moment(e.examCheckIn.examTimestamp).format("YYYY-MM-DD")} key={`${e.id}_3`}>考试时间</Item>
             {e.examAra? <Item extra={e.examAra} key={`${e.id}_4`}>考试区域</Item> : null}
            </List>
          )
        }) :
        <EmptyHint></EmptyHint>
      }
    </div>
  );
}

export default connect(({ account }) => ({ account }))(Checkin);
