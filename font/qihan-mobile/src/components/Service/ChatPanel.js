import React from 'react';
import { Icon, Card, Flex } from 'antd-mobile';
import styles from './ChatPanel.less'
import moment from 'moment'

const FlexItem = Flex.Item

class ChatPanel extends React.Component {

  constructor (...props) {
    super(...props)
  }

  componentDidMount () {
    this.timer = setInterval(() => {
      this.props.updateService()
    }, 5000)
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }
  

  render () {
    return (
      <Flex direction="column" align="stretch">
        {
          this.props.services.map((s, index) => {
            const style = s.isOfficial ? styles['chat-item'] : `${styles.right} ${styles['chat-item']}`
            return (
              <FlexItem className={style} key={index}>
                <Icon type={s.isOfficial ? 'customerservice' : 'user'} className={styles.icon}/>
                <Card className={styles.card}>{s.content}</Card>
                <div className={styles.timeago}>{moment(s.sendTimestamp).fromNow()}</div>
              </FlexItem>
            )
          })
        }
      </Flex>
    )
  }
}

ChatPanel.propTypes = {
  services: React.PropTypes.array
}

export default ChatPanel