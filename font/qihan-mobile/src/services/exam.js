import axios from 'axios'
import qs from 'qs'

export function getPaperList (data) {
  return axios.post('LearnBoardInfo/getPaperList.action', data)
}

export function getChapterList (data) {
  return axios.post('LearnBoardInfo/getChapterList.action', data)
}

export function getChapterQuestionBank (data) {
  return axios.post('LearnBoardInfo/getChapterQuestionBank.action', data)
}

export function getPaperQuestionBank (data) {
  return axios.post('LearnBoardInfo/getPaperQuestionBank.action', data)
}
