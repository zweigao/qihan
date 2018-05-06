import React, {Component} from 'react';
import {connect} from 'dva';
import {Card,Modal,Tabs,Button,message} from 'antd';
import moment from 'moment'
import StudentArchiveTable from '../components/StudentArchiveTable'
const TabPane = Tabs.TabPane;

let styles = {
  icon:{
    fontSize:'x-large',
    verticalAlign:'middle'
  },
  gray:{color:'#999'},
  font:{
    large:{fontSize:'large'},
    medium:{fontSize:'medium'},
    small:{fontSize:'small'}
  }
};

class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      index:0
    };
    if (props.account.examRegisterInfo.length==0)
      props.dispatch({
        type:'account/fetchExamRegisterInfo'
      })
  }

  handleCancel = () => {
    if (!this.isConfirmed()) {
      message.warn('请确认您的报名信息！');
      return;
    }
    this.setState({visible:false});
  };

  isConfirmed = () => {
    let hasConfirmed = true;
    let {examRegisterInfo} = this.props.account;
    examRegisterInfo.map(v=>{
      hasConfirmed = hasConfirmed&&v.hasConfirmed;
    });
    return hasConfirmed;
  };

  showApplyment = () => {
    this.setState({visible:true});
  };

  confirmInfo = () => {
    let {dispatch,account} = this.props;
    let {index} = this.state;
    dispatch({
      type: 'account/confirmInfo',
      id: account.examRegisterInfo[index].id,
      index
    })
  };

  changeTab = (key) => {
    this.setState({index:key})
  };

  render() {
    let {user,account,loading} = this.props;
    let {visible,index} = this.state;
    let info = account.examRegisterInfo;
    let hasConfirmed = info.length>0&&info[index].hasConfirmed;
    Object.keys(user).map(k=>{
      if (!user[k]||user[k].length==0) user[k] = '未填写'
    });
    return (
      <div>
        <Card>
          <h3 style={styles.font.medium}>{moment(+new Date()).format('a')}好，{user.name}</h3><br/>
          <p style={styles.font.small}><span style={styles.gray}>学校：</span>{user.schoolName}</p>
          <p style={styles.font.small}><span style={styles.gray}>专业：</span>{user.profession}</p><br/>
          <p style={styles.font.small}><a onClick={this.showApplyment}>查看报名信息...</a></p>
        </Card>
        <Modal title="报名信息" width="50%"
               style={{ top: 20 }}
               visible={!this.isConfirmed()||visible}
               onCancel={this.handleCancel}
               footer={<div><Button size="large" type="ghost" onClick={this.handleCancel}>取消</Button> <Button loading={loading} type="primary" size="large" onClick={this.confirmInfo} disabled={hasConfirmed}>{hasConfirmed?'已':''}确认</Button></div>}>
          <ApplymentTable data={info} ref="tabs" onChange={this.changeTab}/>
        </Modal>
      </div>
    );
  }

}

class ApplymentTable extends Component{

  constructor(props){
    super(props);
  }

  render(){
    let {data} = this.props;
    // data.push(data[0]);
    return(
      <Tabs defaultActiveKey="0" onChange={this.props.onChange}>
        {data.map((v,k)=>(
          <TabPane tab={v.registerItemInfo.registerItem.name} key={k}><StudentArchiveTable data={v}/></TabPane>
        ))}
      </Tabs>
    )
  }

}

export default connect(({user,account,loading:{global}})=>({user,account,loading:global}))(Account);
