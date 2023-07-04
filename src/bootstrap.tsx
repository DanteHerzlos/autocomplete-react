import ReactDOM from "react-dom"
import App from "./App"


const renderApp = (el: any) => {
  ReactDOM.render(
        <App />,
    el
  )
}

if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "production"
) {
  const selector = document.querySelector("#service_container")
  if (selector) {
    renderApp(selector)
  }
}

export { renderApp }
