import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Application from './components/Application.jsx';

const mountNode = document.querySelector('#application');

injectTapEventPlugin();
ReactDOM.render(<Application results={window.geminiTestResults} window={window} />, mountNode);
