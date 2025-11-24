"use client"

import * as React from "react"
import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription } from "./toast"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

const TOAST_LIMIT = 3

const ToastContext = React.createContext<{ toast: (props: ToastProps) => void }>({
  toast: () => {},
})

export function useToast() {
  return React.useContext(ToastContext)
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    setToasts(prev => [...prev.slice(-TOAST_LIMIT + 1), props])
    setTimeout(() => {
      setToasts(prev => prev.slice(1))
    }, props.duration ?? 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastProvider>
        {toasts.map((t, i) => (
          <Toast key={i} variant={t.variant}>
            <ToastTitle>{t.title}</ToastTitle>
            <ToastDescription>{t.description}</ToastDescription>
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}
