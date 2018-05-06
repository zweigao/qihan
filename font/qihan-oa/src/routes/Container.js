import React from 'react';
import Layout from '../components/Layout';

const Container = React.createClass({
  
  render: function () {
    return (
      <Layout>{this.props.children}</Layout>
    );
  }

});

export default Container;
