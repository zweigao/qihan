import React, {Component} from 'react';
import {Input,Icon,Select,Popconfirm,Upload,message,Modal,Button} from 'antd';
import styles from './StudentArchiveTable.less';
import DateUtil from '../utils/DateUtil';
import axios from 'axios';
import imgUri from '../utils/imgUri';
const Option = Select.Option;

let colleges = require('../asset/guangdong.json');

export default class StudentArchiveTable extends Component {

  constructor(props){
    super(props);
    this.state = {
      rotate: 0,
      field: '',
      type: ''
    };
    this.host = axios.defaults.baseURL;
  }

  setEdit = (field,type,previewVisible) => {
    this.setState({field,type,previewVisible},function () {
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
    this.setState({previewVisible:false})
  };

  render() {
    let {data,onChange} = this.props;
    let {field,previewVisible,rotate,type} = this.state;
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
      onChange(info) {
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
          <td>{stu.sex=='MALE'?'男':'女'}{editable?<Popconfirm title="确认修改性别？" onConfirm={()=>this.saveEdit(stu.sex=='MALE'?'FEMALE':'MALE','sex')}><Icon type="edit" style={{color:'cadetblue'}}/></Popconfirm>:''}</td>
          <td className={styles['td-grey']}>手机号</td>
          <EditableInputTd id="mobile" value={stu.mobile} {...fields}/>
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
          <td className={styles['td-grey']}>身份证</td>
          <td colSpan="7">
            <EditableUpload uploadProps={uploadProps} type="IDCARD" text="身份证正面" field="identityCardImg" data={stu} setEdit={this.setEdit}/><br/>
            <EditableUpload uploadProps={uploadProps} type="IDCARDBACK" text="身份证反面" field="identityCardBackImg" data={stu} setEdit={this.setEdit}/>
          </td>
        </tr>
        <tr>
          <td className={styles['td-grey']}>学生证</td>
          <td colSpan="7">
            <EditableUpload uploadProps={uploadProps} type="STUDENTCARD" text="学生证" field="studentCardImg" data={stu} setEdit={this.setEdit}/>
          </td>
        </tr>
        </tbody>
        <Modal visible={previewVisible} footer={null} onCancel={this.handlePreviewCancel} >
          <img id="preview" alt="example" style={{ width: '100%', transform: 'rotate('+rotate+'deg)'}} src={imgUri(stu[field])} />
          <Upload {...uploadProps} data={{fileType:type}}><Button icon="edit" type="primary">修改图片</Button></Upload>
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
    return field == id ?
      <td colSpan={colSpan}>{editor}<Icon type="check" style={{color:'cadetblue'}} onClick={()=>saveEdit(field)}/></td>
      : <td colSpan={colSpan}>{value} <Icon type="edit" style={{color:'cadetblue'}} onClick={()=>setEdit(id)}/></td>
  }

}

class EditableUpload extends Component {
  render(){
    let {uploadProps,setEdit,type,text,data,field} = this.props;
    let upload = data[field]?
        <img src={imgUri(data[field])} onClick={() => setEdit(field,type,true)} alt={text} width="80%"/>
        :
        <Upload
          {...uploadProps}
          data={{fileType:type}}
          listType="picture-card"
        >
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text" onClick={() => setEdit(field)}>{text}</div>
          </div>
        </Upload>;
    return upload;
  }
}
