import React from 'react';
import ReactDOM from 'react-dom';
import PulseLoader from 'react-spinners/PulseLoader';
import './index.css';
import './services/i18n';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense
      fallback={
        <div className="loading">
          <PulseLoader />
        </div>
      }
    >
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
);
