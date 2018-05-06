import React, {Component} from 'react';
import {connect} from 'dva';
import {Card,Row,Col,Progress,Radio,Input,Icon,Button,Checkbox,Modal,Table,message} from 'antd';
import styles from './PaperQuestions.less';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

let answers = {};

class PaperQuestions extends Component {

  constructor(props) {
    super(props);
    let {menuId,courseId,paperName} = props.params;
    if (menuId) {
      props.dispatch({
        type: 'course/getChapterQuestions',
        menuId
      });
    }
    if (paperName){
      props.dispatch({
        type: 'course/getPaperQuestions',
        courseId,
        paperName
      })
    }
    this.state = {
      current: 0,
      value: -1,
      answerVisible: false,
      reportVisible: false
    }
  }

  onSingle = (e) => {
    let {value} = e.target;
    answers[this.state.current] = value;
    this.setState({value})
  };

  onDescription = () => {
    let answer = document.getElementById('description').value;
    if (answer.length==0) return;
    answers[this.state.current] = answer;
    this.setState({answerVisible:true})
  };

  onMultiple = (values) => {
    answers[this.state.current] = values;
  };

  onMultiple2 = (e) => {
    let {current} = this.state;
    let ans = answers[current]||[];
    let {value} = e.target;
    let index = ans.indexOf(value);
    if (index < 0)
      ans.push(value);
    else ans.splice(index,1);
    answers[current] = ans;
  };

  onMutipleConfirm = () => {
    this.setState({answerVisible:true})
  };

  last = () =>{
    let {current} = this.state;
    if (current == 0){
      message.warn('已经是第一道题了');
      return;
    }
    this.setState({current:current-1,value:-1,answerVisible:false})
  };

  next = () =>{
    let {current} = this.state;
    let {questions} = this.props.course;
    if (current==questions.length-1){
      this.setState({reportVisible:true});
      return;
    }
    this.setState({current:current+1,value:-1,answerVisible:false})
  };

  renderQuestion = (q) => {
    let comp = <span/>;
    q.options = q.optionList||[];
    q.optionsMultiple = q.options.map((v,k)=>({label:v,value:k}));
    let {current} = this.state;
    let options_single = [0,1,2,3];
    let options_multiple = [0,1,2,3,4];
    const radioStyle = {
      fontSize: 'large'
    };
    switch (q.questionType) {
      case 'SINGLE_OPTION': comp =
        <RadioGroup onChange={this.onSingle} size="large" value={answers[current]}>
          {q.options.length!=0?q.options.map((v,k)=>(
            <Radio key={k} style={radioStyle} value={k}>{String.fromCharCode('A'.charCodeAt()+k)}. <span dangerouslySetInnerHTML={{__html:v}}/></Radio>
          )):(
            options_single.map(i=>(
              <Radio key={i} value={i} style={{width:'inherit',fontSize:'1.5em'}}>{String.fromCharCode('A'.charCodeAt()+i)}　</Radio>
            ))
          )}
        </RadioGroup>;
        break;
      case 'MULTIPLE_OPTION': comp =
        <div>
          {q.optionsMultiple.length!=0?<CheckboxGroup options={q.optionsMultiple} defaultValue={answers[current]} onChange={this.onMultiple}/>
            :(
            options_multiple.map(i=>(
              <Checkbox onChange={this.onMultiple2} key={i} value={i} style={{width:'inherit',fontSize:'1.5em'}}>{String.fromCharCode('A'.charCodeAt()+i)}　</Checkbox>
            ))
          )}
          <Button className={styles['confirm-btn']} onClick={this.onMutipleConfirm} style={{float:'inherit'}}>确定</Button>
        </div>;
        break;
      case 'TRUE_OR_FALSE':
        comp =
          <RadioGroup onChange={this.onSingle} size="large" value={answers[current]}>
            <Radio key={true} style={radioStyle} value={true}>正确</Radio>
            <Radio key={false} style={radioStyle} value={false}>错误</Radio>
          </RadioGroup>;
        break;
      case 'FILL_IN':
      case 'DESCRIPTION': comp =
        <div className="clearfix"><Input id="description" type="textarea" autosize={{ minRows: 4, maxRows: 10 }}/>
          <Button className={styles['confirm-btn']} onClick={this.onDescription}>确定</Button></div>;
        break;
    }
    return comp;
  };

  componentDidUpdate(){
    document.getElementById('description').value = answers[this.state.current]||''
  }

  renderAnswer(){
    let value = answers[this.state.current];
    if (value===true)
      return '正确';
    if (value===false)
      return '错误';
    if (typeof value === 'object'){
      return value.length==0?'':value.map(v=>(String.fromCharCode('A'.charCodeAt()+v))).sort().join(',');
    }
    if (typeof value === 'string'){
      return '';
    }
    return value!=-1?String.fromCharCode('A'.charCodeAt()+value):'';
  }

