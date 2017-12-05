import * as React from 'react';

import NavBar from './NavBar';
import NewsView from './NewsView';

import './App.css';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <NewsView />
      </div>
    );
  }
}