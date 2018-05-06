import React from 'react';
import { WhiteSpace, List, Checkbox } from 'antd-mobile';
import styles from './Item.less'

const CheckboxItem = Checkbox.CheckboxItem

class Judge extends React.Component {

  constructor (...props) {
    super(...props)
  }

  render () {
    const optionList = ['对', '错']
    return (
      <div>
        <List>
          {optionList.map((i, index) => (
            <CheckboxItem
              wrap
              key={index}
              checked={this.props.stuAnswer === index}
              onChange={() => this.props.answer(index)}>
              {i}
            </CheckboxItem>
          ))}
        </List>
      </div>
    );
  }
  
}

export default Judge
