
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add global styles for loading transitions
const style = document.createElement('style');
style.textContent = `
  .page-transition-fade {
    transition: opacity 400ms ease;
  }
  
  .page-loading {
    opacity: 0;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
