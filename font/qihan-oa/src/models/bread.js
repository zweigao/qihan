/**
 * Created by fangf on 2016/11/11.
 */
let bread;
if (sessionStorage.route) {
  bread = JSON.parse(sessionStorage.route).bread;
  let temp = ['首页'];
  bread.map((v)=>{
    temp.push(v);
  });
  bread = temp;
}
export default {
  namespace: 'bread',
  state: bread||['首页','控制台'],
  reducers: {
    save(state, action) {
      state = ['首页'];
      action.payload.map((v)=>{
        state.push(v);
      });
      return state;
    }
  }
};
