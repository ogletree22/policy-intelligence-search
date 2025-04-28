import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import awsConfig from './aws-config'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import { SearchPageProvider } from './context/SearchPageContext';
import { FolderProvider } from './context/FolderContext';
import { WorkingFolderProvider } from './context/WorkingFolderContext';
import { FolderPageProvider } from './context/FolderPageContext';
import { ChatProvider } from './context/ChatContext';

// Configure AWS Amplify
Amplify.configure(awsConfig);

// Configure Auth
cognitoUserPoolsTokenProvider.setKeyValueStorage(window.localStorage);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SearchPageProvider>
        <FolderProvider>
          <WorkingFolderProvider>
            <FolderPageProvider>
              <ChatProvider>
                <App />
              </ChatProvider>
            </FolderPageProvider>
          </WorkingFolderProvider>
        </FolderProvider>
      </SearchPageProvider>
    </AuthProvider>
  </StrictMode>,
)
