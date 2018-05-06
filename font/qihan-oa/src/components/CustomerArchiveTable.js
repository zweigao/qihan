import React, {Component} from 'react';
import styles from './StudentArchiveTable.less';
import imgUri from '../utils/imgUri';

export default class CustomerArchiveTable extends Component {

  render() {
    let stu = this.props.data;
    return (
      <table className={styles['student-archive-table']}>
        <tbody>
        <tr>
          <td className={styles['td-grey']} width="100px">姓名</td>
          <td>{stu.name}</td>
          <td className={styles['td-grey']}>性别</td>
          <td>{stu.sex=='MALE'?'男':'女'}</td>
          <td className={styles['td-grey']}>QQ</td>
          <td>{stu.qqCode}</td>
          <td className={styles['td-grey']}>手机号</td>
          <td>{stu.mobile}</td>
        </tr>
        <tr>
          <td className={styles['td-grey']}>学校</td>
          <td colSpan="5">{stu.schoolName}</td>
          <td className={styles['td-grey']}>专业</td>
          <td>{stu.profession}</td>
        </tr>
        <tr>
          <td className={styles['td-grey']}>联系地址</td>
          <td colSpan="3">{stu.address}</td>
          <td className={styles['td-grey']}>民族</td>
          <td>{stu.nation}</td>
          <td className={styles['td-grey']}>籍贯</td>
          <td>{stu.nativePlace}</td>
        </tr>
        <tr>
          <td className={styles['td-grey']}>身份证号</td>
          <td colSpan="7">{stu.identityCardCode}</td>
        </tr>
        <tr>
          <td className={styles['td-grey']}>身份证</td>
          <td colSpan="7">
            <img src={imgUri(stu.identityCardImg)} alt="身份证正面" width="80%"/><br/>
            <img src={imgUri(stu.identityCardBackImg)} alt="身份证反面" width="80%"/>
          </td>
        </tr>
        <tr style={{display:stu.studentCardImg?'':'none'}}>
          <td className={styles['td-grey']}>学生证</td>
          <td colSpan="7"><img src={imgUri(stu.studentCardImg)} alt="学生证" width="80%"/></td>
        </tr>
        </tbody>
      </table>
    );
  }

}
