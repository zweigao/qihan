// import React from 'react';
// import {connect} from 'dva';
// import { List, WhiteSpace, WingBlank, NavBar, SearchBar} from 'antd-mobile';
// const Item = List.Item

// class SchoolList extends React.Component {

//   constructor (props) {
//     super(props)
//     // console.log(this.props)
//     this.state = {
//       searchText: ''
//     }

//     this.onSearchChange = this.onSearchChange.bind(this)
//   }

//   onSearchChange (value) {
//     // console.log(value)
//     this.setState({
//       ...this.state,
//       searchText: value
//     })
//   }

//   render () {
//     const { schools }=this.props
//     console.log(schools)
//     let schoolLitile = schools.slice(0,20)
//     return (
//       <div>
//         <NavBar leftContent={'返回'}
//           mode="light"
//           onLeftClick={this.props.hiddenPopup}
//           rightContent={null}>
//           {'选择学校'}
//         </NavBar>
//         <SearchBar placeholder="搜索" onChange={this.onSearchChange}></SearchBar>
//         <List>
//           {schools.length > 0?
//             schools.filter(m => m.indexOf(this.state.searchText) >= 0).map((m, index) => {
//               return (
//                 <Item key={index} arrow="horizontal" onClick={() => this.props.onSchoolClick(m)}>{m}</Item>
//               )
//             }): null
//           }
//         </List>
//       </div>
//     )
//   }
// }

// export default SchoolList


import React from 'react';
import { List, Avatar, Button, Spin } from 'antd';
import { WhiteSpace, WingBlank, NavBar, SearchBar} from 'antd-mobile'
// import { List, Button, WhiteSpace, WingBlank, NavBar, SearchBar} from 'antd-mobile'
import {connect} from 'dva'
import reqwest from 'reqwest'
const fakeDataUrl = 'http://114.215.220.4:8080/QihanOA/RegisterAction/getSchoollist.action';
const Item = List.Item

let styles = {
    display:"block",
    height:"1.2rem",
    lineHeight:"1.2rem",
    paddingLeft:"1rem",
    borderBottom:"1px solid #efeff4"
}

let stylesBtn = {
    marginBottom:"1rem",
    display:"inline-block",
    width:"4rem",
    height:"1rem",
    borderRadius:"5px",
    border:"0px"
}


class SchoolList extends React.Component {
  constructor (props) {
      super(props)
      // console.log(this.props)
      this.state = {
        loading: true,
        loadingMore: false,
        showLoadingMore: true,
        data: [],
        searchText: '',
        schoolsList:[]
        }
      this.onSearchChange = this.onSearchChange.bind(this)
  }

  componentWillMount() {
    this.getData((res) => {
      // console.log(res.data)
      let nowData = []
      nowData = res.data.slice(0,20)
      // console.log(nowData)
      this.setState({
        loading: false,
        data: nowData,
        schoolsList:res.data
      });
    });
  }

  getData = (callback) => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res) => {
        callback(res);
      },
    });
  }

  onSearchChange (value) {
    this.setState({
      ...this.state,
      searchText: value
    })
    // this.state.schoolsList.filter(m => m.indexOf(this.state.searchText) >= 0).map((m, index) => {
    //   console.log(m)
    // }
    // console.log(this.state.schoolsList)
    console.log(value)
    if(value == null || value ==""){
      // console.log(1111)
      let nowData = this.state.schoolsList.slice(0,20)
      this.setState({
          ...this.state,
          data : nowData,
          showLoadingMore: true,
       })
    }
    else{
      let searchList= this.state.schoolsList.filter( m => m.indexOf(value) >= 0)
      console.log(searchList)
        this.setState({
          ...this.state,
          data:searchList,
          showLoadingMore: false,
      })
    }  
  }

  onLoadMore = () => {
    let _this=this
    this.setState({
      loadingMore: true,
    });
    this.getData((res) => {
      // console.log(res)
      let schoolList = res.data.slice(_this.state.data.length, parseInt(_this.state.data.length)+10)
      let newData = _this.state.data.concat(schoolList)
      // console.log(newData)
      _this.setState({
        data: newData,
        loadingMore: false,
      }, () => {
        window.dispatchEvent(new Event('resize'));
      });
    });
  }

  render() {
    const { loading, loadingMore, showLoadingMore, data } = this.state;
    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin />}
        {!loadingMore && <Button onClick={this.onLoadMore} style={stylesBtn}>点击加载更多</Button>}
      </div>
    ) : null;
    const { schools } = this.props
    return (
      <div>
        <NavBar leftContent={'返回'}
          mode="light"
          onLeftClick={this.props.hiddenPopup}
          rightContent={null}>
          {'选择学校'}
        </NavBar>
        <SearchBar placeholder="搜索" onChange={this.onSearchChange}></SearchBar>
        
        <List
          size="small"
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={data}
          renderItem={item => (<List.Item onClick={() => this.props.onSchoolClick(item)} style={styles}>{item}</List.Item>)}
        />
      </div>
    );
  }

}



export default SchoolList
