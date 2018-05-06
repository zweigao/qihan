import React from 'react';
import { WhiteSpace } from 'antd-mobile';
import Title from './Title'
import Single from './Single'
import Multiple from './Multiple'
import Analysis from './Analysis'
import Judge from './Judge'
import Description from './Description'

/*<Option key="1" value="SINGLE_OPTION">单选题</Option>,
<Option key="2" value="MULTIPLE_OPTION">多选题</Option>,
<Option key="3" value="FILL_IN">填空题</Option>,
<Option key="4" value="HEARING">听力</Option>,
<Option key="4" value="DESCRIPTION">简述</Option>,
<Option key="4" value="TRUE_OR_FALSE">判断</Option>*/

class QuestionItem extends React.Component {

  constructor (...props) {
    super(...props)
  }

  render () {
    const { question } = this.props
    let Item
    if (question) {
      const questionProps = {
        ...question,
        answer: this.props.answer 
      }
      if (question.questionType === 'SINGLE_OPTION') {
        Item = <Single {...questionProps} />
      } else if (question.questionType === 'MULTIPLE_OPTION') {
        Item = <Multiple {...questionProps} />
      } else if (question.questionType === 'TRUE_OR_FALSE') {
        Item = <Judge {...questionProps} />
      } else if (question.questionType === 'DESCRIPTION' || question.questionType === 'FILL_IN') {
        Item = <Description {...questionProps} />
      }
    }
    return (
      <div id="que-content">
        <Title {...question}></Title>
        { Item }
        { question.showAnswer? <Analysis {...question}></Analysis> : null }
      </div>
    );
  }
  
}

export default QuestionItem
