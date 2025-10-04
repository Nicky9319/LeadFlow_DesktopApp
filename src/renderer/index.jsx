import './Features/common/assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import App from './App'

// Check if this is a widget request or setup request
const urlParams = new URLSearchParams(window.location.search);
const isWidget = urlParams.get('widget') === 'true';
const isSetup = urlParams.get('setup') === 'true';

console.log('MAIN RENDERER INDEX.JSX LOADED!', isWidget ? 'WIDGET MODE' : isSetup ? 'SETUP MODE' : 'MAIN APP MODE');

if (isWidget) {
  // Load widget components
  import('../widget/widget-main.jsx').then(({ default: WidgetApp }) => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <Provider store={store}>
          <WidgetApp />
        </Provider>
      </StrictMode>
    )
  });
} else if (isSetup) {
  // Load setup components
  import('../setup/components/SetupPage.jsx').then(({ default: SetupPage }) => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <Provider store={store}>
          <SetupPage />
        </Provider>
      </StrictMode>
    )
  });
} else {
  // Load main app
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  )
}
