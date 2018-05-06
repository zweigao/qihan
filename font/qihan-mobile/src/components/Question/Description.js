import React from 'react';
import { WhiteSpace, List, TextareaItem, Button, WingBlank, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from './Item.less'

class Description extends React.Component {

  constructor (...props) {
    super(...props)
    this.onAnswer = this.onAnswer.bind(this)
    this.state = { isAnswer: false }
  }

  onAnswer () {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        this.setState({ isAnswer: true })
        this.props.answer(value.stuAnswer)
      }
    })
  }

  render () {
    const { getFieldProps, getFieldError } = this.props.form
    return (
      <div>
        <List>
          <TextareaItem
            {...getFieldProps('stuAnswer', {
              initialValue: this.props.stuAnswer,
              rules: [{ required: true }]
            })}
            error={getFieldError('stuAnswer')}
            placeholder="请输入您的答案"
            rows={3}
            autoHeight
            count={250}
          />
        </List>
        <Flex justify="end">
          <Button disabled={this.props.showAnswer} className={styles['desc-btn']} type="primary" size="small" inline={true} onClick={this.onAnswer}>确定</Button>
        </Flex>
      </div>
    );
  }
  
}

export default createForm({
  mapPropsToFields: ({ stuAnswer }) => ({ stuAnswer })
})(Description)
