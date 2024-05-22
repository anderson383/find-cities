import './index.scss';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RepositoryIocProvider } from './services/config/context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <RepositoryIocProvider>
    <App />
  </RepositoryIocProvider>
);
