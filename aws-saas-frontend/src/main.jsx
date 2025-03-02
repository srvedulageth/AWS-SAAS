import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './aws-config';
import App from './App.jsx';
import DebugAuth from "./DebugAuth";

console.trace('Trace before rendering the app');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <DebugAuth />
  </StrictMode>,
)
