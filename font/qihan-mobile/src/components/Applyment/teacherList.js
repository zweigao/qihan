import React from 'react';
import {connect} from 'dva';
import { List, WhiteSpace, WingBlank, NavBar, SearchBar } from 'antd-mobile';

const Item = List.Item

class TeacherList extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      searchText: ''
    }

    this.onSearchChange = this.onSearchChange.bind(this)
  }

  onSearchChange (value) {
    console.log(value)
    this.setState({
      ...this.state,
      searchText: value
    })
  }

  render () {
    const { teachers } = this.props
    console.log(teachers)
    var teacher = []
    for(var i=0;i<teachers.length;i++){
          teacher.push(teachers[i].label)
    }
    console.log(teacher)
    return (
      <div>
        <NavBar leftContent={'返回'}
          mode="light"
          onLeftClick={this.props.hiddenPopup}
          rightContent={null}>
          {'选择考试科目'}
        </NavBar>
        <List>
          {teacher.length > 0?
            teacher.filter(m => m.indexOf(this.state.searchText) >= 0).map((m, index) => {
              return (
                <Item key={index} arrow="horizontal" onClick={() =>  this.props.onSchoolClick(m,index)}>{m}</Item>
              )
            }): null
          }
        </List>
      </div>
    )
  }
}

export default TeacherList


