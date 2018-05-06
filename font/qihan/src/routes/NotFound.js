import React, {Component} from 'react';

let notFoundImg = require('../assets/404.gif');

class NotFound extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{textAlign:'center',marginBottom:20}}>
        <img src={notFoundImg} alt="404 NotFound"/>
      </div>
    );
  }

}

export default NotFound;
