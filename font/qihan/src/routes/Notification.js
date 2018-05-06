import React, {Component} from 'react';
import {connect} from 'dva';
import {Row,Col,Card,Tag} from 'antd';
import moment from 'moment';

let emptyImg = require('../assets/no-message.png');

class Notification extends Component {

  constructor(props) {
    super(props);
    props.dispatch({
      type:'notify/getAll'
    })
  }

  render() {
    let {data} = this.props.notify;
    return (
      <Card title="系统公告" className="notify-page" style={{width:700}}>
        <Row style={{height:450,overflow:'auto'}}>
          {data.length==0? <div style={{margin:'50px',textAlign:'center'}}><img src={emptyImg} /><br/>暂无消息</div>:''}
          <Col span='20' offset="2">
            {data.map((v,k)=>(
              <Notify key={k} time={moment(v.pubTimestamp).format('YYYY-MM-DD HH:mm')} content={v.content}/>
            ))}
          </Col>
        </Row>
      </Card>
    );
  }

}

class Notify extends Component{

  render(){
    let {time,title,content} = this.props;
    return(
      <div style={{marginBottom:20,textAlign:'center'}}>
        <Tag>{time}</Tag>
        <Card title={title} className="notify-card">
          {content}
        </Card>
      </div>
    )
  }

}

export default connect(({notify})=>({notify}))(Notification);
