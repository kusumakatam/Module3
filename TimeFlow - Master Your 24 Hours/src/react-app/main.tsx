import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/react-app/index.css";
import App from "@/react-app/App.tsx";

console.log('main.tsx loaded');

try {
  const rootElement = document.getElementById("root");
  console.log('Root element:', rootElement);
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log('React app rendered');
} catch (error) {
  console.error('Error rendering app:', error);
  document.body.innerHTML = '<div style="padding: 20px; color: red;"><h1>Error</h1><pre>' + error + '</pre></div>';
}
