import React from 'react';
import { Icon, List, Modal, WhiteSpace, WingBlank, Button } from 'antd-mobile';
import moment from 'moment'
import imgUri from '../../utils/imgUri'

const Item = List.Item

class InfoList extends React.Component {

  constructor (...props) {
    super(...props)
    this.state = {
      modalVisible: false,
      title: '',
      src: ''
    }
  }

  onOpen (title, src) {
    if (src) {
      this.setState({title, src, modalVisible: true,})
    }
  }

  onClose () {
    this.setState({...this.state, modalVisible: false})
  }

  render () {
    const info = this.props.info
    return (
      <div>
        <List>
          <Item extra={info.name} key={1}>{'姓名'}</Item>
          <Item extra={info.sex === 'FEMALE' ? '女' : '男'} key={2}>{'性别'}</Item>
          <Item extra={info.nation} key={14}>{'民族'}</Item>
          <Item extra={info.mobile} key={3}>{'手机'}</Item>
          <Item className={"extra-multiple-line"} extra={info.identityCardCode} wrap key={4}>{'身份证'}</Item>
          <Item extra={!info.identityCardImg && '(未填)'} wrap key={6} arrow="horizontal" onClick={() => {this.onOpen.bind(this)('身份证正面', info.identityCardImg)}}>{'身份证正面'}</Item>
          <Item extra={!info.identityCardImg && '(未填)'} wrap key={13} arrow="horizontal" onClick={() => {this.onOpen.bind(this)('身份证背面', info.identityCardBackImg)}}>{'身份证背面'}</Item>
          <Item extra={!info.studentCardImg && '(未填)'} key={5} arrow="horizontal" onClick={() => {this.onOpen.bind(this)('学生证照片', info.studentCardImg)}}>{'学生证照片'}</Item>
          <Item extra={info.nativePlace} key={12}>{'籍贯'}</Item>
          <Item className={"extra-multiple-line"} extra={info.address || '(未填)'} wrap key={8} multipleLine>{'地址'}</Item>
          <Item extra={info.profession || '(未填)'} wrap key={9}>{'专业'}</Item>
          <Item extra={info.qqCode} wrap key={10}>{'qq号码'}</Item>
          <Item extra={info.schoolName} wrap key={11}>{'学校名称'}</Item>
          <Modal
            style={{width: '95%'}}
            closeble
            maskClosable
            transparent
            title={this.state.title}
            onClose={this.onClose.bind(this)}
            visible={this.state.modalVisible}
          >
            {this.state.modalVisible? <img src={imgUri(this.state.src)} style={{width: '100%'}} alt="照片"/> : null}
          </Modal>
        </List>
        <WhiteSpace size="lg"/>
        <WingBlank><Button type="primary" size="large" onClick={this.props.logout}>退出登录</Button></WingBlank>
        <WhiteSpace size="lg"/>
      </div>
    )
  }
}

InfoList.propTypes = {
  info: React.PropTypes.object
}

export default InfoList