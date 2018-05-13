import React from 'react';
import {connect} from 'dva';
import md5 from '../../utils/md5';
import styles from './layout.less';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

let avatar = "http://cdn.v2ex.co/gravatar/"+md5(sessionStorage.username)+"?s=300&d=identicon";

const Aside = React.createClass({

  getInitialState(){
    if (sessionStorage.tokenType==='SU') this.links = require('../../asset/aside/super.json');
    else if (sessionStorage.tokenType==='MANAGER') this.links = require('../../asset/aside/admin.json');
    else if (sessionStorage.tokenType==='SALEMAN') this.links = require('../../asset/aside/saleman.json');
    else if (sessionStorage.tokenType==='FINANCE') this.links = require('../../asset/aside/finance.json');
    else if (sessionStorage.tokenType==='MARKET') this.links = require('../../asset/aside/market.json');
    else this.links = {};
    return {}
  },

  // ask for `router` from context
  contextTypes: {
    router: React.PropTypes.object
  },

  gotoLink(item) {
    let key = item.key.split('-');
    console.log(key)
    let link;
    let links = this.links;
    let bread = [];
    bread.push(links[key[0]].title);
    let route = {key: item.key};
    if (key.length == 1) link = links[key[0]];
    else{
      link = links[key[0]].sub[key[1]];
      route.id = key[1];
      route.pKey = key[0];
      bread.push(link.title);
    }
    route.bread=  bread;
    sessionStorage.route = JSON.stringify(route);
    this.context.router.push(link.link);
    this.props.dispatch({
      type:'bread/save',
      payload:bread
    });
  },

  menu(links){
    let a = [];
    links.map(([linkName,{icon,link,title,sub}])=>{
      if (sub&&sub.length>0) {
        a.push(
          <SubMenu key={linkName} title={<span><Icon type={icon} />{title}</span>}>
            {this.submenu(sub,linkName)}
          </SubMenu>
        )
      } else a.push(<Menu.Item key={linkName} keyPath>{<span><Icon type={icon} />{title}</span>}</Menu.Item>);
    });
    return a;
  },

  submenu(sub,linkName){
    let a = [];
    if (sub&&sub.length>0)
      sub.forEach((v,k)=>{
        a.push(<Menu.Item key={linkName+'-'+k}>{v.title}</Menu.Item>);
      });
    return a;
  },

  render: function () {
    let route={};
    if (sessionStorage.route)
      route = JSON.parse(sessionStorage.route);
    let defaultOpenKeys = [];
    defaultOpenKeys.push(route.pKey||route.key||Object.keys(this.links)[0]);
    let defaultSelectedKeys = [];
    let linkName = route.pKey||defaultOpenKeys[0];
    if (this.links[linkName]&&this.links[linkName].sub)
      defaultSelectedKeys.push(defaultOpenKeys[0]+'-'+route.id||0);
    else defaultSelectedKeys.push(linkName);
    return (
      <aside className={styles['ant-layout-sider']}>
        <div className={styles['ant-layout-logo']}></div>
        <Menu mode="inline" theme="dark"
              defaultSelectedKeys={defaultSelectedKeys} defaultOpenKeys={defaultOpenKeys}
              onClick={this.gotoLink}>
          <Menu.Item key="avatar" className={styles['aside-avatar']} style={{paddingRight:'24px',height:'inherit',display:'none'}}>
            <img src={avatar}/>
            <div>管理员<Icon type="down"/></div>
          </Menu.Item>
          {this.menu(Object.entries(this.links))}
        </Menu>
      </aside>
    );
  }

});

export default connect(({bread})=>({bread}))(Aside);
