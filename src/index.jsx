import { createRoot } from 'react-dom/client';
import bootUI5 from './ui5/bootUI5';
import App from './App';
import * as serviceWorker from './serviceWorker';

// bootstrap UI5
await bootUI5(document, { theme: 'sap_horizon' });

// Render the React application
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
