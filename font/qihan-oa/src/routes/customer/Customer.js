import React from 'react';
import {connect} from 'dva';
import { Menu, Icon, Card, Row, Col, Badge, Input, Button, Alert, Modal } from 'antd';
import TimeAgo from 'timeago-react';
import CustomerArchiveTable from '../../components/CustomerArchiveTable';
const SubMenu = Menu.SubMenu;

let intervalId;

class Customer extends React.Component{

  constructor(props){
    super(props);
    props.dispatch({
      type: 'customer/getSessionList',
      hasRead: false
    });
    if (props.params.id) {
      this.getCurrentSession(props.params.id)
    }
    this.state = {
      visible: false
    }
  }

  getCurrentSession = (id) => {
    let {dispatch} = this.props;
    dispatch({
      type: 'customer/getUserInfo',
      userId: id
    });
    this.getSessionInterval(id);
  };

  componentDidMount(){
    this.getSessionInterval(this.props.customer.currentId);
  }

  componentWillUnmount(){
    clearInterval(intervalId);
  }

  componentDidUpdate(){
    let box = document.getElementById('chat-box');
    box.scrollTop = box.scrollHeight;
  }

  handleClick = (e) => {
    let {dispatch} = this.props;
    if (e.key=='notRead'){
      dispatch({
        type: 'customer/getSessionList',
        hasRead: false
      })
    }
    else if (e.key=='hasRead'){
      dispatch({
        type: 'customer/getSessionList',
        hasRead: true
      })
    }
    else {
      this.getCurrentSession(e.key)
    }
  };

  getSessionInterval = (currentId) => {
    if (currentId != -1) {
      let {dispatch} = this.props;
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(function () {
        dispatch({
          type: 'customer/getCurrentSession',
          currentId
        })
      }, 5000);
    }
  };

  handleReply = () => {
    let text = document.getElementById('content');
    let content = text.value;
    if (content.length==0) return;
    let {dispatch,customer} = this.props;
    dispatch({
      type:'customer/reply',
      currentId:customer.currentId,
      content
    });
    text.value = '';
  }

  showUserInfo = () => {
    this.setState({visible:true})
  }

  handleCancel = () => {
    this.setState({visible:false})
  }

  render() {
    const { services,replyLoading,customer,session } = this.props.customer;
    if (session.length==0&&customer.name)
      session.push({isOfficial: false,id: 0,content: '正在与'+customer.name+'对话中',sendTimestamp: +new Date()});
    /*if (this.props.params.id&&session.lenght==0)
      session.push({isOfficial: false,id: 0,content: '正在与'+customer.name+'对话中',sendTimestamp: +new Date()});*/
    return (
      <Card title={customer.name?<div>正在与{customer.name}对话中 <Badge status="success"/></div>:null}>
        <Row>
          <Col span={7}>
            <Menu onClick={this.handleClick}
                  defaultOpenKeys={['notRead']}
                  mode="inline">
              <SubMenu key="notRead" onTitleClick={this.handleClick} title={<span><Icon type="notification" /><span>未回复</span></span>}>
                {services.notRead.map(v=>(<Menu.Item key={v.id}>{v.name}　<Badge dot={!v.hasClick}/></Menu.Item>))}
              </SubMenu>
              <SubMenu key="hasRead" onTitleClick={this.handleClick} title={<span><Icon type="message" /><span>已回复</span></span>}>
                {services.hasRead.map(v=>(<Menu.Item key={v.id}>{v.name}</Menu.Item>))}
              </SubMenu>
            </Menu>
          </Col>
          <Col push={1} span={16} style={{position:'relative'}}>
            <div id="chat-box" style={session.length!=0 ? { marginBottom: '120px',overflow:'scroll',height:350} : null}>
              {session.map(v=>(
                <Row type="flex" align="middle" justify={v.isOfficial?'end':'start'} key={v.id} style={{marginBottom:10}}>
                  {!v.isOfficial?<Col><Icon onClick={this.showUserInfo} type={'user'} style={{fontSize: '2em',marginRight:10}}/></Col>:''}
                  {v.isOfficial?<Col style={{marginRight:10,color:'lightgray'}}><TimeAgo datetime={v.sendTimestamp} locale='zh_CN' live={false}/></Col>:''}
                  <Col><Card className="chat-card">{v.content}</Card></Col>
                  {!v.isOfficial?<Col style={{marginLeft:10,color:'lightgray'}}><TimeAgo datetime={v.sendTimestamp} locale='zh_CN' live={false}/></Col>:''}
                  {v.isOfficial?<Col><Icon type={'customer-service'} style={{fontSize: '2em',marginLeft:10}}/></Col>:''}
                </Row>
              ))}
            </div>
            {session.length==0?
              (<Alert
                message="暂无会话"
                description="请点击左侧菜单查看会话"
                type="info"
              />):
              (<Row style={{position:'absolute',width:'100%',bottom:0}}>
                <Input type="textarea" id="content" autosize={{ minRows: 4, maxRows: 10 }}/>
                <Button style={{float:'right'}} type="ghost" onClick={this.handleReply} loading={replyLoading}>发送</Button>
              </Row>)
            }
          </Col>
        </Row>
        <Modal title="用户资料" width="50%"
               style={{ top: 20 }}
               className="ant-table-content"
               onOk={this.handleCancel}
               visible={this.state.visible}
               onCancel={this.handleCancel}>
          {this.state.visible?<CustomerArchiveTable data={customer}/>:null}
        </Modal>
      </Card>
    );
  }

}

export default connect(({customer})=>({customer}))(Customer);
