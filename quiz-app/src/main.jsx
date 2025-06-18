import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.jsx';
import { ApolloProvider } from '@apollo/client';
import client from './components/apolloClient.js';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ApolloProvider client={client}>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </ApolloProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>,
);