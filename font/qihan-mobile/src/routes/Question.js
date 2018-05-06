import React from 'react';
import {connect} from 'dva';
import { WhiteSpace, Icon, List, Modal, Popup, Result, Button } from 'antd-mobile';
import styles from './Question.less'
import Footer from '../components/Question/Footer'
import QuestionItem from '../components/Question/QuestionItem'
import { Link, browserHistory } from 'dva/router'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  // Note: the popup content will not scroll.
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

const alert = Modal.alert

function Question({ dispatch, exam, route, router }) {
  const footerProps = {
    route,
    router,
    next () {
      if (exam.curQueIndex < exam.questionList.length - 1) {
        dispatch({ type: 'exam/nextQue' })
        dispatch({ type: 'global/updateTitle' })
      } else {
        const finishNum = exam.questionList.filter((q) => q.stuAnswer !== null).length
        const rightNum = exam.questionList.filter((q) => {
          if (q.stuAnswer === null) {
            return false
          } else if (q.questionType === 'SINGLE_OPTION') {
            return String.fromCharCode(65 + q.stuAnswer) === q.standardAnswer
          } else if (q.questionType === 'MULTIPLE_OPTION') {
            return q.stuAnswer.map((a) => String.fromCharCode(65 + a)).sort((a, b) => a > b).join(',') === q.standardAnswer
          } else if (q.questionType === 'TRUE_OR_FALSE') {
            return q.stuAnswer == q.standardAnswer
          } else {
            return false
          }
        }).length
        alert('返回', finishNum === exam.questionList.length? '答题已结束，确定返回吗' : '还有题目未答，确定返回吗', [
          { text: '取消' },
          { text: '确定', onPress: () => {
            dispatch({ type: 'global/setOnLeftClick', payload: {onLeftClick: null} })
            Popup.show(
            <Result
              className={styles.popup}
              imgUrl={require('../assets/pass.png')}
              title="答题结果"
              message={
                <div >
                  <span>{`总题${exam.questionList.length}`} </span>
                  <span className={styles.right}>{`答对${rightNum}`} </span>
                  <span className={styles.unfinish}>{`未答${exam.questionList.length - finishNum}`}</span>
                  <Button type="primary" onClick={() => {Popup.hide(); browserHistory.goBack()}}>确定</Button>
                </div>
              }
            >
            </Result>
          , { animationType: 'slide-up', maskClosable: false, wrapProps })}}
        ])
      }
      
      document.getElementById('que-content').scrollTop = 0
    },
    prev () {
      dispatch({ type: 'exam/prevQue' })
      dispatch({ type: 'global/updateTitle' })
    },
    toggleAnswer () {
      dispatch({ type: 'exam/toggleAnswer' })
    },
    setOnLeftClick () {
      dispatch({ type: 'global/setOnLeftClick', payload: { onLeftClick () {
        const finishNum = exam.questionList.filter((q) => q.stuAnswer !== null).length
        alert('返回', <div>{`还有 ${exam.questionList.length - finishNum} 道题没做`}<br></br>{`是否确定下次在再做`}</div>, [
          { text: '取消' },
          { text: '确定', onPress: () => {
            browserHistory.goBack()
            dispatch({ type: 'global/setOnLeftClick', payload: {onLeftClick: null} })
          }}
        ])
      }}})
    }
  }
  const itemProps = {
    question: exam.questionList[exam.curQueIndex],
    answer (answer) {
      dispatch({type: 'exam/answer',  payload: { answer } })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content} id="que-content">
        {itemProps.question? <QuestionItem {...itemProps}></QuestionItem> : null}
      </div>
      <div className={styles.footer}>
        <Footer {...footerProps}></Footer>
      </div>
    </div>
  );
}

export default connect(({ exam }) => ({ exam }))(Question);
