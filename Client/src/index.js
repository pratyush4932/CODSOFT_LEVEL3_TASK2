import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress console noise in non-development environments
if (process.env.NODE_ENV !== 'development') {
  const noop = () => {};
  console.log = noop;
  console.debug = noop;
  console.info = noop;
  console.warn = noop;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
