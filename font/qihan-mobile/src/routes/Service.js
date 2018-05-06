import React from 'react';
import {connect} from 'dva';
import { findDOMNode } from 'react-dom';
import { Card, WhiteSpace, Icon, List, Flex } from 'antd-mobile';
import ChatPanel from '../components/Service/ChatPanel'
import SendBlock from '../components/Service/SendBlock'
import styles from './Service.less'

const FlexItem = Flex.Item

class Service extends React.Component {

  render () {
    const { dispatch, service } = this.props
    const chatPanelProps = {
      services: service.services,
      updateService () {
        dispatch({ type: 'service/fetchServiceHistory' })
      }
    }
    const sendProps = {
      services: service.services,
      send: (content) => {
        dispatch({type: 'service/sendRequest', payload: {content}})
      },
      scrollToBottom () {
        const el = document.querySelector(`.${styles['chat-panel']}`)
        if (el) {
          el.scrollTop = el.scrollHeight
        }
      }
    }
    return (
      <Flex direction="column" justify="between" align="stretch" className={styles.container}>
        <FlexItem className={styles['chat-panel']} ref="chatPanel">
          <ChatPanel {...chatPanelProps}></ChatPanel>
        </FlexItem>
        <SendBlock {...sendProps} className={styles.send}></SendBlock>
      </Flex>
    );
  }
}

export default connect(({ service }) => ({ service }))(Service);
