import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import awsConfig from './aws-config'
import './index.css'
import App from './App.jsx'

// Configure AWS Amplify
Amplify.configure(awsConfig);

// Configure Auth
cognitoUserPoolsTokenProvider.setKeyValueStorage(window.localStorage);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
