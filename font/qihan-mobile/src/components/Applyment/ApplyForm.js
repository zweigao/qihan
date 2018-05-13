import React from 'react';
import { List, InputItem, Button, WhiteSpace, WingBlank, Popup, NavBar, Picker, ImagePicker, Toast, Modal, Result, Tag, Icon } from 'antd-mobile';
import { createForm } from 'rc-form';
import MenuList from './MenuList'
import SchoolList from './SchoolList'
import styles from './ApplyForm.less'
import {connect} from 'dva';
import imgUri from '../../utils/imgUri'

const Item = List.Item
const Brief = Item.Brief
const schools = require('../../assets/guangdong.json')
const citys = require('../../assets/citys.json')
const { alert, prompt } = Modal;

const imagesEnum = {
  STANDERIMG: 'standarImgFiles',
  IDCARD: 'idCardImgFiles',
  IDCARDBACK: 'idCardImgBackFiles',
  STUDENTCARD: 'studentImgFiles'
}

class ApplyForm extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      registerItem: {},
      standarImgFiles: [],
      idCardImgFiles: [],
      idCardImgBackFiles: [],
      studentImgFiles: [],
      getCodeTimer: 0,
      displayPickerVisible: false,
      icDialogVisible: false
    }

    this.showMenus = this.showMenus.bind(this)
    this.showSchool = this.showSchool.bind(this)
    this.onCardCodeChange = this.onCardCodeChange.bind(this)
    this.onImageChange = this.onImageChange.bind(this)
    this.submit = this.submit.bind(this)
    this.getPhoneCodeValidator = this.getPhoneCodeValidator.bind(this)
    this.onDisplayItemClick = this.onDisplayItemClick.bind(this)
  }

  componentDidMount () {
    const query = this.props.location.query
    if (query.type === 'modify') {
      this.showICDialog()
    }
  }
  
  showICDialog () {
    const callback = (code) => {
      if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)) {
        this.props.getApplymentInfo(this.props.location.query.registerid, code)
      } else {
        Toast.info('身份证格式有误')
        this.showICDialog()
      }
    }
    prompt(
      '修改报名信息',
      '请输入身份证确认身份',
      [
        { text: '取消', onPress: () => this.showICDialog() },
        { text: '提交', onPress: callback },
      ],
      'plain-text'
    )
  }

  componentWillReceiveProps (nextProps) {
    const { applyment } = nextProps
    if (applyment.idCardInfo !== this.props.applyment.idCardInfo) {
      this.props.form.setFieldsValue({
        gender: [applyment.idCardInfo.gender],
        nativePlace: applyment.idCardInfo.nativePlace
      })
    }
    if (applyment.images !== this.props.applyment.images) {
      console.log(applyment.images)
      this.props.form.setFieldsValue({
        ...applyment.images
      })
    }
    const applymentInfo = applyment.applymentInfo
    if (applymentInfo !== this.props.applyment.applymentInfo) {
      this.setState({
        standarImgFiles: applymentInfo.standerImg? [{url: imgUri(applymentInfo.standerImg), id: '0001'}] : [],
        idCardImgFiles: applymentInfo.studentInfo.identityCardImg? [{url: imgUri(applymentInfo.studentInfo.identityCardImg), id: '0002'}] : [],
        idCardImgBackFiles: applymentInfo.studentInfo.identityCardBackImg? [{url: imgUri(applymentInfo.studentInfo.identityCardBackImg), id: '0003'}] : [],
        studentImgFiles: applymentInfo.studentInfo.studentCardImg? [{url: imgUri(applymentInfo.studentInfo.studentCardImg), id: '0004'}] : []
      })
      this.props.form.setFieldsValue({
        registerItem: applymentInfo.registerItem,
        displayItem: [applymentInfo.registerActivityTimer.id],
        examArea: applymentInfo.examArea && applymentInfo.examArea.split(' '),
        address: applymentInfo.studentInfo.address,
        identityCardCode: applymentInfo.studentInfo.identityCardCode,
        idCardImg: applymentInfo.studentInfo.identityCardImg,
        idCardBackImg: applymentInfo.studentInfo.identityCardBackImg,
        studentCardImg: applymentInfo.studentInfo.studentCardImg,
        mobile: applymentInfo.studentInfo.mobile,
        name: applymentInfo.studentInfo.name,
        nativePlace: applymentInfo.studentInfo.nativePlace,
        profession: applymentInfo.studentInfo.profession,
        qqCode: applymentInfo.studentInfo.qqCode,
        schoolName: applymentInfo.studentInfo.schoolName,
        gender: [applymentInfo.studentInfo.sex],
        nation: applymentInfo.studentInfo.nation
      })
    }
  }

  submit () {
    this.props.form.validateFields((error, value) => {
      console.log(value)
      if (!error) {
        let studentInfo = {
          address: value.address,
          identityCardCode: value.identityCardCode,
          identityCardImg: value.idCardImg,
          identityCardBackImg: value.idCardBackImg,
          studentCardImg: value.studentCardImg,
          mobile: value.mobile && value.mobile.replace(/\s+/g, ''),
          name: value.name,
          nativePlace: value.nativePlace,
          profession: value.profession,
          qqCode: value.qqCode,
          schoolName: value.schoolName,
          sex: value.gender[0],
          nation: value.nation
        }
        const { applymentInfo } = this.props.applyment
        if (applymentInfo && applymentInfo.registerItem) {
          studentInfo.id = applymentInfo.studentInfo.id
          this.props.updateRegisterInfo({
            registerInfo: {
              student: studentInfo,
              examArea: value.examArea && value.examArea.join(' '),
              id: this.props.location.query.registerid,
              registerItemInfo: { id: this.props.applyment.applymentInfo.registerActivityTimer.id },
              userStanderImg: value.standarImg
            },
            validata: value.smsValidator
          })
        } else {
          this.props.register({
            studentInfo,
            registerTimingItemId: value.displayItem[0],
            standerImg: value.standarImg,
            examArea: value.examArea && value.examArea.join(' '),
            validata: value.smsValidator,
            saleManId: this.props.location.query.staff
          })
        }
      } else {
        Toast.info(error[Object.keys(error)[0]].errors[0].message)
        console.log(error[Object.keys(error)[0]])
      }
    })
  }

  showPopup (component) {
    Popup.show(
      <div className={styles.popup}>
        {component}
      </div>, { animationType: 'slide-up', maskClosable: false, prefixCls: 'menu' })
  }

  showForbAlert () {
    alert('该项目不能修改，请重新报名', '确定重新报名吗', [
      { text: '取消'},
      { text: '确定', onPress: () => location.href = `${location.origin}${location.pathname}?staff=${this.props.location.query.staff}` }
    ])
  }

  showMenus () {
    const that = this
    const { applymentInfo } = this.props.applyment
    console.log(that.props.applyment.menuData)
    if (applymentInfo && applymentInfo.registerItem) {
      this.showForbAlert()
      return
    }
    if (that.props.applyment.menuData.length > 0) {
      const props = {
        menuData: this.props.applyment.menuData,
        onCourseClick (course) {
          Popup.hide()
          that.props.form.setFieldsValue({ registerItem: course })
          that.props.getDisplayItems(course.id)
        },
        hiddenPopup () {
          Popup.hide()
        }
      }
      this.showPopup(
        <MenuList {...props}></MenuList>
      )
    }
  }

  showSchool () {
    const that = this
    const props = {
      schools,
      hiddenPopup () {
        Popup.hide()
      },
      onSchoolClick (s) {
        that.props.form.setFieldsValue({schoolName: s})
        Popup.hide()
      }
    }
    this.showPopup(
      <SchoolList {...props}></SchoolList>
    )
  }

  onCardCodeChange (value) {
    const { form } = this.props
    form.setFieldsValue({ identityCardCode: value })
    form.validateFields(['identityCardCode'], (err, value) => {
      if (!err) {
        this.props.getIdCardInfo(value.identityCardCode)
      }
    })
  }

  onImageChange (files, type, index, imgType) {
    const { uploadImgLoading } = this.props.applyment
    console.log(files, type)
    if (type === 'add') {
      if (uploadImgLoading) {
        Toast.info('请等待其他图片上传完毕')
        return
      } else {
        this.props.uploadImage(imgType, files[0].file)
      }
    } else if (type === 'remove') {
      this.props.uploadImage(imgType, null)
    }
    this.setState({
      ...this.state,
      [imagesEnum[imgType]]: files
    })
  }

  checkPhone (rule, value, callback) {
    const form = this.props.form
    if (value && !(/0?(13|14|15|16|17|18|19)[0-9]{9}/.test(value.replace(/\s+/g, '')))) {
      callback('手机号码格式有误')
    } else {
      callback()
    }
  }

  checkIdCard (rule, value, callback) {
    const form = this.props.form
    if (value && !(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))) {
      callback('身份证号码格式有误')
    } else {
      callback()
    }
  }

  getPhoneCodeValidator () {
    if (this.state.getCodeTimer > 0) {
      return
    }
    const { form } = this.props
    form.validateFields(['mobile'], (errors, values) => {
      if (!errors) {
        const { applymentInfo } = this.props.applyment
        if (applymentInfo && applymentInfo.registerItem) {
          this.props.getPhoneCodeValidatorForModify(values.mobile.replace(/\s+/g, ''))
        } else {
          this.props.getPhoneCodeValidator(values.mobile.replace(/\s+/g, ''))
        }
        this.setState({
          ...this.state,
          getCodeTimer: 300
        })
        const timer = setInterval(() => {
          const getCodeTimer = this.state.getCodeTimer
          if (getCodeTimer > 0) {
            this.setState({
              ...this.state,
              getCodeTimer: getCodeTimer - 1
            })
          } else {
            clearInterval(timer)
          }
        }, 1000)
      }
    })
  }

  onDisplayItemClick (show) {
    const { applymentInfo } = this.props.applyment
    if (applymentInfo && applymentInfo.registerItem) {
      this.showForbAlert()
      return
    }
    this.setState({
      ...this.state,
      displayPickerVisible: show
    })
  }


  render () {
    const { getFieldProps, getFieldError, getFieldValue } = this.props.form
    const { meterialNeed, finished, applymentInfo } = this.props.applyment
    
    return (
      <div>
      {applymentInfo && applymentInfo.unPassReason ?
        <WingBlank>
          <WhiteSpace></WhiteSpace>
          <Tag closable><Icon style={{color: '#ff3b30'}} type="exclamation-circle" /> {'驳回理由：' + applymentInfo.unPassReason}</Tag>
        </WingBlank> : null
      }
      <List renderHeader={() => '报名资料'}>
        <Item extra={getFieldValue('registerItem') && getFieldValue('registerItem').name || '点击选择报考科目'} wrap key={'menu'} arrow="horizontal" onClick={this.showMenus}>{'报考科目'}</Item>
        <Picker data={this.props.applyment.registerDisplayItems} cols={1} visible={this.state.displayPickerVisible} onDismiss={() => this.onDisplayItemClick(false)} {...getFieldProps('displayItem', {
          rules: [{ required: true, type: 'array', message: '考试项目不能为空' }],
          onChange: () => this.onDisplayItemClick(false)
        })}>
          <Item arrow="horizontal" className={styles.require} onClick={() => this.onDisplayItemClick(true)}>考试项目</Item>
        </Picker>
        {meterialNeed.id !== undefined ?
          <Picker data={citys} cols={2} {...getFieldProps('examArea', {
            rules: [meterialNeed.examAreaNeedFlag ? { required: true, type: 'array', message: '报考城市不能为空' } : { type: 'array' }]
          })} format={(values) => values.join('')}>
            <Item arrow="horizontal" className={meterialNeed.examAreaNeedFlag ? styles.require : ''}>报考城市</Item>
          </Picker> : null
        }
        {meterialNeed.standerImgNeedFlag ?
          <Item
            extra={
              <ImagePicker
                className={styles['file-picker']}
                files={this.state.standarImgFiles}
                onChange={(files, type, index) => this.onImageChange(files, type, index, 'STANDERIMG')}
                onImageClick={(index, fs) => console.log(index, fs)}
                selectable={this.state.standarImgFiles.length < 1}
              />}
            {...getFieldProps('standarImg', {
              rules: [{ required: true, message: '标准照片不能为空' }]
            })}
            className={styles.require}
            multipleLine
            key={'standarImg'}>{'标准照片'}
          </Item> : null
        }
      </List>
      <WhiteSpace/>
      { meterialNeed.id !== undefined ?
      <List renderHeader={() => '个人资料'}>
        <InputItem
          {...getFieldProps('name', {
            rules: [{ required: true, message: '姓名不能为空' }]
          })}
          className={styles.require}
          placeholder="姓名"
          clear={true}
          error={getFieldError('name')}>
          姓名
        </InputItem>
        <InputItem
          {...getFieldProps('mobile', {
            rules: [{ required: true, message: '手机号码不能为空' }, { validator: this.checkPhone.bind(this) }],
            validateTrigger: 'onBlur'
          })}
          type="phone"
          className={styles.require}
          placeholder="手机号码"
          clear={true}
          error={getFieldError('mobile')}>
          手机号码
        </InputItem>
        <InputItem
          {...getFieldProps('smsValidator', {
            rules: [{ required: true, message: '手机验证码不能为空' }]
          })}
          className={`${styles.require} ${styles['validate-input']}`}
          placeholder="手机验证码"
          extra={
            <span onClick={this.getPhoneCodeValidator} className={this.state.getCodeTimer > 0 ? styles.disabled: ''}>
            {this.state.getCodeTimer && `${this.state.getCodeTimer}s 后重新获取` || '获取验证码'}
            </span>
          }
          clear={true}
          error={getFieldError('smsValidator')}>
          验证码
        </InputItem>
        <InputItem
          {...getFieldProps('identityCardCode', {
            rules: [{ required: true, message: '身份证号码不能为空' }, { validator: this.checkIdCard.bind(this) }],
            validateTrigger: 'onBlur'
          })}
          placeholder="身份证号码"
          className={styles.require}
          clear={true}
          onChange={this.onCardCodeChange}
          error={getFieldError('identityCardCode')}>
          身份证号
        </InputItem>
        <Picker data={[{value: 'MALE', label: '男'}, {value: 'FEMALE', label: '女'}]} cols={1} {...getFieldProps('gender', {
          initialValue: ['FEMALE']
        })}>
          <Item arrow="horizontal" className={styles.require}>性别</Item>
        </Picker>
        <Item 
          extra={this.props.form.getFieldValue('schoolName') || '点击选择学校'}
          wrap
          key="schoolName"
          {...getFieldProps('schoolName', {
            rules: [meterialNeed.oriSchoolNameNeedFlag ? { required: true, message: '学校不能为空' } : {}]
          })}
          className={meterialNeed.oriSchoolNameNeedFlag ? styles.require : ''}
          arrow="horizontal"
          onClick={this.showSchool}>
            学校
        </Item>
        <InputItem
          {...getFieldProps('nativePlace', {
            rules: [meterialNeed.nativePlaceNeedFlag ? { required: true, message: '籍贯不能为空' } : {}]
          })}
          className={meterialNeed.nativePlaceNeedFlag ? styles.require : ''}
          placeholder="籍贯"
          clear={true}>
          籍贯
        </InputItem>
        <InputItem
          {...getFieldProps('nation', {
            rules: [{ required: true, message: '民族不能为空' }]
          })}
          className={styles.require}
          placeholder="民族"
          clear={true}
          error={getFieldError('nation')}>
          民族
        </InputItem>
        <InputItem
          {...getFieldProps('profession', {
            rules: [meterialNeed.professionalNeedFlag ? { required: true, message: '专业不能为空' } : {}]
          })}
          className={meterialNeed.professionalNeedFlag ? styles.require : ''}
          placeholder="专业"
          clear={true}>
          专业
        </InputItem>
        <InputItem
          {...getFieldProps('qqCode', {
            rules: [meterialNeed.qqNeedFlag ? { required: true, message: 'qq号码不能为空' } : {}]
          })}
          className={meterialNeed.qqNeedFlag ? styles.require : ''}
          type="number"
          placeholder="qq号码"
          clear={true}>
          qq号码
        </InputItem>
        <InputItem
          {...getFieldProps('address', {
            rules: [meterialNeed.addressNeedFlag ? { required: true, message: '邮寄地址不能为空' } : {}]
          })}
          className={meterialNeed.addressNeedFlag ? styles.require : ''}
          placeholder="邮寄地址"
          clear={true}>
          邮寄地址
        </InputItem>
        {meterialNeed.idCardImgNeedFlag ?
          <Item
            className={`${styles.require} ${styles['id-card-item']}`}
            extra={
              <ImagePicker
                className={styles['file-picker']}
                files={this.state.idCardImgFiles}
                onChange={(files, type, index) => this.onImageChange(files, type, index, 'IDCARD')}
                onImageClick={(index, fs) => console.log(index, fs)}
                selectable={this.state.idCardImgFiles.length < 1}
              />}
            {...getFieldProps('idCardImg', {
              rules: [{ required: true, message: '身份证照片正面不能为空' }]
            })}
            multipleLine
            key={'idCardImg'}>身份证照片<Brief>正面</Brief>
          </Item> : null
        }
        {meterialNeed.idCardImgNeedFlag ?
          <Item
            className={`${styles.require} ${styles['id-card-item']}`}
            extra={
              <ImagePicker
                className={styles['file-picker']}
                files={this.state.idCardImgBackFiles}
                onChange={(files, type, index) => this.onImageChange(files, type, index, 'IDCARDBACK')}
                onImageClick={(index, fs) => console.log(index, fs)}
                selectable={this.state.idCardImgBackFiles.length < 1}
              />}
            multipleLine
            {...getFieldProps('idCardBackImg', {
              rules: [{ required: true, message: '身份证照片反面不能为空' }]
            })}
            key={'idCardBackImg'}>身份证照片<Brief>反面</Brief>
          </Item> : null
        }
        {meterialNeed.studentCardImgNeedFlag ?
          <Item
            className={`${styles.require} ${styles['id-card-item']}`}
            extra={
              <ImagePicker
                className={styles['file-picker']}
                files={this.state.studentImgFiles}
                onChange={(files, type, index) => this.onImageChange(files, type, index, 'STUDENTCARD')}
                onImageClick={(index, fs) => console.log(index, fs)}
                selectable={this.state.studentImgFiles.length < 1}
              />}
            multipleLine
            {...getFieldProps('studentCardImg', {
              rules: [{ required: true, message: '学生证照片不能为空' }]
            })}
            key={'student'}>学生证照片
          </Item> : null
        }
      </List> : null
      }
      <WhiteSpace size="lg"/>
      <WingBlank><Button type="primary" size="large" onClick={this.submit}>报名</Button></WingBlank>
      <WhiteSpace size="lg"/>
      <Modal
        title=""
        transparent
        maskClosable={false}
        closable={false}
        visible={finished}
        onClose={() => {}}
        footer={[{ text: '确定', onPress: () => { location.reload() } }]}
      >
        <Result
          className={styles.result}
          imgUrl={require('../../assets/pass.png')}
          title={applymentInfo && applymentInfo.registerItem? '修改报名信息成功' : '报名成功'}
          message="等待工作人员审核"
        />
      </Modal>

      </div>
    )
  }
}

ApplyForm.propTypes = {

}
export default createForm()(ApplyForm)