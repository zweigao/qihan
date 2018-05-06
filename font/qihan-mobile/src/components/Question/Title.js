import React from 'react';
import { WingBlank } from 'antd-mobile';
import styles from './Item.less'

const type = {
  'SINGLE_OPTION': '单选题',
  'MULTIPLE_OPTION': '多选题',
  'FILL_IN': '填空题',
  'HEARING': '听力',
  'DESCRIPTION': '简述',
  'TRUE_OR_FALSE': '判断'
}

function Title ({ questionType, content }) {

  return (
    <WingBlank>
      { content? <p className={styles.content}><span className={styles['type-text']}>{`[${type[questionType]}]`}</span><span dangerouslySetInnerHTML={{__html: content}}></span></p> : null }
    </WingBlank>
  )
  
}

export default Title
