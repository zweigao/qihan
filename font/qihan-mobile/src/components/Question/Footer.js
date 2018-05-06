import React from 'react';
import { Icon, Flex, Button } from 'antd-mobile';
import styles from './Footer.less'

class Footer extends React.Component {

  componentDidMount() {
    this.props.setOnLeftClick()
  }

  render () {
    const { next, prev, toggleAnswer } = this.props
    return (
      <Flex justify="around" align="center" className={styles['footer-container']}>
        <Button inline={true} onClick={prev}><Icon type="circle-o-left"/></Button>
        <Button inline={true} onClick={toggleAnswer}><Icon type="book" /><span className={styles.text}>答案</span></Button>
        <Button inline={true} onClick={next}><Icon type="circle-o-right"/></Button>
      </Flex>
    )
  }
}

export default Footer
