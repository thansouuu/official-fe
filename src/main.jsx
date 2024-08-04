import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import './styles/index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SWRConfig } from 'swr';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <SWRConfig
                    value={{
                        revalidateOnFocus: false,
                        revalidateOnReconnect: false,
                        shouldRetryOnError: false,
                    }}
                >
                    <App />
                </SWRConfig>
            </GoogleOAuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
