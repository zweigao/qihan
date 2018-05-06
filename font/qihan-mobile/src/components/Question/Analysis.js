import React from 'react';
import { WingBlank } from 'antd-mobile';
import styles from './Item.less'

class Analysis extends React.Component {

  componentDidMount() {
    // 滚动到底部
    const elContent = document.getElementById('que-content')
    const elAnalysis = document.getElementById('que-analysis')
    elContent.scrollTop = elAnalysis.offsetTop - 100
  }

  render() {
    let { questionType, analysis, standardAnswer, stuAnswer } = this.props

    if (questionType === 'SINGLE_OPTION' && stuAnswer !== null) {
      stuAnswer = String.fromCharCode(65 + stuAnswer)
    } else if (questionType === 'MULTIPLE_OPTION' && stuAnswer) {
      stuAnswer = stuAnswer.map((a) => String.fromCharCode(65 + a)).sort((a, b) => a > b).join(',')
    } else if (questionType === 'TRUE_OR_FALSE') {
      if (stuAnswer !== null) {
        stuAnswer = stuAnswer === 0 ? '对' : '错'
      }
      standardAnswer = standardAnswer == 0 ? '对' : '错'
    }

    if (stuAnswer === null) {
      stuAnswer = '未作答'
    }

    return (
      <WingBlank className={styles.analysis}>
        <p>参考解析</p>
        <div id="que-analysis">
          <p><span className={styles.left}>参考答案: </span><span className={styles.standar}>{standardAnswer}</span></p>
          <p><span className={styles.left}>你的答案: </span><span className={styles.student}>{stuAnswer}</span></p>
          <p><span className={styles.left}>参考解析</span></p>
          {analysis? <p dangerouslySetInnerHTML={{__html: analysis}}></p> : <p>暂无解析</p>}
        </div>
      </WingBlank>
    )
  }
}

export default Analysis
