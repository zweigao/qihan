/**
 * Created by fangf on 2016/11/25.
 */
let user = sessionStorage.userInfo;

export default {
  namespace:'user',
  state:user?JSON.parse(user):{},
  reducers:{
    save(state,{user}){
      state = user;
      return {...state}
    },
    clear(){
      return {}
    }
  }
}
