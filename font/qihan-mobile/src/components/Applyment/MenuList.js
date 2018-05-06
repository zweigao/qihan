import React from 'react';
import {connect} from 'dva';
import { List, WhiteSpace, WingBlank, NavBar } from 'antd-mobile';

const Item = List.Item

class MenuList extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      curMenu: [],
      prevStack: []
    }

    this.onMenuItemClick = this.onMenuItemClick.bind(this)
    this.onMenuBack = this.onMenuBack.bind(this)
  }

  onMenuItemClick (index) {
    let item = this.state.curMenu[index]
    if (item.isRegisterItem) {
      this.props.onCourseClick(item)
    } else {
      this.state.prevStack.push(this.state.curMenu)
      let curMenu = this.state.curMenu[index].children
      this.setState({
        ...this.state,
        prevStack: [...this.state.prevStack],
        curMenu: [...curMenu]
      })
    }
  }

  onMenuBack () {
    if (this.state.prevStack.length > 0) {
      let curMenu = this.state.prevStack.pop()
      this.setState({
        ...this.state,
        prevStack: [...this.state.prevStack],
        curMenu: [...curMenu]
      })
    } else {
      this.props.hiddenPopup()
    }
  }

  componentDidMount () {
    this.setState({
      ...this.state,
      curMenu: this.props.menuData
    })
  }

  render () {
    const { curMenu } = this.state
    return (
      <div>
        <NavBar leftContent={'返回'}
          mode="light"
          onLeftClick={this.onMenuBack}
          rightContent={null}>
          {'选择科目'}
        </NavBar>
        <List>
          {curMenu.length > 0?
            curMenu.map((m, index) => {
              return (
                <Item key={index} arrow="horizontal" onClick={() => this.onMenuItemClick(index)}>{m.name}</Item>
              )
            }): null
          }
        </List>
      </div>
    )
  }
}

export default MenuList
