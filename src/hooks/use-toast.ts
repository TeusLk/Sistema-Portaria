
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast"
import {
  toast as sonnerToast,
} from "sonner"

type ToastProps_ = ToastProps

const useToast = () => {
  return {
    toast: ({ title, description, variant, action }: ToastProps) => {
      if (variant === "destructive") {
        return sonnerToast.error(title as string, {
          description: description as React.ReactNode,
        })
      }

      return sonnerToast(title as string, {
        description: description as React.ReactNode,
      })
    },
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
    // Add empty toasts array for compatibility with toaster.tsx
    toasts: [],
  }
}

export { useToast }
export const toast = sonnerToast
// Use export type for re-exporting types with isolatedModules enabled
export type { Toast, ToastProps_, ToastActionElement }
