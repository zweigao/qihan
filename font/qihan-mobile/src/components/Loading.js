import React from 'react';
import { Progress } from 'antd-mobile';

class Loading extends React.Component {

  constructor (...args) {
    super(...args)
    this.state = {
      one: false,
      two: false,
      three: false
    }
  }

  componentDidMount() {
    this.timer = setTimeout(() => this.setState({ one: true }), 17)
    this.timer = setTimeout(() => this.setState({ two: true }), 500)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.doneLoading) {
      this.setState({ ...this.state, three: true})
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  getPercent () {
    if (this.state.three) {
      return 100
    } else if (this.state.two) {
      return 90
    } else if (this.state.one) {
      return 20
    } else {
      return 0
    }
  }

  render () {
    return (
      <Progress percent={this.getPercent()} position="fixed" unfilled="hide"></Progress>
    )
  }
}

export default Loading;
