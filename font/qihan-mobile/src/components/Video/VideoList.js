import React from 'react';
import {connect} from 'dva';
import { WhiteSpace, Icon, List, Modal } from 'antd-mobile';
import EmptyHint from '../EmptyHint'
import styles from './VideoList.less'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  // Note: the popup content will not scroll.
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class VideoList extends React.Component {

  constructor (...props) {
    super(...props)
    this.onItemClick = this.onItemClick.bind(this)

    this.state = {
      visible: false,
      video: null
    }
  }

  onItemClick (video) {
    this.setState({
      visible: true,
      video
    })
  }

  render () {
    const list = this.props.list
    return (
      <div>
        <List renderHeader={() => '点击观看视频'} className="no-last-line">
          {
            list.length > 0 ?
            list.map((l, index) => {
              return (
                <List.Item arrow="horizontal" wrap key={l.id} onClick={() => this.onItemClick(l)}>{l.name}</List.Item>
              )
            }) :
            <EmptyHint></EmptyHint>
          }
        </List>
        <Modal
          closable
          maskClosable={true}
          transparent={false}
          onClose={() => this.setState({visible: false})}
          visible={this.state.visible}
          className={styles.modal}
          wrapProps={wrapProps}
        >
          {this.state.visible ? <iframe className={styles['video-frame']} src={this.state.video.videoUrl} frameBorder={0} allowFullScreen></iframe> : null}
        </Modal>
      </div>
    );
  }
  
}

export default VideoList
