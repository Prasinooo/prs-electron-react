import React from 'react';
import { MemoryRouter as Router, Switch, Route, Link } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.global.css';
import './style/common.css';
import VideoPage from './pages/Video';
import AudioPage from './pages/Audio';
import TestPage from './pages/test';
// window.React2 = require('react');

const Hello = () => {
  //   console.log('react', window.React1, window.React2)
  // console.log(window.React1 === window.React2);
  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div>
        <Link to="/audio">Audio</Link>
        <Link to="/hello">Hello</Link>
        <Link to="/video">Video</Link>
        <Link to="/test">Test</Link>
      </div>
      <Switch>
        <Route path="/" exact component={VideoPage} />
        <Route path="/hello" component={Hello} />
        <Route path="/video">{VideoPage}</Route>
        <Route path="/audio">{AudioPage}</Route>
        <Route path="/test">{TestPage}</Route>
      </Switch>
    </Router>
  );
}
