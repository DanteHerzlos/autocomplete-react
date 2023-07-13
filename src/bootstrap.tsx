import { createRoot } from "react-dom/client";
import App from "./App";

const renderApp = (el: any) => {
  createRoot(el).render(<App />);
};

if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "production"
) {
  const selector = document.querySelector("#service_container");
  if (selector) {
    renderApp(selector);
  }
}

export { renderApp };
