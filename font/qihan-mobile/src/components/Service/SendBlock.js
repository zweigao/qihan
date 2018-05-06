import React from 'react';
import { Icon, Card, Flex, Button, TextareaItem, Toast } from 'antd-mobile';
import styles from './SendBlock.less'
import { createForm } from 'rc-form';

const FlexItem = Flex.Item

class SendBlock extends React.Component {

  constructor (...props) {
    super(...props)
  }

  componentDidMount() {
    this.props.scrollToBottom()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.services.length !== this.props.services.length) {
      this.props.scrollToBottom()
      this.props.form.setFieldsValue({content: ''})
    }
  }

  send () {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        this.props.send(value.content)
      } else {
        Toast.info(error.content.errors[0].message)
      }
    })
  }
  
  render () {
    const { getFieldProps } = this.props.form
    return (
      <Flex className={styles['send-block']}>
        <TextareaItem
          {...getFieldProps('content', {
            initialValue: this.props.userName,
            rules: [{ required: true, message: '请输入内容' }]
          })}
          className={styles.input}
          placeholder="我想问...">
        </TextareaItem>
        <FlexItem><Button className={styles.btn} size="small" onClick={this.send.bind(this)}>发送</Button></FlexItem>
      </Flex>
    )
  }
}

SendBlock.propTypes = {
  services: React.PropTypes.array
}

export default createForm()(SendBlock)