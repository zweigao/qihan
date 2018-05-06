import React from 'react';
import { List, InputItem, WhiteSpace, WingBlank, Popup, Button, Icon, Modal } from 'antd-mobile';
import styles from './Account.less'
import imgUri from '../../utils/imgUri'

class RegisterInfoList extends React.Component {

  constructor (...props) {
    super(...props)
    this.state = {visible: false, src: ''}
    this.onOpen = this.onOpen.bind(this)
  }

  onOpen (src) {
    if (src) {
      this.setState({visible: true, src})
    }
  }

  render () {
    const info = this.props.infos[this.props.index]
    return (
      <div>
        <List renderHeader={() => (
          <div style={{ position: 'relative' }}>
            个人信息
            <span
              style={{
                position: 'absolute', right: 3,
              }}
            >
              {`${this.props.index+1} / ${this.props.infos.length}`}
            </span>
          </div>)}
          className="popup-list"
        >
          <List.Item extra={info.student.name} key={1}>{'姓名'}</List.Item>
          <List.Item extra={info.student.sex === 'FEMALE' ? '女' : '男'} key={2}>{'性别'}</List.Item>
          <List.Item extra={info.nation} key={14}>{'民族'}</List.Item>
          <List.Item extra={info.student.mobile} key={3}>{'手机'}</List.Item>
          <List.Item className={"extra-multiple-line"} extra={info.student.identityCardCode} key={4} multipleLine>{'身份证'}</List.Item>
          <List.Item className={"extra-multiple-line"} extra={info.student.address || '(未填)'} wrap key={5} multipleLine>{'地址'}</List.Item>
          <List.Item extra={info.student.nativePlace || ''} key={6}>{'籍贯'}</List.Item>
          <List.Item extra={!info.userStanderImg && '(未填)'} key={9} arrow="horizontal" onClick={() => {this.onOpen(info.userStanderImg)}}>{'个人照片'}</List.Item>
        </List>
        <List renderHeader={() => '报名信息'}>
          <List.Item extra={info.examArea} key={7}>{'报考地区'}</List.Item>
          <List.Item extra={info.registerItemInfo.registerItem.name} key={8}>{'报名科目'}</List.Item>
        </List>
        <Modal
          style={{width: '95%'}}
          closeble
          maskClosable
          transparent
          title={'个人照片'}
          onClose={() => {this.setState({...this.state, visible: false})}}
          visible={this.state.visible}
        >
          <img src={imgUri(this.state.src)} style={{width: '100%'}} alt="照片"/>
        </Modal>
      </div>
    )
  }
}

RegisterInfoList.propTypes = {
  infos: React.PropTypes.array
}

export default RegisterInfoList