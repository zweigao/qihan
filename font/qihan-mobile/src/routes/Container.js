import React from 'react';
import { NavBar, Icon, Progress, TabBar } from 'antd-mobile';
import { connect } from 'dva';
import { Link, browserHistory } from 'dva/router'
import Loading from '../components/Loading'
import styles from './Container.less'

class Container extends React.Component {

  constructor (...args) {
    super(...args)
    this.state = {
      showLoading: false,
      doneLoading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading !== nextProps.loading) {
      if (nextProps.loading) {
        this.setState({
          ...this.state,
          showLoading: true,
          doneLoading: false
        })
      } else {
        this.setState({
          ...this.state,
          doneLoading: true
        })
        setTimeout(() => {
          this.setState({
            ...this.state,
            showLoading: false,
          })
        }, 300)
      }
    }
  }
  
  
  render () {
    const pathname = this.props.routes[this.props.routes.length - 1].path
    const isVideo = pathname === '/video'
    const isCourse = pathname === '/exam'
    const isAccount = pathname === '/account'
    const isHome = isVideo || isCourse || isAccount
    
    return (
      <div className={styles.container}>
        <NavBar leftContent={isHome || pathname === '/login' || pathname === '/applyment'? '' : '返回'}
          mode="light"
          onLeftClick={this.props.global.onLeftClick || (() => !isHome && browserHistory.goBack())}
          rightContent={null}>
          {this.props.global.title || '启翰教育'}
        </NavBar>
        <div>
          {
            this.state.showLoading ? <Loading {...this.state} /> : null
          }
        </div>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#e23b29"
          barTintColor="white"
          hidden={!isHome || pathname === '/login'}
        >
          <TabBar.Item
            title="视频"
            key="video"
            icon={{ uri: require('../assets/icon_video.png') }}
            selectedIcon={{ uri: require('../assets/icon_video_fill.png') }}
            selected={isVideo}
            onPress={() => browserHistory.push('/video')}
          >
            {isVideo && this.props.children}
          </TabBar.Item>
          <TabBar.Item
            icon={{ uri: require('../assets/write.png') }}
            selectedIcon={{ uri: require('../assets/write_fill.png') }}
            title="题库"
            key="exam"
            selected={isCourse}
            onPress={() => browserHistory.push('/exam')}
          >
            {isCourse && this.props.children}
          </TabBar.Item>
          <TabBar.Item
            icon={{ uri: require('../assets/account.png') }}
            selectedIcon={{ uri: require('../assets/account_fill.png') }}
            title="我的"
            key="account"
            selected={isAccount}
            onPress={() => browserHistory.push('/account')}
          >
            {isAccount && this.props.children}
          </TabBar.Item>
        </TabBar>
        {!isHome? <div className={styles.content}>{this.props.children}</div> : null}
      </div>
    );
  }

}

export default connect(({ loading, global }) => ({ loading: loading.global, global }))(Container);
