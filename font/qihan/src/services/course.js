/**
 * Created by fangf on 2016/11/25.
 */
import axios from 'axios';

export function getVideos(learnItemId) {
  return axios.post('/LearnBoardInfo/getCourseVideoInfo.action',{learnItemId});
}

export function getPaperList(courseItemid,pageIndex=0,pageSize=0) {
  return axios.post('/LearnBoardInfo/getPaperList.action',{courseItemid,pageIndex,pageSize});
}

export function getPaperQuestions(courseItemId,paperName) {
  return axios.post('/LearnBoardInfo/getPaperQuestionBank.action',{courseItemId,paperName});
}

export function getChapterList(courseItemId) {
  return axios.post('/LearnBoardInfo/getChapterList.action',{courseItemId});
}

export function getChapterQuestions(chapterId) {
  return axios.post('/LearnBoardInfo/getChapterQuestionBank.action',{chapterId})
}
