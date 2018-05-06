import React from 'react';
import {connect} from 'dva';
import { Table, Card, Icon, Popconfirm, Tag, Modal, Popover, Tooltip } from 'antd';
import AchievementTable from '../../components/AchievementTable'

class Achievement extends React.Component{

  constructor(props){
    super(props);
  }

  componentDidMount () {
    this.props.dispatch({ type: 'staffs/fetchAchievement', payload: { id: sessionStorage.getItem('id') }})
  }

  render() {
    return (
      <Card title="业绩记录">
        <AchievementTable achievement={this.props.staffs.achievement} loading={this.props.loading}/>        
      </Card>
    );
  }

}

export default connect(({staffs,loading})=>({staffs,loading: loading.global}))(Achievement);

