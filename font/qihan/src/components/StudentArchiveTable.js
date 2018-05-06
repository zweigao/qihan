import React, {Component} from 'react';
import styles from './StudentArchiveTable.less';
import moment from 'moment';
import imgUri from '../utils/imgUri';

export default class StudentArchiveTable extends Component {

  render() {
    let {data} = this.props;
    let stu = data.student;
    return (
      <table className={styles['student-archive-table']}>
        <tbody>
        <tr>
          <td className={styles['td-grey']} width="100px">姓名</td>
          <td>{stu.name}</td>
          <td className={styles['td-grey']}>性别</td>
          <td>{stu.sex=='MALE'?'男':'女'}</td>
          <td className={styles['td-grey']}>手机号</td>
          <td>{stu.mobile}</td>
          <td rowSpan="5" width="20%"><img src={imgUri(data.userStanderImg)} alt="头像" width="100%"/></td>
        </tr>
        <tr>
          <td className={styles['td-grey']}>学校</td>
          <td colSpan="3">{stu.schoolName}</td>
          <td className={styles['td-grey']}>专业</td>
          <td>{stu.profession}</td>
        </tr>
        <tr>
          <td className={styles['td-grey']}>居住地</td>
          <td>{stu.address}</td>
          <td className={styles['td-grey']}>民族</td>
          <td>{stu.nation}</td>
          <td className={styles['td-grey']}>籍贯</td>
          <td>{stu.nativePlace}</td>
        </tr>
        <tr>
          <td className={styles['td-grey']}>身份证号</td>
          <td colSpan="3">{stu.identityCardCode}</td>
          <td className={styles['td-grey']}>报考城市</td>
          <td>{data.examArea}</td>
        </tr>
        <tr>
          <td className={styles['td-grey']}>报考科目</td>
          <td colSpan="3">{data.registerItemInfo.registerItem.name}({data.registerItemInfo.displayContent})</td>
          <td className={styles['td-grey']}>报名时间</td>
          <td>{moment(data.registerTimestamp).format('YYYY/MM/DD')}</td>
        </tr>
        <tr>
          <td className={styles['td-grey']}>身份证</td>
          <td colSpan="7">
            <img src={imgUri(stu.identityCardImg)} alt="身份证正面" width="80%"/>
            <img src={imgUri(stu.identityCardBackImg)} alt="身份证反面" width="80%"/>
          </td>
        </tr>
        <tr style={{display:stu.studentCardImg?'':'none'}}>
          <td className={styles['td-grey']}>学生证</td>
          <td colSpan="7"><img src={imgUri(stu.studentCardImg)} alt="学生证" width="80%"/></td>
        </tr>
        </tbody>
        <tfoot>
        <tr style={{textAlign:'center'}}><td colSpan="8">信息有错误？请联系客服电话 <a>020-22094282</a></td></tr>
        </tfoot>
      </table>
    );
  }

}
