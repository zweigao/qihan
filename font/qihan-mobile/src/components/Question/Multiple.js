import React from 'react';
import { WhiteSpace, List, Checkbox } from 'antd-mobile';
import styles from './Item.less'

const CheckboxItem = Checkbox.CheckboxItem

class Multiple extends React.Component {

  constructor (...props) {
    super(...props)
  }

  render () {
    let { optionList } = this.props
    if (optionList.length === 0) {
      optionList = ['选项A', '选项B', '选项C', '选项D', '选项E']
    }
    return (
      <div>
        <List>
          {optionList.map((i, index) => (
            <CheckboxItem
              wrap
              key={index}
              checked={this.props.stuAnswer && this.props.stuAnswer.indexOf(index) >= 0}
              onChange={() => this.props.answer(index)}>
              <span dangerouslySetInnerHTML={{__html: String.fromCharCode(65 + index) + `、${i}`}}></span>
            </CheckboxItem>
          ))}
        </List>
      </div>
    );
  }
  
}

export default Multiple
