/**
 * Created by fangf on 2016/11/15.
 */
import axios from 'axios'

export function getAll(postData){
  return axios.get('/VideoManager/Retrive.action', {params: {...postData,pageIndex:0,pageSize:0}});
}

export function add(videoUrl,name,category){
  // return Http.post('/VideoManager/create.action',{videoUrl,name,category})
  return axios.post('VideoManager/create.action', {learnVideo: {videoUrl,name} ,menuItemIds:category})
}

export function del(ids) {
  return axios.post('/VideoManager/Delete.action',ids)
}

export function upd(id,videoUrl,name,category) {
  return axios.post('VideoManager/Update.action', {learnVideo: {id,videoUrl,name} ,menuItemIds:category})
}

export function updRelative(data) {
  return axios.post('VideoManager/RalativeUpdate.action', data)
}
