import React from 'react';
import { Flex } from 'antd-mobile';
import styles from './NoFound.less'

const Item = Flex.Item

function NoFound() {
  return (
    <Flex className={styles.container} justify="center">
    <div className="code">
      <span style={{color: 'gray'}}>
        // 404 找不到页面.
      </span>
      <span>
        <span style={{color:'#bf616a'}}>
          {'if '}
        </span>
        (!<span style={{'fonStyle':'italic'}}>found</span>)
        {' {'}
      </span>
      <span>
        <span style={{'paddinLeft': '15px',color:'rgb(0, 110, 196)'}}>
           <i style={{width: '10px',display:'inline-block'}}></i>throw
        </span>
        <span >
          (<span style={{color: '#a6a61f'}}>(╯°□°)╯︵ ┻━┻</span>);
        </span>
        <span style={{display:'block'}}>}</span>
      </span>
    </div>
    </Flex>
  );
}

export default NoFound
