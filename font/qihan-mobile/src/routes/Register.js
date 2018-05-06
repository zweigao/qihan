import React from 'react';
import {connect} from 'dva';
import { List, Accordion, WhiteSpace } from 'antd-mobile';
import EmptyHint from '../components/EmptyHint'
import InfoList from '../components/Account/RegisterInfoList'

function Resgister({ dispatch, account: { examRegistorInfo, curInfoIndex } }) {
  const registerProps = {
    infos: examRegistorInfo
  }
  
  return (
    <div>
      <WhiteSpace size="lg"></WhiteSpace>
      {
        examRegistorInfo.length > 0?
        <Accordion>
          {examRegistorInfo.map((e, index) => {
            return (
              <Accordion.Panel header={e.registerItemInfo.registerItem.name} key={index}>
                <InfoList {...registerProps} index={index}></InfoList>
              </Accordion.Panel>
            )
          })}
        </Accordion> :
        <EmptyHint></EmptyHint>
      }
    </div>
  );
}

export default connect(({ account }) => ({ account }))(Resgister);
