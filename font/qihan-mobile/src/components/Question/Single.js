import React from 'react';
import { WhiteSpace, List, Radio } from 'antd-mobile';
import styles from './Item.less'

const RadioItem = Radio.RadioItem

class Single extends React.Component {

  constructor (...props) {
    super(...props)
  }

  render () {
    let { optionList } = this.props
    if (optionList.length === 0) {
      optionList = ['选项A', '选项B', '选项C', '选项D']
    }
    return (
      <div>
        <List>
          {optionList.map((i, index) => (
            <RadioItem
              className={styles.single}
              wrap
              key={index}
              checked={this.props.stuAnswer === index}
              onChange={() => this.props.answer(index)}>
              <span dangerouslySetInnerHTML={{__html: String.fromCharCode(65 + index) + `、${i}`}}></span>
            </RadioItem>
          ))}
        </List>
      </div>
    );
  }
  
}

export default Single
