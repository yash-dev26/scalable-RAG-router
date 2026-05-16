import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-b1348fw81infose0.us.auth0.com"
      clientId="jGztfPxFl0IYLZGZLhYsKO4eiAA8DItX"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "adaptive-rag-api"
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)