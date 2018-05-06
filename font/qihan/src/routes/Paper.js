import React, {Component} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Card,Table} from 'antd';

let emptyImg = require('../assets/nothing.png');

class Paper extends Component {

  constructor(props) {
    super(props);
    let menuId = props.params.menuId;
    props.dispatch({
      type:'course/getPaperList',
      menuId
    })
  }

  renderColumns = () => {
    let menuId = this.props.params.menuId;
    return[{
      dataIndex: 'name'
    },{
      render: (v,r)=>(<Link to={"/questions/"+menuId+'/'+r.name}>开始做题</Link>)
    }];
  };

  render() {
    let {papers} = this.props.course;
    return (
      <Card title={"模拟试题"} style={{marginBottom:20}}>
        {papers.length==0? <div style={{margin:'50px',textAlign:'center'}}><img src={emptyImg} /><br/>暂无题目</div>
          : <Table columns={this.renderColumns()} dataSource={papers} showHeader={false}/>}
      </Card>
    );
  }

}

export default connect(({course})=>({course}))(Paper);
