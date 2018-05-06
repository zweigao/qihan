import React, {Component} from 'react';
import {connect} from 'dva';
import {Card,Table,Modal} from 'antd';
import styles from './Video.less'

let emptyImg = require('../assets/nothing.png');

class Video extends Component {

  constructor(props) {
    super(props);
    let menuId = props.params.menuId;
    props.dispatch({
      type: 'course/getVideos',
      menuId
    });
    this.state = {
      videoVisible: false
    }
  }

  showVideo = (video) => {
    this.setState({video,videoVisible:true})
  };

  stopVideo = () => {
    this.setState({video:{},videoVisible:false})
  };

  renderColumns = () => {
    return[{
      dataIndex: 'name'
    },{
      render: (v,r)=>(<a onClick={()=>this.showVideo(r)}>观看视频</a>)
    }];
  };

  render() {
    let {videos} = this.props.course;
    let {videoVisible,video} = this.state;
    let height = document.body.clientHeight-200;
    return (
      <Card title={"视频课程"} style={{marginBottom:20}}>
        {videos.length==0? <div style={{margin:'50px',textAlign:'center'}}><img src={emptyImg} /><br/>暂无视频</div>
          : <Table columns={this.renderColumns()} dataSource={videos} showHeader={false}/>}
        <Modal
          width="66%"
          className={styles['video-box']}
          visible={videoVisible}
          onCancel={this.stopVideo}
          footer={false}>
          <iframe src={video&&video.videoUrl} height={height} frameBorder={0} allowFullScreen></iframe>
        </Modal>
      </Card>
    );
  }

}

export default connect(({course,exam})=>({course,exam}))(Video);
