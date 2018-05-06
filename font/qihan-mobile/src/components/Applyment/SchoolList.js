import React from 'react';
import {connect} from 'dva';
import { List, WhiteSpace, WingBlank, NavBar, SearchBar } from 'antd-mobile';

const Item = List.Item

class SchoolList extends React.Component {

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
    const { schools } = this.props
    return (
      <div>
        <NavBar leftContent={'返回'}
          mode="light"
          onLeftClick={this.props.hiddenPopup}
          rightContent={null}>
          {'选择学校'}
        </NavBar>
        <SearchBar placeholder="搜索" onChange={this.onSearchChange}></SearchBar>
        <List>
          {schools.length > 0?
            schools.filter(m => m.indexOf(this.state.searchText) >= 0).map((m, index) => {
              return (
                <Item key={index} arrow="horizontal" onClick={() => this.props.onSchoolClick(m)}>{m}</Item>
              )
            }): null
          }
        </List>
      </div>
    )
  }
}

export default SchoolList
