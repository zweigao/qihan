import React, {Component} from 'react';
import {connect} from 'dva';
import {Row,Col,Menu,Icon,Affix,Modal,Table} from 'antd';
import {Link} from 'dva/router'

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

class Main extends Component {

  constructor(props) {
    super(props);
    props.dispatch({
      type:'exam/getAll'
    });
    this.state = {
      visible: false
    }
  }

  renderColumns(){
    let {menu} = this.state;
    return[{
      width: '60%',
      dataIndex: 'examCheckIn.courseItem.name'
    },{
      render: (v,r) => (
        menu=='video'?<Link onClick={this.handleCancel} to={"/video/"+r.examCheckIn.courseItem.id}>查看视频</Link>:
          <div onClick={this.handleCancel}><Link to={"/chapter/"+r.examCheckIn.courseItem.id}>章节练习</Link>　<Link to={"/paper/"+r.examCheckIn.courseItem.id}>模拟试题</Link></div>
      )
    }];
  }

  showCourses = (menu) => {
    this.setState({visible: true,menu})
  };

  handleCancel = () => {
    this.setState({visible: false})
  };

  onMenuClick = (item) => {
    if (item.key=='video'||item.key=='paper')
      this.showCourses(item.key);
  };

  render() {
    let {visible} = this.state;
    let {exam} = this.props;
    return (
      <Row>
        <Col span="4" lg={{span:3,offset:2}}>
          <Affix>
            <Menu style={{borderTop: '3px solid #ee491f',padding:10}} onClick={this.onMenuClick}>
              <Menu.Item style={{borderRight:'none'}}><Link to="/"><Icon type="home" style={styles.icon}/> 首页</Link></Menu.Item>
              <Menu.Item style={{borderRight:'none'}}><Link to="/notification"><Icon type="bulb" style={styles.icon}/> 公告</Link></Menu.Item>
              <Menu.Item style={{borderRight:'none'}}><Link to="/enter-exam"><Icon type="calendar" style={styles.icon}/> 考试</Link></Menu.Item>
              <Menu.Item key="paper" style={{borderRight:'none'}}><Icon type="exception" style={styles.icon}/> 题库</Menu.Item>
              <Menu.Item key="video" style={{borderRight:'none'}}><Icon type="video-camera" style={styles.icon}/> 视频</Menu.Item>
              <Menu.Item style={{borderRight:'none'}}><Link to="/customer"><Icon type="customer-service" style={styles.icon}/> 客服</Link></Menu.Item>
              {/*<Menu.Item style={{borderRight:'none'}}><Icon type="user" style={styles.icon}/> 账号</Menu.Item>*/}
            </Menu>
          </Affix>
        </Col>
        <Col span="19" offset="1" lg={{span:16,offset:1}}>
          {this.props.children}
        </Col>
        <Modal title="请选择科目"
               width="50%"
               visible={visible}
               footer={false}
               onCancel={this.handleCancel}>
          <Table showHeader={false} columns={this.renderColumns()} dataSource={exam.data} pagination={false}/>
        </Modal>
      </Row>
    );
  }

}

export default connect(({exam})=>({exam}))(Main);
