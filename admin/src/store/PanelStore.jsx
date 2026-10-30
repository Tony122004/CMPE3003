import { createContext } from "react"

export const PanelStore = createContext()

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function parseUnderscoreDate(raw) {
  const [day, monthIdx, year] = raw.split("_")
  return `${day} ${MONTH_LABELS[Number(monthIdx)]} ${year}`
}

function yearsFromBirth(dob) {
  const now = new Date()
  return now.getFullYear() - new Date(dob).getFullYear()
}

export function PanelStoreProvider({ children }) {
  const panelConfig = {
    backendUrl: import.meta.env.VITE_BACKEND_URL,
    currency: import.meta.env.VITE_CURRENCY,
    slotDateFormat: parseUnderscoreDate,
    calculateAge: yearsFromBirth,
  }

  return (
    <PanelStore.Provider value={panelConfig}>
      {children}
    </PanelStore.Provider>
  )
}
