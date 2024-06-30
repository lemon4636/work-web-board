import { loadMicroApp } from 'qiankun';
import React from 'react';

export default class MicroApp extends React.Component {
  constructor(props) {
    super(props)
    this.containerRef = React.createRef();
    this.microApp = null;
  }

  componentDidMount() {
    const { app } = this.props
    console.log('componentDidMount', app)
    this.microApp = loadMicroApp({
      ...app,
      container: this.containerRef.current,
    }, {
      sandbox: {
        strictStyleIsolation: true,
        experimentalStyleIsolation: true,
      },
    });
  }

  componentWillUnmount() {
    this.microApp.unmount();
  }

  // componentDidUpdate() {
  //   this.microApp.update({ name: 'kuitos' });
  // }

  render() {
    const { app } = this.props
    return <div>
      <h1>HomeMicroAppBox：{app.name}</h1>
      <div ref={this.containerRef}></div>
    </div>
  }
}
