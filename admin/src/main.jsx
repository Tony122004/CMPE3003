import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import "./index.css"
import { StaffStoreProvider } from "./store/StaffStore.jsx"
import { ClinicianStoreProvider } from "./store/ClinicianStore.jsx"
import { PanelStoreProvider } from "./store/PanelStore.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StaffStoreProvider>
      <ClinicianStoreProvider>
        <PanelStoreProvider>
          <App />
        </PanelStoreProvider>
      </ClinicianStoreProvider>
    </StaffStoreProvider>
  </BrowserRouter>,
)
