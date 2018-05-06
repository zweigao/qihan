/**
 * Created by fangf on 2016/11/12.
 */
import React  from 'react';
import SortableTree from 'react-sortable-tree';

export default class Tree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [{ title: 'Chicken', children: [ { title: 'Egg' } ] },
        { title: 'Chicken', children: [ { title: 'Egg' } ] },
        { title: 'Chicken', children: [ { title: 'Egg' } ] },
        { title: 'Chicken', children: [ { title: 'Egg' } ] },
        { title: 'Chicken', children: [ { title: 'Egg' } ] },
        { title: 'Chicken', children: [ { title: 'Egg' } ] },
        { title: 'Chicken', children: [ { title: 'Egg' } ] },
        { title: 'Chicken', children: [ { title: 'Egg' } ] }]
    };
  }

  render() {
    return (
      <SortableTree
        style={{top:'10px',bottom:0,left:'10px',right:0,position:'absolute'}}
        treeData={this.state.treeData}
        onChange={treeData => this.setState({ treeData })}
      />
    );
  }
}
