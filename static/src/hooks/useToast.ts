import { useContext } from "react"
import { ToastContext, IToastHelper } from "../components/toast/toastProvider"

export default function useToast() {
  const toastHelprer = useContext(ToastContext)
  return toastHelprer as IToastHelper
}