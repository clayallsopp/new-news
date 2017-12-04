import * as React from 'react';
import { connect } from 'react-redux';
import { State } from './reducers';

import './App.css';

const logo = require('./logo.svg');

interface IProps { 
  state: State;
}

class App extends React.Component<IProps> {
  render() {
    (window as any).state = this.props.state;
    console.log(logo);
    return (
      <div className="App">
        Subscribed to {Object.keys(this.props.state.subscribedSources).length} sources
      </div>
    );
  }
}

const mapStateToProps = (state: State) => {
  return { state };
};

const ConnectedApp = connect(
  mapStateToProps,
)(App);

export default ConnectedApp;
