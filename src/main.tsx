import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// Create a client
const queryClient = new QueryClient()

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="8883686129-hju0doe41ltkkgj2072act0t2ca11qrg.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
