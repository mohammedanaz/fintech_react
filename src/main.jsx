import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App.jsx'
import {Provider} from "react-redux";
import {persistor, store} from "./redux/stores/store";
import {PersistGate} from "redux-persist/lib/integration/react";
import Spinner from "./components/Spinner/Spinner.jsx"

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={<Spinner />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
