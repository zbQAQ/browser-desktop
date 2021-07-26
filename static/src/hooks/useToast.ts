import { useContext } from "react"
import { ToastContext, IToastHelper } from "../components/toast/toastProvider"
import { ToastInstance } from "@/components/toast/toast"

export default function useToast() {
  const toastHelprer = useContext(ToastContext)
  return toastHelprer as IToastHelper
}

export type ToastInstanceType = ToastInstance
