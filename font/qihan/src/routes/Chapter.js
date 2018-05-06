import React, {Component} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Card,Table} from 'antd';

let emptyImg = require('../assets/nothing.png');

class Chapter extends Component {

  constructor(props) {
    super(props);
    let menuId = props.params.menuId;
    props.dispatch({
      type:'course/getChapterList',
      menuId
    })
  }

  renderColumns = () => {
    return[{
      dataIndex: 'name'
    },{
      render: (v,r)=>(<Link to={"/questions/"+r.id}>开始做题</Link>)
    }];
  };

  render() {
    let {chapters} = this.props.course;
    return (
      <Card title={"章节练习"} style={{marginBottom:20}}>
        {chapters.length==0? <div style={{margin:'50px',textAlign:'center'}}><img src={emptyImg} /><br/>暂无章节</div>
          : <Table columns={this.renderColumns()} dataSource={chapters} showHeader={false}/>}
      </Card>
    );
  }

}

export default connect(({course})=>({course}))(Chapter);
