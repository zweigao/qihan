import React, {Component} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Card,Table,Dropdown,Menu,Icon} from 'antd';
import moment from 'moment';

class EnterExam extends Component {

  constructor(props) {
    super(props);
  }

  renderMenu(menuId){
    return (
      <Menu>
        <Menu.Item>
          <Link to={"/chapter/"+menuId}>章节练习</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={"/paper/"+menuId}>模拟试题</Link>
        </Menu.Item>
      </Menu>
    )
  }

  renderColumns = () => {
    return[{
      title: '考试科目',
      dataIndex: 'examCheckIn.courseItem.name'
    },{
      title: '考试时间',
      dataIndex: 'examTimestamp',
      render: (v)=>(moment(v).format('YYYY-MM-DD'))
    },{
      title: '操作',
      render: (v,r) => (<div><Dropdown trigger={['click']} overlay={this.renderMenu(r.examCheckIn.courseItem.id)}><a className="ant-dropdown-link" href="#">题库 <Icon type="down"/></a></Dropdown>　<Link to={"/video/"+r.examCheckIn.courseItem.id}>视频</Link></div>)
    }];
  };

  render() {
    let {data} = this.props.exam;
    return (
      <Card title="查看考试">
        <Table pagination={false} columns={this.renderColumns()} dataSource={data} />
      </Card>
    );
  }

}

export default connect(({exam})=>({exam}))(EnterExam);
