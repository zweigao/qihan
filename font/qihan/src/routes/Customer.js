import React, {Component} from 'react';
import {connect} from 'dva'
import {Card,Row,Col,Icon,Input,Button} from 'antd';
import moment from 'moment';

let emptyImg = require('../assets/nothing.png');
let intervalId;

class Customer extends Component {

  constructor(props) {
    super(props);
    props.dispatch({
      type:'customer/getList'
    });
  }

  componentWillMount(){
    let {dispatch} = this.props;
    intervalId = setInterval(function () {
      dispatch({
        type:'customer/getList'
      });
    },5000)
  }

  componentWillUnmount(){
    clearInterval(intervalId);
  }

  componentDidUpdate(){
    let box = document.getElementById('chat-box');
    box.scrollTop = box.scrollHeight;
  }

  sendMsg =() => {
    let {dispatch} = this.props;
    let input = document.getElementById('content');
    if (content.length==0) return;
    dispatch({
      type:'customer/sendMsg',
      content:input.value
    });
    input.value = '';
  };

  render() {
    let {list} = this.props.customer;
    return (
      <Card title="客服服务" style={{width:700}}>
        <div style={{height:300,marginBottom:50,overflow:'auto'}} id="chat-box">
          {list.length==0? <div style={{margin:'50px',textAlign:'center'}}><img src={emptyImg} /><br/>暂无客服会话</div>:''}
          {list.map((v,k)=>(
            v.isOfficial?(
              <Row type="flex" align="middle" justify={'start'} key={k} style={{marginBottom:10}}>
                <Col><Icon type={'customer-service'} style={{fontSize: '2em',marginRight:10}}/></Col>
                <Col><Card className="chat-card">{v.content}</Card></Col>
                <Col style={{marginLeft:10,color:'lightgray'}}>{moment(v.sendTimestamp).fromNow()}</Col>
              </Row>
            ):(
              <Row type="flex" align="middle" justify={'end'} key={k} style={{marginBottom:10}}>
                <Col style={{marginRight:10,color:'lightgray'}}>{moment(v.sendTimestamp).fromNow()}</Col>
                <Col><Card className="chat-card">{v.content}</Card></Col>
                <Col><Icon type={'user'} style={{fontSize: '2em',marginLeft:10}}/></Col>
              </Row>
            )
          ))}
        </div>
        <div style={{position:'relative',minHeight:100}}>
          <Row style={{position:'absolute',width:'100%',bottom:0}}>
            <Input type="textarea" id="content" autosize={{ minRows: 4, maxRows: 10 }}/>
            <Button style={{float:'right'}} type="ghost" onClick={this.sendMsg}>发送</Button>
          </Row>
        </div>
      </Card>
    );
  }

}

export default connect(({customer})=>({customer}))(Customer);
