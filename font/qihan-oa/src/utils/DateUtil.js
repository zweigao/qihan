/**
 * Created by fangf on 2016/11/15.
 */
class DateUtil{
  /**
   * 时间戳格式化函数
   * @param  {int}    timestamp 要格式化的时间 默认为当前时间
   * @param  {string} format    格式
   * @return {string}           格式化的时间字符串
   */
  static format(timestamp,format){
    let str = format;
    let date = new Date(timestamp);
    let Week = ['日','一','二','三','四','五','六'];
    str=str.replace(/yyyy|YYYY/,date.getFullYear());
    str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100));
    str=str.replace(/MM/,date.getMonth()+1>9?(date.getMonth()+1).toString():'0' + (date.getMonth()+1));
    str=str.replace(/M/g,date.getMonth()+1);
    str=str.replace(/w|W/g,Week[date.getDay()]);
    str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate());
    str=str.replace(/d|D/g,date.getDate());
    str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours());
    str=str.replace(/h|H/g,date.getHours());
    str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes());
    str=str.replace(/m/g,date.getMinutes());
    str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds());
    str=str.replace(/s|S/g,date.getSeconds());
    return str;
  }
}

export default DateUtil;