  formatAnswer(answer,type){
    if (type=='TRUE_OR_FALSE') {
      if (answer == 0)
        return '错误';
      if (answer == 1)
        return '正确';
    }
    return answer;
  }

  renderReport = () => {
    let right = 0;
    let wrong = 0;
    let questions = this.props.course.questions;
    let standardAnswers = this.props.course.questions.map(v=>(v.standardAnswer));
    let formatedAnswers = {};
     Object.keys(answers).map(k=>{
       let type = questions[k].questionType;
       let v = answers[k];
       switch (type){
         case 'SINGLE_OPTION': formatedAnswers[k] = String.fromCharCode('A'.charCodeAt()+v);
           break;
         case 'MULTIPLE_OPTION': formatedAnswers[k] = v.map(i=>(String.fromCharCode('A'.charCodeAt()+i))).sort().join(',');
           break;
         default: formatedAnswers[k] = v;
           break;
       }
    });
    standardAnswers.map((v,k)=>{
      if (formatedAnswers[k]!=null)
        formatedAnswers[k]==v?right++:wrong++;
    });
    let total = standardAnswers.length;
    let columns = [{
      title: '做对试题',
      render: () => (<span style={{color:'#47ad76'}}>{right}</span>)
    },{
      title: '做错试题',
      render: () => (<span style={{color:'#ee491f'}}>{wrong}</span>)
    },{
      title: '未做试题',
      render: () => (<span style={{color:'orange'}}>{total-right-wrong}</span>)
    },{
      title: '已做/总题量',
      render: () => (right+wrong+'/'+total)
    }];
    return(
      <Row align="middle">
        <Col span="7">
          <Progress type="circle" percent={Number((right/total*100).toFixed(0))} format={p=>p==100?'Perfect!':p+'%'}/>
        </Col>
        <Col span="17">
          <Table columns={columns} dataSource={[{}]} pagination={false}/>
        </Col>
      </Row>
    )
  };

  render() {
    let {current,answerVisible,value,reportVisible} = this.state;
    let {questions,types} = this.props.course;
    let q = questions[current]||{};
    return (
      <Row>
        <Card>
          <Progress percent={((current+1)/questions.length)*100} status="exception" format={_=>('('+(current+1)+'/'+questions.length+')')} />
        </Card>
        <Row style={{marginTop:'20px'}}>
          <Col span="20">
            <Card className={styles["question-card"]}>
              <div style={{fontSize:'large',color:'#333'}}>
                <TypeSpan type={types[q.questionType]}/>　<span dangerouslySetInnerHTML={{__html:q.content}}/>
              </div>
              {this.renderQuestion(q)}
              <div className={styles['answer']} style={{display:!answerVisible&&value==-1?'none':''}}>
                <div style={{display:q.questionType=='DESCRIPTION'?'none':''}}>
                  参考答案：<em className={styles['right']}>{this.formatAnswer(q.standardAnswer,q.questionType)}</em>　　您的答案：<em className={styles['wrong']}>{this.renderAnswer()}</em>　　易错项：<em className={styles['max-wrong']}>{this.formatAnswer(q.maxWrongAnswer,q.questionType)}</em>
                </div>
                <div>
                  答案解析：<br/><span className={styles['analysis']} dangerouslySetInnerHTML={{__html:q.analysis}}/>
                </div>
              </div>
            </Card>
            <div className={styles["action-btns"]}>
              <Row>
                <Col onClick={this.last} span="8" className={styles["action-btn"]}><Icon type="left"/> 上一题</Col>
                <Col onClick={()=>this.setState({answerVisible:true})} span="8" style={{textAlign:'center'}} className={styles["action-btn"]}><Icon type="book"/> 参考答案</Col>
                <Col onClick={this.next} span="8" style={{textAlign:'right'}} className={styles["action-btn"]}>下一题 <Icon type="right"/></Col>
              </Row>
            </div>
          </Col>
          {/*<Col offset="1" span="5">
           <Card>
           </Card>
           </Col>*/}
        </Row>
        <Modal title="试题报告"
               visible={reportVisible}
               onCancel={()=>this.setState({reportVisible:false})}
               footer={<Button className={styles['confirm-btn']} style={{float:'inherit'}} onClick={()=>this.setState({reportVisible:false})}>确定</Button>}>
          {this.renderReport()}
        </Modal>
      </Row>
    );
  }

}

function TypeSpan({type}) {
  return type ? <span style={{color:'#e45c40'}}>{'[' + type + ']'}</span> : <span/>
}
export default connect(({course})=>({course}))(PaperQuestions);
