import React, {Component} from 'react';
import {Input,Icon,Select,Popconfirm,Upload,message,Modal,Button,Popover} from 'antd';
import styles from './StudentArchiveTable.less';
import DateUtil from '../utils/DateUtil';
import axios from 'axios'
import imgUri from '../utils/imgUri';

const Option = Select.Option;

let colleges = require('../asset/guangdong.json');

export default class StudentArchiveTable extends Component {

  constructor(props){
    super(props);
    this.state = {
      rotate:0,
      field: ''
    };
    this.host = axios.defaults.baseURL;
  }

  setEdit = (field,previewVisible,previewVisible2) => {
    this.setState({field,previewVisible,previewVisible2},function () {
      let input = document.getElementById(field);
      if (input) input.focus();
    });
  };

  saveEdit = (field,field2) => {
    let input = document.getElementById(field);
    let value = input?input.value:field;
    this.setState({field:''});
    if (field2) field = field2;
    this.props.onChange({[field]:value});
  };

  handlePreviewCancel = () => {
    this.setState({previewVisible:false,previewVisible2:false,rotate:0})
  };

  render() {
    let {data,onChange} = this.props;
    let {field,previewVisible,rotate,previewVisible2} = this.state;
    let stu = data.student;
    let editable = !!onChange;
    let fields = {
      field,
      setEdit:this.setEdit,
      saveEdit:this.saveEdit,
      editable
    };
    const uploadProps = {
      name: 'uploadFile',
      showUploadList: false,
      action: this.host+'FileManager/fileUpload.action',
      accept: 'image/jpg,image/jpeg,image/png',
      headers: {
        Authorization: sessionStorage.tokenID
      },
      onChange: (info) => {
        if (info.file.status !== 'uploading') {
          onChange({[field]:info.file.response.data});
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败`);
        }
      }
    };
    return (
      <table className={styles['student-archive-table']}>
        <tbody>
        <tr>
          <td className={styles['td-grey']} width="100px">姓名</td>
          <EditableInputTd id="name" value={stu.name} {...fields}/>
          <td className={styles['td-grey']}>性别</td>
          <td>{stu.sex=='MALE'?'男':'女'}</td>
          <td className={styles['td-grey']}>手机号</td>
          <EditableInputTd id="mobile" value={stu.mobile} {...fields}/>
          <td className={styles['avatar']} rowSpan="5" width="20%">
            {sessionStorage.tokenType!='MANAGER'||data.userStanderImg?
              <img src={imgUri(data.userStanderImg)} onClick={()=>{this.setEdit('userStanderImg',true)}} alt="头像" width="100%"/>
              :
              <Upload
                {...uploadProps}
                data={{fileType:'STANDERIMG'}}
                listType="picture-card"
              >
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text" onClick={()=>{this.setEdit('userStanderImg')}}>上传头像</div>
                </div>
              </Upload>
            }
          </td>
        </tr>
        <tr>
          <td className={styles['td-grey']}>学校</td>
          <EditableInputTd id="schoolName" value={stu.schoolName} {...fields} editor={
          <Select
            showSearch
            onBlur={(v)=>this.saveEdit(v,'schoolName')}
            style={{ width: 150 }}
            placeholder="选择学校"
            optionFilterProp="children"
            defaultValue={stu.schoolName}
            onChange={(v)=>this.saveEdit(v,'schoolName')}>
            {colleges.map(v=>(
              <Option key={v} value={v}>{v}</Option>
            ))}
          </Select>
          }/>
          <td className={styles['td-grey']}>专业</td>
          <EditableInputTd colSpan="3" id="profession" value={stu.profession} {...fields}/>
        </tr>
        <tr>
          <td className={styles['td-grey']}>联系地址</td>
          <EditableInputTd id="address" value={stu.address} {...fields}/>
          <td className={styles['td-grey']}>民族</td>
          <EditableInputTd id="nation" value={stu.nation} {...fields}/>
          <td className={styles['td-grey']}>籍贯</td>
          <EditableInputTd id="nativePlace" value={stu.nativePlace} {...fields}/>
        </tr>
        <tr>
          <td className={styles['td-grey']}>身份证号</td>
          <EditableInputTd colSpan="3" id="identityCardCode" value={stu.identityCardCode} {...fields}/>
          <td className={styles['td-grey']}>报考城市</td>
          <td>{data.examArea}</td>
        </tr>
        {data.registerItemInfo?
          <tr>
            <td className={styles['td-grey']}>报考科目</td>
            <td colSpan="3">{data.registerItemInfo.registerItem.name}({data.registerItemInfo.displayContent})</td>
            <td className={styles['td-grey']}>报名时间</td>
            <td>{DateUtil.format(data.registerTimestamp||0,'YYYY/M/D')}</td>
          </tr>
          :<tr/>
        }
        <tr>
          <td className={styles['td-grey']}>准考证号</td>
          <td colSpan="6">{data.examinationAllowCode}
            <Popover trigger="click"
                     content={<form onSubmit={(event) => {event.preventDefault();this.saveEdit('examinationAllowCode')}}><Input id="examinationAllowCode"/></form>}>
              <Icon type="edit" style={{color:'cadetblue'}}/>
            </Popover>
          </td>
        </tr>
        <tr>
          <td className={styles['td-grey']}>身份证</td>
          <td colSpan="7">
            <img src={imgUri(stu.identityCardImg)} onClick={()=>{this.setEdit('identityCardImg',false,true)}} alt="身份证正面" width="80%"/><br/>
            <img src={imgUri(stu.identityCardBackImg)} onClick={()=>{this.setEdit('identityCardBackImg',false,true)}} alt="身份证反面" width="80%"/>
          </td>
        </tr>
        <tr style={{display:stu.studentCardImg?'':'none'}}>
          <td className={styles['td-grey']}>学生证</td>
          <td colSpan="7"><img src={imgUri(stu.studentCardImg)} onClick={()=>{this.setEdit('studentCardImg',false,true)}} alt="学生证" width="80%"/></td>
        </tr>
        </tbody>
        <Modal visible={previewVisible} footer={null} onCancel={this.handlePreviewCancel} >
          <img alt="example" style={{ width: '100%', transform: 'rotate('+rotate+'deg)'}} src={imgUri(data[field])} />
          {sessionStorage.tokenType=='MANAGER'?<Upload {...uploadProps} data={{fileType:'STANDERIMG'}}><Button icon="edit" type="primary">修改图片</Button></Upload>:null}
          　<Button icon="reload" onClick={()=>this.setState({rotate:rotate+90})}>旋转图片</Button>
        </Modal>
        <Modal visible={previewVisible2} footer={null} onCancel={this.handlePreviewCancel} >
          <img alt="example" style={{ width: '100%', position: 'relative', transform: 'rotate('+rotate+'deg)'}} src={imgUri(stu[field])} />
          <Button icon="reload" onClick={()=>this.setState({rotate:rotate+90})}>旋转图片</Button>
        </Modal>
      </table>
    );
  }

}

class EditableInputTd extends Component {

  render(){
    let {id,field,value,colSpan,setEdit,saveEdit,editable} = this.props;
    if (!editable){
      return <td colSpan={colSpan}>{value}</td>
    }
    let editor = this.props.editor?this.props.editor:<Input id={field} defaultValue={value} style={{width:100}} onBlur={()=>saveEdit(field)} onPressEnter={()=>saveEdit(field)}/>;
    return <td colSpan={colSpan}>{value}</td>
  }

}
