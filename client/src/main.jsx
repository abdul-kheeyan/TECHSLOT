import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ApiStartupGate from './components/ApiStartupGate';
import App from './App';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ApiStartupGate>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ApiStartupGate>
    </BrowserRouter>
  </StrictMode>
);