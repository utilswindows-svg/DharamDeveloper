import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/authStore";
import App from "./App.tsx";
import "./index.css";

// Expose Facebook App ID for the SDK initializer in index.html
const FB_APP_ID = (import.meta as any).env?.VITE_FACEBOOK_APP_ID;
if (FB_APP_ID) {
  (window as any).__FB_APP_ID = FB_APP_ID;
  if ((window as any).FB && (window as any).fbAsyncInit) (window as any).fbAsyncInit();
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
