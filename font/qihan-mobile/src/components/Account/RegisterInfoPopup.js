import React from 'react';
import { List, InputItem, WhiteSpace, WingBlank, Popup, Button, Icon, Modal } from 'antd-mobile';
import styles from './Account.less'
import InfoList from './RegisterInfoList'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  // Note: the popup content will not scroll.
  wrapProps = {
    // onTouchStart: e => e.preventDefault(),
  };
}

class RegisterInfoPopup extends React.Component {

  constructor (...props) {
    super(...props)
    this.state = {visible: false, src: ''}
    this.renderPopup = this.renderPopup.bind(this)
  }

  componentDidMount() {
    this.renderPopup(this.props.examRegistorInfo, 0)
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props.curInfoIndex, nextProps.curInfoIndex)
    if (this.props.curInfoIndex != nextProps.curInfoIndex && nextProps.curInfoIndex > 0) {
      Popup.hide()
      if (nextProps.curInfoIndex < this.props.examRegistorInfo.length) {
        this.renderPopup(nextProps.examRegistorInfo, nextProps.curInfoIndex)
      }
    }
  }

  renderPopup (infos, index) {
    infos = infos.filter((i) => !i.hasConfirmed)
    if (infos.length > 0 && this.props.curInfoIndex < infos.length) {
      Popup.show(
        <div className={styles['popup']}>
          <InfoList infos={infos} index={index}></InfoList>
          <WhiteSpace />
          <WingBlank><Button type="primary" onClick={() => this.props.confirmInfo(infos[index].id)}>已确定报名信息</Button></WingBlank>
            <p className={styles.wrong}>信息有错误？请联系客服 <a href="tel:020-22094282">020-22094282</a></p>
        </div>
      , { animationType: 'slide-up', maskClosable: false, prefixCls: 'info', wrapProps })
    }
  }

  render () {
    // const { getFieldProps, getFieldError } = this.props.form
    return (
      <div>
      </div>
    )
  }
}

RegisterInfoPopup.propTypes = {
  examRegistorInfo: React.PropTypes.array
}

export default RegisterInfoPopup