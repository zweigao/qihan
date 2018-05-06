import axios from 'axios'
import qs from 'qs'

export function getVideoList (learnItemId) {
  return axios.post('LearnBoardInfo/getCourseVideoInfo.action', {learnItemId})
}
